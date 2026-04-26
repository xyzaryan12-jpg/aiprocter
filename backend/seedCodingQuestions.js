/**
 * Seed Script: Insert Coding Questions
 * Run with: node backend/seedCodingQuestions.js
 *
 * This script:
 * 1. Connects to MongoDB
 * 2. Fetches all exams from the DB
 * 3. Inserts one coding question per exam (skips if one already exists)
 * 4. If no exams exist, inserts standalone demo questions with a placeholder examId
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// ── Models ────────────────────────────────────────────────────────────────────
const examSchema = mongoose.Schema({ examName: String, examId: { type: String, default: uuidv4 } }, { strict: false });
const codingSchema = new mongoose.Schema(
  {
    examId: { type: String, required: true },
    question: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    submittedAnswer: {
      code: { type: String, trim: true },
      language: { type: String, enum: ["javascript", "python", "java", "cpp"] },
      status: { type: String, enum: ["pending", "passed", "failed", "error"], default: "pending" },
    },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
codingSchema.index({ examId: 1 });

const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
const CodingQuestion = mongoose.models.CodingQuestion || mongoose.model("CodingQuestion", codingSchema);
const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({ role: String }, { strict: false }));

// ── 10 Coding Questions Bank ──────────────────────────────────────────────────
const QUESTION_BANK = [
  {
    question: "Reverse a String",
    description: `Write a function \`reverseString(s)\` that takes a string \`s\` and returns it reversed.

**Examples:**
- Input: \`"hello"\` → Output: \`"olleh"\`
- Input: \`"abcde"\` → Output: \`"edcba"\`
- Input: \`"racecar"\` → Output: \`"racecar"\`

**Constraints:**
- 1 ≤ s.length ≤ 1000
- \`s\` consists only of printable ASCII characters`,
  },
  {
    question: "Check for Palindrome",
    description: `Write a function \`isPalindrome(s)\` that returns \`true\` if the string \`s\` is a palindrome (reads the same forwards and backwards), ignoring case and non-alphanumeric characters.

**Examples:**
- Input: \`"racecar"\` → Output: \`true\`
- Input: \`"A man a plan a canal Panama"\` → Output: \`true\`
- Input: \`"hello"\` → Output: \`false\`

**Constraints:**
- 1 ≤ s.length ≤ 10000`,
  },
  {
    question: "FizzBuzz",
    description: `Write a function \`fizzBuzz(n)\` that returns an array of strings from 1 to n where:
- Multiples of 3 → \`"Fizz"\`
- Multiples of 5 → \`"Buzz"\`
- Multiples of both 3 and 5 → \`"FizzBuzz"\`
- Otherwise → the number as a string

**Examples:**
- Input: \`5\` → Output: \`["1","2","Fizz","4","Buzz"]\`
- Input: \`15\` → Output: \`["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]\`

**Constraints:**
- 1 ≤ n ≤ 10000`,
  },
  {
    question: "Find the Maximum Element in an Array",
    description: `Write a function \`findMax(arr)\` that returns the largest number in an integer array.

**Examples:**
- Input: \`[3, 1, 4, 1, 5, 9, 2, 6]\` → Output: \`9\`
- Input: \`[-10, -3, -7]\` → Output: \`-3\`
- Input: \`[42]\` → Output: \`42\`

**Constraints:**
- 1 ≤ arr.length ≤ 10^5
- -10^9 ≤ arr[i] ≤ 10^9
- Do NOT use built-in max functions`,
  },
  {
    question: "Two Sum",
    description: `Write a function \`twoSum(nums, target)\` that returns the indices of the two numbers that add up to \`target\`.

**Examples:**
- Input: \`nums = [2, 7, 11, 15], target = 9\` → Output: \`[0, 1]\`
- Input: \`nums = [3, 2, 4], target = 6\` → Output: \`[1, 2]\`
- Input: \`nums = [3, 3], target = 6\` → Output: \`[0, 1]\`

**Constraints:**
- 2 ≤ nums.length ≤ 10^4
- Each input has exactly one solution
- You may not use the same element twice
- Expected time complexity: O(n)`,
  },
  {
    question: "Fibonacci Sequence",
    description: `Write a function \`fibonacci(n)\` that returns the nth Fibonacci number (0-indexed).

The Fibonacci sequence is: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...

**Examples:**
- Input: \`0\` → Output: \`0\`
- Input: \`6\` → Output: \`8\`
- Input: \`10\` → Output: \`55\`

**Constraints:**
- 0 ≤ n ≤ 30
- Use an iterative approach (no recursion)`,
  },
  {
    question: "Count Vowels in a String",
    description: `Write a function \`countVowels(s)\` that counts the number of vowels (a, e, i, o, u — both upper and lowercase) in the string \`s\`.

**Examples:**
- Input: \`"Hello World"\` → Output: \`3\`
- Input: \`"AEIOU"\` → Output: \`5\`
- Input: \`"rhythm"\` → Output: \`0\`

**Constraints:**
- 0 ≤ s.length ≤ 10000
- \`s\` may contain letters, spaces, digits, and punctuation`,
  },
  {
    question: "Remove Duplicates from a Sorted Array",
    description: `Write a function \`removeDuplicates(nums)\` that removes duplicates from a sorted integer array **in-place** and returns the count of unique elements.

The first \`k\` positions of the array should hold the unique values in sorted order.

**Examples:**
- Input: \`[1, 1, 2]\` → Output: \`2\`, array becomes \`[1, 2, ...]\`
- Input: \`[0,0,1,1,1,2,2,3,3,4]\` → Output: \`5\`, array becomes \`[0,1,2,3,4,...]\`

**Constraints:**
- 1 ≤ nums.length ≤ 3 × 10^4
- nums is sorted in non-decreasing order
- Do not allocate extra space for another array`,
  },
  {
    question: "Binary Search",
    description: `Write a function \`binarySearch(nums, target)\` that searches for \`target\` in a sorted array and returns its index. If not found, return \`-1\`.

**Examples:**
- Input: \`nums = [-1,0,3,5,9,12], target = 9\` → Output: \`4\`
- Input: \`nums = [-1,0,3,5,9,12], target = 2\` → Output: \`-1\`

**Constraints:**
- 1 ≤ nums.length ≤ 10^4
- All values in nums are unique and sorted in ascending order
- Expected time complexity: O(log n)
- Do NOT use built-in search functions`,
  },
  {
    question: "Anagram Check",
    description: `Write a function \`isAnagram(s, t)\` that returns \`true\` if \`t\` is an anagram of \`s\`, otherwise returns \`false\`.

An anagram uses the same characters the same number of times, just in different order.

**Examples:**
- Input: \`s = "anagram", t = "nagaram"\` → Output: \`true\`
- Input: \`s = "rat", t = "car"\` → Output: \`false\`
- Input: \`s = "listen", t = "silent"\` → Output: \`true\`

**Constraints:**
- 1 ≤ s.length, t.length ≤ 5 × 10^4
- \`s\` and \`t\` consist of lowercase English letters`,
  },
];

// ── Main Seed Logic ───────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected\n");

    // Get a teacher user to act as the question author
    const teacher = await User.findOne({ role: "teacher" });
    if (!teacher) {
      console.error("❌ No teacher account found in the database.");
      console.log("   Please register a teacher account first via the app, then re-run this script.");
      process.exit(1);
    }
    console.log(`👨‍🏫 Using teacher: ${teacher.name || teacher.email} (${teacher._id})\n`);

    // Fetch all exams
    const exams = await Exam.find({});
    console.log(`📋 Found ${exams.length} exam(s) in the database.\n`);

    let inserted = 0;
    let skipped = 0;

    if (exams.length === 0) {
      console.log("⚠️  No exams found. Creating standalone demo questions...\n");
      // Insert all 10 questions with a demo exam ID
      const demoExamId = "demo-exam-" + uuidv4();
      for (const q of QUESTION_BANK) {
        await CodingQuestion.create({ ...q, examId: demoExamId, teacher: teacher._id });
        console.log(`  ✅ Inserted: "${q.question}"`);
        inserted++;
      }
    } else {
      // One question per exam (schema constraint)
      for (let i = 0; i < exams.length; i++) {
        const exam = exams[i];
        const questionData = QUESTION_BANK[i % QUESTION_BANK.length];

        // Check if a coding question already exists for this exam
        const existing = await CodingQuestion.findOne({ examId: exam.examId });
        if (existing) {
          console.log(`  ⏭️  Skipped: exam "${exam.examName}" — already has a coding question`);
          skipped++;
          continue;
        }

        await CodingQuestion.create({
          ...questionData,
          examId: exam.examId,
          teacher: teacher._id,
        });
        console.log(`  ✅ Inserted: "${questionData.question}" → Exam: "${exam.examName}"`);
        inserted++;
      }
    }

    console.log(`\n🎉 Done! Inserted: ${inserted} | Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
