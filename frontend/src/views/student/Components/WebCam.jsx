import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';
import { drawRect } from './utilities';
import { Box, Typography, Stack, LinearProgress } from '@mui/material';
import swal from 'sweetalert';
import { UploadClient } from '@uploadcare/upload-client';

const client = new UploadClient({ publicKey: 'e69ab6e5db6d4a41760b' });

// Module-level counters — survive re-renders and stale closures
const countsRef = { noFace: 0, multipleFace: 0, cellPhone: 0, prohibitedObject: 0 };
const lastDetectionTime = {};

export default function WebCam({ cheatingLog, updateCheatingLog }) {
  const webcamRef  = useRef(null);
  const canvasRef  = useRef(null);
  const netRef     = useRef(null);   // store loaded model
  const intervalRef = useRef(null);

  const [modelStatus, setModelStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [lastAlert, setLastAlert]     = useState('');
  const [liveViolations, setLiveViolations] = useState({
    noFace: 0, multipleFace: 0, cellPhone: 0, prohibitedObject: 0,
  });

  // ── Screenshot helper ─────────────────────────────────────
  const captureAndUpload = async (type) => {
    try {
      const video = webcamRef.current?.video;
      if (!video || video.readyState !== 4 || !video.videoWidth) return null;
      const canvas = document.createElement('canvas');
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      const file = dataURLtoFile(dataUrl, `${type}_${Date.now()}.jpg`);
      const result = await client.uploadFile(file);
      return { url: result.cdnUrl, type, detectedAt: new Date() };
    } catch {
      return null;
    }
  };

  // ── Violation handler ─────────────────────────────────────
  const handleDetection = async (type) => {
    const now  = Date.now();
    const last = lastDetectionTime[type] || 0;
    if (now - last < 5000) return; // 5s cooldown
    lastDetectionTime[type] = now;

    countsRef[type] = (countsRef[type] || 0) + 1;
    const newCount = countsRef[type];

    // Live UI update
    setLiveViolations({ ...countsRef });

    const msgs = {
      noFace:           '⚠️ Face not visible!',
      multipleFace:     '⚠️ Multiple faces detected!',
      cellPhone:        '⚠️ Phone detected!',
      prohibitedObject: '⚠️ Prohibited object!',
    };
    setLastAlert(msgs[type] || '⚠️ Violation!');
    setTimeout(() => setLastAlert(''), 4000);

    // Screenshot (non-blocking)
    captureAndUpload(type).then((screenshot) => {
      const updatedLog = {
        noFaceCount:           countsRef.noFace,
        multipleFaceCount:     countsRef.multipleFace,
        cellPhoneCount:        countsRef.cellPhone,
        prohibitedObjectCount: countsRef.prohibitedObject,
      };
      if (screenshot) updatedLog.screenshots = [...(cheatingLog?.screenshots || []), screenshot];
      updateCheatingLog(updatedLog);
    });

    // Alert (non-blocking)
    const titles = {
      noFace:           'Face Not Visible',
      multipleFace:     'Multiple Faces Detected',
      cellPhone:        'Cell Phone Detected',
      prohibitedObject: 'Prohibited Object Detected',
    };
    swal(titles[type] || 'Violation', `Violation count: ${newCount}`, 'warning');
  };

  // ── Detection loop ────────────────────────────────────────
  const detect = async () => {
    if (!netRef.current)                                     return;
    if (!webcamRef.current?.video)                           return;
    if (webcamRef.current.video.readyState !== 4)            return;

    const video = webcamRef.current.video;
    const { videoWidth: vw, videoHeight: vh } = video;

    video.width = vw;
    video.height = vh;
    if (canvasRef.current) {
      canvasRef.current.width  = vw;
      canvasRef.current.height = vh;
    }

    try {
      const predictions = await netRef.current.detect(video);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, vw, vh);
        drawRect(predictions, ctx);
      }

      let personCount  = 0;
      let faceDetected = false;

      for (const p of predictions) {
        const cls = p.class;
        if (cls === 'cell phone') {
          handleDetection('cellPhone');
        }
        if (cls === 'book' || cls === 'laptop') {
          handleDetection('prohibitedObject');
        }
        if (cls === 'person') {
          faceDetected = true;
          personCount++;
          if (personCount > 1) handleDetection('multipleFace');
        }
      }

      if (!faceDetected) handleDetection('noFace');
    } catch (err) {
      console.error('Detection error:', err);
    }
  };

  // ── Load model on mount ───────────────────────────────────
  useEffect(() => {
    // Reset counters
    countsRef.noFace           = 0;
    countsRef.multipleFace     = 0;
    countsRef.cellPhone        = 0;
    countsRef.prohibitedObject = 0;

    let cancelled = false;

    const loadModel = async () => {
      try {
        // Ensure TF backend is initialized first
        await tf.ready();
        console.log('TF backend ready:', tf.getBackend());

        const net = await cocossd.load();
        if (cancelled) return;

        netRef.current = net;
        setModelStatus('ready');
        console.log('COCO-SSD loaded ✅');

        // Start detection loop — every 1.5 s
        intervalRef.current = setInterval(detect, 1500);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load AI model:', err);
        setModelStatus('error');
      }
    };

    loadModel();

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // ← run ONCE on mount, no deps

  // ── Render ────────────────────────────────────────────────
  const violationItems = [
    { label: 'No Face',   key: 'noFace',           icon: '👤' },
    { label: 'Multi-Face',key: 'multipleFace',      icon: '👥' },
    { label: 'Phone',     key: 'cellPhone',         icon: '📱' },
    { label: 'Object',    key: 'prohibitedObject',  icon: '📚' },
  ];

  return (
    <Box>
      {/* ── Webcam + canvas ─────────────────────────────── */}
      <Box sx={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden', mb: 1.5, background: '#000', minHeight: 180 }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          muted
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 320, height: 240, facingMode: 'user' }}
          style={{ width: '100%', display: 'block' }}
          onUserMediaError={(e) => {
            console.error('Webcam error:', e);
            setModelStatus('error');
          }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}
        />

        {/* Status overlay */}
        {modelStatus === 'loading' && (
          <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.75rem' }}>
              🤖 Loading AI proctoring model...
            </Typography>
            <Box sx={{ width: '70%' }}>
              <LinearProgress color="primary" />
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
              This may take 10–30 seconds
            </Typography>
          </Box>
        )}

        {modelStatus === 'error' && (
          <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#ff6b6b', fontWeight: 600 }}>
              ⚠️ Camera / model error
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textAlign: 'center', px: 2 }}>
              Allow camera access and refresh
            </Typography>
          </Box>
        )}

        {/* Live violation flash */}
        {lastAlert && modelStatus === 'ready' && (
          <Box sx={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(220,38,38,0.92)', borderRadius: '6px', py: 0.5, px: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.72rem' }}>
              {lastAlert}
            </Typography>
          </Box>
        )}

        {/* Ready indicator */}
        {modelStatus === 'ready' && !lastAlert && (
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 0.5, background: 'rgba(0,0,0,0.55)', borderRadius: '20px', px: 1, py: 0.3 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulse 1.5s ease-in-out infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
            <Typography variant="caption" sx={{ color: '#fff', fontSize: '0.6rem', fontWeight: 600 }}>LIVE</Typography>
          </Box>
        )}
      </Box>

      {/* ── Violation counters ───────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8 }}>
        {violationItems.map(({ label, key, icon }) => {
          const count = liveViolations[key] || 0;
          const bgColor    = count > 5 ? '#FDEDE8' : count > 2 ? '#FEF5E5' : '#E6FFFA';
          const textColor  = count > 5 ? '#d32f2f' : count > 2 ? '#e65100' : '#2e7d32';

          return (
            <Box
              key={key}
              sx={{
                p: 1,
                borderRadius: 1.5,
                background: bgColor,
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                transition: 'all 0.3s ease',
              }}
            >
              <Typography sx={{ fontSize: '0.9rem' }}>{icon}</Typography>
              <Box>
                <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.58rem', display: 'block', lineHeight: 1.2 }}>
                  {label}
                </Typography>
                <Typography sx={{ color: textColor, fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}>
                  {count}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function dataURLtoFile(dataUrl, fileName) {
  const arr  = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], fileName, { type: mime });
}
