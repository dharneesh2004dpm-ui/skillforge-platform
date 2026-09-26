const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// --- EMAIL CONFIGURATION FOR OTP ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'apitude1@gmail.com', 
        pass: 'mcxqworoadvexnel' 
    }
});

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://dharaneeshd7:Ys11Z3jOfJsZY8Ib@cluster0.pvff5yv.mongodb.net/aptitude_db?appName=Cluster0";
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// --- SCHEMAS ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    resetOTP: { type: String },
    otpExpiry: { type: Date }
});
const User = mongoose.model('User', userSchema);

const questionSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    questionText: { type: String, required: true }, 
    options: [{ 
        letter: { type: String, required: true },
        text: { type: String, required: true }
    }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String }
});
const Question = mongoose.model('Question', questionSchema);

// ==========================================
// 1. TEST SCHEMA (Admin creates this)
// ==========================================
const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    durationMinutes: { type: Number, required: true }, // e.g., 20 mins (Admin can edit this live)
    maxAttempts: { type: Number, default: 1 },         // Default 1, admin can change
    scheduledStart: { type: Date, required: true },    // When the link becomes active
    scheduledEnd: { type: Date, required: true },      // When the link expires
    
    // We copy the questions into the test so the test remains permanent 
    // even if admin later deletes the original practice question.
    questions: [{
        originalQuestionId: String, // If pulled from practice engine
        topic: String,
        questionText: String,
        options: [{ letter: String, text: String }],
        correctAnswer: String,
        explanation: String, // Optional
        marks: { type: Number, default: 1 } // Admin can change this to 2, 3, etc.
    }],
    isActive: { type: Boolean, default: true } // Admin can toggle on/off
});
const Test = mongoose.model('Test', testSchema);

// ==========================================
// 2. TEST RESULT SCHEMA (User submits this)
// ==========================================
const testResultSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true }, // NEW FIELD ADDED
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    userAnswers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        selectedLetter: String,
        isCorrect: Boolean,
        marksAwarded: Number
    }],
    attemptNumber: { type: Number, default: 1 },
    submittedAt: { type: Date, default: Date.now }
});
const TestResult = mongoose.model('TestResult', testResultSchema);


// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, phone, email, password: hashedPassword });
        res.json({ message: "Registration successful", role: newUser.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // FIX: We are now sending the exact 'name' and 'email' from the database
        res.json({ 
            role: user.role || 'student', 
            name: user.name, 
            email: user.email,
            message: "Login successful" 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Email not registered" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; 
        await user.save();

        await transporter.sendMail({
            from: 'apitude1@gmail.com', 
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
        });

        res.json({ message: "OTP sent to email" });
    } catch (err) {
        res.status(500).json({ error: "Email failed: " + err.message });
    }
});

app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email, resetOTP: otp, otpExpiry: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ error: "Invalid or expired OTP" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOTP = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- PRACTICE ENGINE & ADMIN ROUTES ---
app.post('/api/admin/questions', async (req, res) => {
    try {
        const { topic, question, options, correctAnswer, explanation } = req.body;
        const newQuestion = await Question.create({ topic, questionText: question, options, correctAnswer, explanation });
        res.json({ message: "Question saved to live database!", question: newQuestion });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/topics', async (req, res) => {
    try {
        const dbTopics = await Question.distinct('topic');
        res.json(dbTopics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/practice/:topic', async (req, res) => {
    try {
        const topic = req.params.topic;
        const questions = await Question.find({ topic: topic });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NEW: Delete a specific question by ID
app.delete('/api/admin/questions/:id', async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: "Question deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NEW: Delete an entire topic (and all its questions)
app.delete('/api/admin/topics/:topic', async (req, res) => {
    try {
        const topic = req.params.topic;
        await Question.deleteMany({ topic: topic });
        res.json({ message: `Entire topic '${topic}' deleted successfully!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// TEST ENGINE API ROUTES
// ==========================================

// 1. Admin: Create a new test
app.post('/api/tests', async (req, res) => {
    try {
        const newTest = new Test(req.body);
        await newTest.save();
        res.status(201).json({ message: "Test created successfully!", test: newTest });
    } catch (err) {
        res.status(500).json({ error: "Failed to create test" });
    }
});

// 2. User & Admin: Get available tests
app.get('/api/tests', async (req, res) => {
    try {
        const tests = await Test.find().sort({ scheduledStart: -1 });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tests" });
    }
});

// 3. Admin: Update Test (Add time, modify attempts, etc.)
app.put('/api/tests/:id', async (req, res) => {
    try {
        const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Test updated successfully!", test: updatedTest });
    } catch (err) {
        res.status(500).json({ error: "Failed to update test" });
    }
});

// 4. User: Submit Test and Calculate Score
app.post('/api/submit-test', async (req, res) => {
    try {
        const { userName, userEmail, testId, answers } = req.body;
        
        // Fetch the original test to check answers
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ error: "Test not found" });

        let score = 0;
        let totalMarks = 0;
        let userAnswersProcessed = [];

        // Grade the test
        test.questions.forEach((q) => {
            totalMarks += q.marks;
            const userAnswer = answers.find(a => a.questionId === q._id.toString());
            
            const isCorrect = userAnswer && userAnswer.selectedLetter === q.correctAnswer;
            const marksAwarded = isCorrect ? q.marks : 0;
            score += marksAwarded;

            userAnswersProcessed.push({
                questionId: q._id,
                selectedLetter: userAnswer ? userAnswer.selectedLetter : null,
                isCorrect: isCorrect,
                marksAwarded: marksAwarded
            });
        });

        // Save the result
        const testResult = new TestResult({
            userName,
            userEmail, // <-- Make sure this is here!
            testId,
            score,
            totalMarks,
            userAnswers: userAnswersProcessed
        });

        await testResult.save();
        res.status(201).json({ message: "Test submitted successfully!", result: testResult });

    } catch (err) {
        res.status(500).json({ error: "Failed to submit test" });
    }
});

// 5. User/Admin: Get Leaderboard & Results for a specific test
app.get('/api/results/:testId', async (req, res) => {
    try {
        // Sort by score descending to automatically create the leaderboard
        const results = await TestResult.find({ testId: req.params.testId }).sort({ score: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch results" });
    }
});
// 6. User: Get all personal results for "View My Results" page
app.get('/api/my-results/:email', async (req, res) => {
    try {
        // We removed the specific selection so it populates the entire test, including the questions!
        const results = await TestResult.find({ userEmail: req.params.email })
            .populate('testId') 
            .sort({ submittedAt: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user results" });
    }
});

// 7. Global: Get tests for the Leaderboard dropdown
app.get('/api/completed-tests', async (req, res) => {
    try {
        const tests = await Test.find({ isActive: true }).select('title scheduledEnd');
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch completed tests" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));