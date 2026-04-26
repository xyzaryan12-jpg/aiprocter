# 🏆 HackProctor — AI-Powered Hackathon Candidate Shortlisting System

> **Developed for:** National & International Level Hackathon Evaluation  
> **Problem Statement:** Hackathon organizers struggle with assessing candidate eligibility and skills due to the lack of a standardized evaluation method. HackProctor provides a proctored exam tool for shortlisting candidates — ensuring fair, efficient, and standardized selection processes.

---

## 👥 Team

| Name | Roll No | Branch |
|---|---|---|
| **Roshan Kumar** | 12413643 | 224IS |
| **Arshlan Shakil Khan** | 12415611 | — |
| **Guntoju Karthikeya** | 12306852 | — |

---

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [System Overview](#system-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [How to Use — Organizer (Teacher)](#how-to-use--organizer-teacher)
- [How to Use — Candidate (Student)](#how-to-use--candidate-student)
- [AI Proctoring System](#ai-proctoring-system)
- [Seed Data](#seed-data)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Future Scope](#future-scope)
- [License](#license)

---

## 🎯 Problem Statement

Hackathon organizers struggle with:
- No standardized way to evaluate candidate eligibility
- Manual shortlisting is time-consuming and error-prone
- No way to ensure candidates aren't cheating during remote evaluation
- Lack of a unified platform for both MCQ and coding assessment

**HackProctor solves all of this** by providing a fully AI-proctored, role-based exam platform specifically designed for hackathon shortlisting — with built-in cheating detection, a Monaco code editor, and a centralized log dashboard for organizers.

---

## 🧠 System Overview

```
┌──────────────────────────────────────────────────────────┐
│                      HackProctor                         │
│                                                          │
│  ┌─────────────┐          ┌───────────────────────────┐  │
│  │  Organizer  │          │        Candidate          │  │
│  │  (Teacher)  │          │        (Student)          │  │
│  └──────┬──────┘          └────────────┬──────────────┘  │
│         │                             │                  │
│  Create Challenge               Browse Challenges        │
│  Add MCQ Questions              Read Instructions        │
│  Add Coding Problem        ┌────────────────────────┐    │
│  View Proctoring Logs      │  MCQ Section (Timed)   │    │
│                            ├────────────────────────┤    │
│                            │  Coding Section        │    │
│                            │  (Python/JS/Java)      │    │
│                            ├────────────────────────┤    │
│                            │  AI Webcam Proctoring  │    │
│                            │  - Face Detection      │    │
│                            │  - Phone Detection     │    │
│                            │  - Multi-Face Alert    │    │
│                            └────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **MongoDB** | NoSQL database (users, exams, questions, results, logs) |
| **Mongoose** | MongoDB ODM |
| **JWT (jsonwebtoken)** | Secure stateless authentication |
| **bcryptjs** | Password hashing |
| **cookie-parser** | JWT cookie handling |
| **express-async-handler** | Async error propagation |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin Resource Sharing |
| **uuid** | Unique exam ID generation |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Redux Toolkit** | Global state management |
| **React Router v6** | Client-side routing |
| **Material UI (MUI v5)** | Component library & theming |
| **TensorFlow.js** | In-browser AI model inference |
| **@tensorflow-models/coco-ssd** | Object detection (phones, prohibited items) |
| **@tensorflow-models/face-detection** | Face detection & count |
| **@monaco-editor/react** | Professional code editor |
| **Formik + Yup** | Form handling & validation |
| **React Webcam** | Webcam capture |
| **Axios** | HTTP client |
| **React Toastify** | Toast notifications |

---

## ✨ Features

### For Organizers (Teachers)
- ✅ Create hackathon challenges with custom name, duration, total questions, live/deadline dates
- ✅ Add MCQ questions with multiple options and correct answer marking
- ✅ Add one coding problem per challenge (with full description and constraints)
- ✅ View real-time proctoring logs per candidate — face violations, phone detections, object alerts
- ✅ Delete challenges

### For Candidates (Students)
- ✅ Browse all active hackathon challenges
- ✅ View challenge details, instructions, and proctoring rules before starting
- ✅ Take timed MCQ section with auto-advance and score tracking
- ✅ Solve coding problem in Monaco editor (Python / JavaScript / Java)
- ✅ Code execution via backend sandbox (runs actual code)
- ✅ View detailed results with breakdown after submission

### AI Proctoring
- ✅ Live webcam monitoring throughout the exam
- ✅ Face not visible detection
- ✅ Multiple faces (sharing screen) detection
- ✅ Mobile phone / cell phone detection
- ✅ Prohibited object detection (books, notes, etc.)
- ✅ All violations logged with counts, timestamps, and candidate info

---

## 📦 Prerequisites

Ensure the following are installed on your machine:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v18+ | https://nodejs.org |
| **npm** | v9+ | Included with Node.js |
| **MongoDB** | Local v6+ or Atlas Cloud | https://mongodb.com |
| **Git** | Any | https://git-scm.com |
| **Python** | 3.x (for code execution) | https://python.org |
| **Java JDK** | 11+ (optional, for Java code execution) | https://adoptium.net |

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/AI-Proctored-System.git
cd AI-Proctored-System
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
npm install --prefix frontend --legacy-peer-deps
```

### 4. Set up environment variables

Copy the example env file and fill in your values:

```bash
copy .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables) below).

### 5. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use a MongoDB Atlas connection string** — paste it as `MONGO_URL` in your `.env`.

### 6. Run the project

```bash
npm run dev
```

This starts both:
- **Backend server** → `http://localhost:5000`
- **Frontend React app** → `http://localhost:3000` (opens automatically)

---

## 🔧 Environment Variables

Create a `.env` file in the **root** of the project:

```env
# Server port
PORT=5000

# Environment mode
NODE_ENV=development

# MongoDB connection string
# Local: mongodb://localhost:27017/hackproctor
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/hackproctor
MONGO_URL=mongodb://localhost:27017/hackproctor

# JWT Secret — make this long and random for production
JWT_SECRET=your_super_secret_jwt_key_here_change_this
```

> ⚠️ **Never commit your `.env` file to Git.** It's already in `.gitignore`.

---

## 👨‍💼 How to Use — Organizer (Teacher)

### Step 1: Register as Organizer
1. Go to `http://localhost:3000/auth/register`
2. Fill in your name, email, and password
3. Select **Teacher** as your role
4. Click **Register**

### Step 2: Log In
1. Go to `http://localhost:3000/auth/login`
2. Enter your credentials and click **Sign In**
3. You'll be redirected to the dashboard

### Step 3: Create a Hackathon Challenge
1. Click **Create Challenge** in the left sidebar
2. Fill in all fields:
   - **Challenge Name** — e.g., "Round 1 — DSA Screening"
   - **Total Questions** — number of MCQ questions you plan to add
   - **Duration** — exam duration in minutes
   - **Live Date** — when candidates can start attempting
   - **Deadline** — when the challenge closes
   - **Coding Question Title** — e.g., "Reverse a Linked List"
   - **Coding Description** — full problem statement with examples and constraints
3. Click **Create Exam** — this creates the exam AND the associated coding question

### Step 4: Add MCQ Questions
1. Click **Add MCQ Questions** in the sidebar
2. Select the exam from the dropdown
3. Enter a question, add 4 options, mark the correct one
4. Submit — repeat for all questions needed

### Step 5: Monitor Proctoring Logs
1. Click **Proctoring Logs** in the sidebar
2. See all candidates who have attempted the challenge
3. View violation counts: no-face, multiple-faces, phone detected, prohibited objects
4. Use this data to disqualify flagged candidates during shortlisting

---

## 🧑‍💻 How to Use — Candidate (Student)

### Step 1: Register as Candidate
1. Go to `http://localhost:3000/auth/register`
2. Fill in name, email, password
3. Select **Student** as your role
4. Click **Register**

### Step 2: Browse Challenges
1. You'll land on the **Challenges** dashboard
2. Each card shows: Challenge name, status (LIVE / UPCOMING / CLOSED), number of questions, duration, and deadline
3. Only **LIVE** challenges can be attempted

### Step 3: Read the Challenge Details
1. Click on a challenge card
2. Read the full description and proctoring instructions carefully
3. Ensure:
   - Your webcam is connected and working
   - You are in a quiet, well-lit environment
   - No other people are visible on your webcam
   - No mobile phones or prohibited materials are in view

### Step 4: Start the MCQ Section
1. Check the **consent checkbox** after reading instructions
2. Click **🚀 Start Challenge**
3. Answer each MCQ question — select one option and click **Next Question**
4. The last question will show **Proceed to Coding**
5. Do NOT switch browser tabs — this is flagged by the AI

### Step 5: Solve the Coding Problem
1. You'll see the coding problem description on the left
2. The Monaco editor is on the right — select your language (Python/JavaScript/Java)
3. Write your solution
4. Click **Run Code** to test it — output appears below
5. Click **Submit** when done

### Step 6: View Your Results
1. After submission, click **My Results** in the sidebar
2. See your MCQ score, coding submission status, and overall performance
3. Shortlisting decisions are made by organizers based on your score and proctoring log

---

## 🤖 AI Proctoring System

HackProctor uses **TensorFlow.js** models loaded directly in the browser for real-time, privacy-respecting proctoring.

### Models Used
| Model | Purpose |
|---|---|
| `@tensorflow-models/face-detection` | Detects human faces in webcam feed |
| `@tensorflow-models/coco-ssd` | Detects objects (phones, books, people) |

### What Gets Flagged

| Event | Description | Logged As |
|---|---|---|
| **No Face Detected** | Candidate moved away from camera | `noFaceCount` |
| **Multiple Faces** | Another person visible (sharing answers) | `multipleFaceCount` |
| **Cell Phone Detected** | Mobile phone visible in frame | `cellPhoneCount` |
| **Prohibited Object** | Book, notes, or other object detected | `prohibitedObjectCount` |

### How Logs Are Stored
- Logs are saved to MongoDB at test submission via `POST /api/users/cheating-logs`
- Each log stores: candidate name, email, examId, all four violation counts, and timestamp
- Organizers can view all logs from the **Proctoring Logs** page

---

## 🌱 Seed Data

To quickly populate the database with sample coding questions (useful for testing):

```bash
node backend/seedCodingQuestions.js
```

**What it does:**
- Finds all exams in the database and assigns one coding question per exam from a bank of 10 pre-written questions
- If no exams exist yet, inserts all 10 questions under a demo exam ID
- Skips exams that already have a coding question (no duplicates)

**The 10 pre-loaded questions cover:**
1. Reverse a String
2. Palindrome Check
3. FizzBuzz
4. Find Maximum in Array
5. Two Sum (Hash Map approach)
6. Fibonacci Sequence (Iterative)
7. Count Vowels
8. Remove Duplicates from Sorted Array
9. Binary Search
10. Anagram Check

---

## 📁 Project Structure

```
AI-Proctored-System/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js      # Register, login, logout, profile
│   │   ├── examController.js      # Create/get/delete exams
│   │   ├── quesController.js      # MCQ question CRUD
│   │   ├── codingController.js    # Coding question CRUD & submission
│   │   ├── resultController.js    # Score calculation & results
│   │   └── cheatingLogController.js # Save & retrieve proctoring logs
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification (protect route)
│   │   └── errorMiddleware.js     # Global error handler
│   ├── models/
│   │   ├── userModel.js           # User schema (name, email, pass, role)
│   │   ├── examModel.js           # Exam schema (name, dates, duration, examId)
│   │   ├── quesModel.js           # MCQ question schema (question, options, examId)
│   │   ├── codingQuestionModel.js # Coding question schema
│   │   ├── resultModel.js         # Result schema (scores, examId, userId)
│   │   └── cheatingLogModel.js    # Proctoring log schema
│   ├── routes/
│   │   ├── userRoutes.js          # /api/users/*
│   │   ├── examRoutes.js          # /api/users/exam/*
│   │   ├── codingRoutes.js        # /api/coding/*
│   │   └── resultRoutes.js        # /api/users/results/*
│   ├── seedCodingQuestions.js     # Seed script for coding questions
│   └── server.js                  # Express app entry point
│
├── frontend/
│   └── src/
│       ├── views/
│       │   ├── authentication/    # Login, Register, UserAccount pages
│       │   ├── student/           # ExamPage, ExamDetails, TestPage, ResultPage, Coder
│       │   └── teacher/           # CreateExamPage, AddQuestions, ExamLogPage
│       ├── layouts/
│       │   └── full/
│       │       ├── header/        # Header + Profile dropdown
│       │       └── sidebar/       # Sidebar + MenuItems navigation
│       ├── slices/
│       │   ├── authSlice.js       # Redux: user auth state
│       │   ├── examApiSlice.js    # RTK Query: exam & question APIs
│       │   ├── usersApiSlice.js   # RTK Query: user APIs
│       │   └── cheatingLogApiSlice.js # RTK Query: proctoring log APIs
│       ├── context/
│       │   └── CheatingLogContext.jsx # Real-time cheating log accumulator
│       ├── store.js               # Redux store
│       └── App.js                 # Root app + providers
│
├── .env                           # Your local environment variables (not committed)
├── .env.example                   # Template for environment variables
├── package.json                   # Root package (runs both frontend + backend)
└── README.md                      # This file
```

---

## 🔌 API Reference

All API routes are prefixed with their base path. Protected routes require a valid JWT cookie.

### Auth Routes — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users` | Public | Register new user |
| POST | `/api/users/auth` | Public | Login & get JWT cookie |
| POST | `/api/users/logout` | Private | Logout & clear cookie |
| GET | `/api/users/profile` | Private | Get logged-in user profile |
| PUT | `/api/users/profile` | Private | Update profile |

### Exam Routes — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users/exam` | Private (Teacher) | Create a new exam |
| GET | `/api/users/exam` | Private | Get all exams |
| DELETE | `/api/users/exam/:examId` | Private (Teacher) | Delete an exam |
| POST | `/api/users/exam/questions` | Private (Teacher) | Add MCQ question |
| GET | `/api/users/exam/questions/:examId` | Private | Get questions for exam |

### Coding Routes — `/api/coding`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/coding/question` | Private (Teacher) | Create coding question |
| GET | `/api/coding/questions` | Private | Get all coding questions |
| GET | `/api/coding/questions/:id` | Private | Get single coding question |
| GET | `/api/coding/questions/exam/:examId` | Private | Get coding question for exam |
| POST | `/api/coding/submit` | Private (Student) | Submit coding answer |

### Code Execution Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/run-python` | Execute Python code |
| POST | `/run-javascript` | Execute JavaScript code |
| POST | `/run-java` | Compile and execute Java code |

### Result Routes — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/users/results` | Private | Save MCQ result |
| GET | `/api/users/results` | Private | Get results for logged-in user |

---

## 🖼️ Screenshots

### Login Page
Dark split-panel design with HackProctor branding, feature highlights, and a glassmorphism login card.

### Register Page
Step-by-step onboarding panel on the left with the registration form on the right. Role selection between Candidate and Organizer.

### Challenge Dashboard
Premium dark card grid showing all hackathon challenges with LIVE/UPCOMING/CLOSED status badges, countdown deadlines, and tag chips.

### Challenge Details
Hackathon-specific instructions, proctoring notice, and glowing "Start Challenge" CTA with dark themed layout.

### Test Page (MCQ)
Split view: Question card on the left, webcam proctoring + timer on the right.

### Coding Editor
Monaco editor with language selection, code execution, and problem statement side-by-side.

### Proctoring Logs
Organizer dashboard showing all flagged events per candidate.

---

## 🔮 Future Scope

| Feature | Description |
|---|---|
| **Candidate ID Verification** | Match webcam photo to registered candidate ID card |
| **Voice Monitoring** | Detect voice anomalies indicating collaboration |
| **Plagiarism Detection** | Compare code submissions for similarities |
| **Automated Shortlist Export** | CSV/PDF export of shortlisted candidates |
| **Leaderboard** | Real-time ranking during challenge |
| **Email Notifications** | Notify shortlisted candidates automatically |
| **Multi-round Support** | Round 1 → Round 2 filtering pipeline |
| **Mobile App** | Native proctoring app with biometric lock |

---

## 🤝 Contributors

| Name | Contribution |
|---|---|
| **Roshan Kumar** (12413643) | Backend API, MongoDB integration, JWT auth |
| **Arshlan Shakil Khan** (12415611) | Frontend UI, Redux state management |
| **Guntoju Karthikeya** (12306852) | AI proctoring integration, TensorFlow.js models |

---

## 📄 License

This project is developed as an academic project for the purpose of a national/international hackathon evaluation system. All rights reserved by the team.

---

> *"Ensuring every hackathon selects the best talent — fairly, securely, and efficiently."*  
> **— HackProctor Team**
