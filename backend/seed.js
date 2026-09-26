const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://dharaneeshd7:Ys11Z3jOfJsZY8Ib@cluster0.pvff5yv.mongodb.net/aptitude_db?appName=Cluster0";

const questionSchema = new mongoose.Schema({
    topic: String,
    questionText: String,
    options: [{ letter: String, text: String }],
    correctAnswer: String,
    explanation: String
});
const Question = mongoose.model('Question', questionSchema);

const seedQuestions = [
    // ==========================================
    // TIME AND WORK (15 Questions)
    // ==========================================
    // EASY
    {
        topic: "Time and Work",
        questionText: "A can finish a piece of work in 10 days and B can finish it in 15 days. Working together, how many days will they take to complete the work?",
        options: [{ letter: 'A', text: '5 days' }, { letter: 'B', text: '6 days' }, { letter: 'C', text: '8 days' }, { letter: 'D', text: '12 days' }],
        correctAnswer: "B",
        explanation: "A's 1 day work = 1/10\nB's 1 day work = 1/15\n(A + B)'s 1 day work = 1/10 + 1/15 = (3 + 2)/30 = 5/30 = 1/6.\nTherefore, working together they take 6 days."
    },
    {
        topic: "Time and Work",
        questionText: "A and B together can complete a piece of work in 12 days, while B alone can complete it in 30 days. In how many days can A alone complete the work?",
        options: [{ letter: 'A', text: '15 days' }, { letter: 'B', text: '18 days' }, { letter: 'C', text: '20 days' }, { letter: 'D', text: '24 days' }],
        correctAnswer: "C",
        explanation: "(A + B)'s 1 day work = 1/12\nB's 1 day work = 1/30\nA's 1 day work = 1/12 - 1/30 = (5 - 2)/60 = 3/60 = 1/20.\nHence, A alone can complete the work in 20 days."
    },
    {
        topic: "Time and Work",
        questionText: "P can do 1/4 of a work in 10 days, and Q can do 1/3 of the work in 15 days. Who will finish the work first and in how many days?",
        options: [{ letter: 'A', text: 'P in 40 days' }, { letter: 'B', text: 'Q in 45 days' }, { letter: 'C', text: 'Both take equal time' }, { letter: 'D', text: 'P in 30 days' }],
        correctAnswer: "A",
        explanation: "P finishes whole work in 10 * 4 = 40 days.\nQ finishes whole work in 15 * 3 = 45 days.\nP finishes first in 40 days."
    },
    {
        topic: "Time and Work",
        questionText: "If 12 men or 18 women can reap a field in 14 days, in how many days can 8 men and 16 women reap the same field?",
        options: [{ letter: 'A', text: '9 days' }, { letter: 'B', text: '10 days' }, { letter: 'C', text: '12 days' }, { letter: 'D', text: '15 days' }],
        correctAnswer: "A",
        explanation: "12 men = 18 women ➔ 1 man = 3/2 women.\n8 men + 16 women = (8 * 3/2) + 16 = 12 + 16 = 28 women.\n18 women can do it in 14 days.\n18 * 14 = 28 * x ➔ x = (18 * 14) / 28 = 9 days."
    },
    {
        topic: "Time and Work",
        questionText: "A is 3 times as fast as B and is able to finish a work in 40 days less than B. Find the time in days they take to do it working together.",
        options: [{ letter: 'A', text: '12 days' }, { letter: 'B', text: '15 days' }, { letter: 'C', text: '18 days' }, { letter: 'D', text: '20 days' }],
        correctAnswer: "B",
        explanation: "Ratio of speeds A:B = 3:1 ➔ Ratio of time taken = 1:3.\nLet time taken by A be x, and B be 3x.\n3x - x = 40 ➔ 2x = 40 ➔ x = 20 days (A), B takes 60 days.\nTogether 1/20 + 1/60 = 4/60 = 1/15 ➔ 15 days."
    },
    // MEDIUM
    {
        topic: "Time and Work",
        questionText: "A, B and C can complete a piece of work in 12, 15 and 20 days respectively. They start working together, but A leaves 2 days before the work is completed. In how many days was the work finished?",
        options: [{ letter: 'A', text: '5 days' }, { letter: 'B', text: '5 5/12 days' }, { letter: 'C', text: '6 days' }, { letter: 'D', text: '6 1/4 days' }],
        correctAnswer: "B",
        explanation: "Let total days be x. A worked for (x - 2) days, B and C worked for x days.\n(x - 2)/12 + x/15 + x/20 = 1\nLCM of 12, 15, 20 is 60.\n5(x - 2) + 4x + 3x = 60 ➔ 5x - 10 + 7x = 60 ➔ 12x = 70 ➔ x = 70/12 = 35/6 = 5 5/12 days."
    },
    {
        topic: "Time and Work",
        questionText: "Two workers X and Y working together can complete a job in 5 days. If X worked at twice his speed and Y worked at half his speed, the job would take 4 days. How many days would X take to do the job alone?",
        options: [{ letter: 'A', text: '7.5 days' }, { letter: 'B', text: '10 days' }, { letter: 'C', text: '12.5 days' }, { letter: 'D', text: '15 days' }],
        correctAnswer: "B",
        explanation: "1/x + 1/y = 1/5\n2/x + 0.5/y = 1/4\nSolving these equations: x = 10 days, y = 10 days.\nX takes 10 days alone."
    },
    {
        topic: "Time and Work",
        questionText: "A can do a piece of work in 25 days and B can do it in 20 days. They work together for 5 days and then A leaves. How many days will B take to finish the remaining work?",
        options: [{ letter: 'A', text: '9 days' }, { letter: 'B', text: '10 days' }, { letter: 'C', text: '11 days' }, { letter: 'D', text: '12 days' }],
        correctAnswer: "B",
        explanation: "(A + B)'s 1 day work = 1/25 + 1/20 = 9/100.\nWork done in 5 days = 5 * (9/100) = 45/100 = 9/20.\nRemaining work = 1 - 9/20 = 11/20.\nTime taken by B = (11/20) / (1/20) = 11 days? Wait, (11/20) * 20 = 11 days. Let's check: 1 - 9/20 = 11/20. B takes 20 days total, so 11 days. Option C is 11 days."
        // Let's ensure correctAnswer matches C
    },
    {
        topic: "Time and Work",
        questionText: "5 men can do a piece of work in 6 days while 10 women can do it in 5 days. In how many days can 5 women and 3 men do it together?",
        options: [{ letter: 'A', text: '4 days' }, { letter: 'B', text: '5 days' }, { letter: 'C', text: '6 days' }, { letter: 'D', text: '8 days' }],
        correctAnswer: "B",
        explanation: "1 man's 1 day work = 1 / (5 * 6) = 1/30.\n1 woman's 1 day work = 1 / (10 * 5) = 1/50.\n(3 men + 5 women)'s 1 day work = 3*(1/30) + 5*(1/50) = 3/30 + 5/50 = 1/10 + 1/10 = 2/10 = 1/5.\nThey take 5 days."
    },
    {
        topic: "Time and Work",
        questionText: "A contractor employs 30 men to build a bridge in 40 days. After 24 days, he finds that only half the work is done. How many additional men should he employ to finish the work on time?",
        options: [{ letter: 'A', text: '15' }, { letter: 'B', text: '20' }, { letter: 'C', text: '30' }, { letter: 'D', text: '40' }],
        correctAnswer: "C",
        explanation: "Work done in 24 days by 30 men = 1/2. Remaining work = 1/2. Remaining days = 40 - 24 = 16 days.\nLet total men needed be M.\n(30 * 24) / (1/2) = (M * 16) / (1/2)\n720 = 16M ➔ M = 45 men.\nAdditional men needed = 45 - 30 = 15? Wait. 720 / 16 = 45. 45 - 30 = 15 men. Option A is 15."
        // Let's set correct answer to A and update explanation clearly.
    },
    // HARD
    {
        topic: "Time and Work",
        questionText: "2 men and 3 boys can do a piece of work in 10 days, while 3 men and 2 boys can do it in 8 days. In how many days can 2 men and 1 boy complete the same work?",
        options: [{ letter: 'A', text: '10 days' }, { letter: 'B', text: '11.5 days' }, { letter: 'C', text: '12.5 days' }, { letter: 'D', text: '15 days' }],
        correctAnswer: "C",
        explanation: "10(2m + 3b) = 1 ➔ 20m + 30b = 1\n8(3m + 2b) = 1 ➔ 24m + 16b = 1\nSolving for m and b: m = 7/200, b = 1/100.\n(2m + b)'s 1 day work = 2*(7/200) + 1/100 = 14/200 + 2/200 = 16/200 = 2/25.\nTime taken = 25/2 = 12.5 days."
    },
    {
        topic: "Time and Work",
        questionText: "A, B and C can complete a work in 10, 12 and 15 days respectively. A left the work 3 days before it was completed, and B left 2 days after A had left. Find the total number of days taken to complete the work.",
        options: [{ letter: 'A', text: '5 days' }, { letter: 'B', text: '6 days' }, { letter: 'C', text: '7 days' }, { letter: 'D', text: '8 days' }],
        correctAnswer: "B",
        explanation: "Let total days be x. A worked for (x - 3) days. B left 2 days after A, meaning B worked for (x - 3 + 2) = (x - 1) days. C worked for x days.\n(x - 3)/10 + (x - 1)/12 + x/15 = 1\nLCM of 10, 12, 15 is 60.\n6(x - 3) + 5(x - 1) + 4x = 60\n6x - 18 + 5x - 5 + 4x = 60 ➔ 15x - 23 = 60 ➔ 15x = 83? Let's check numbers. If total days = 6:\nA works 3 days (3/10), B works 5 days (5/12), C works 6 days (6/15 = 2/5 = 8/12).\n3/10 + 5/12 + 8/12 = 3/10 + 13/12 = 18/60 + 65/60 = 83/60... Ah, let's fix numbers so it's a clean integer."
        // Let's provide a cleaner version for question 12:
    },
    {
        topic: "Time and Work",
        questionText: "Three pipes or workers A, B, C... Let's use: A and B can do a work in 12 days, B and C in 15 days, and C and A in 20 days. In how many days can A alone finish it?",
        options: [{ letter: 'A', text: '20 days' }, { letter: 'B', text: '30 days' }, { letter: 'C', text: '40 days' }, { letter: 'D', text: '60 days' }],
        correctAnswer: "B",
        explanation: "2(A + B + C)'s 1 day work = 1/12 + 1/15 + 1/20 = (5 + 4 + 3)/60 = 12/60 = 1/5.\n(A + B + C)'s 1 day work = 1/10.\nA's 1 day work = (A + B + C) - (B + C) = 1/10 - 1/15 = (3 - 2)/30 = 1/30.\nA alone takes 30 days."
    },
    {
        topic: "Time and Work",
        questionText: "A can do a piece of work in 4 days, B in 5 days and C in 10 days. They all start working together, but A leaves after 1 day and B leaves 1 day before the work is completed. In how many days is the work finished?",
        options: [{ letter: 'A', text: '2 days' }, { letter: 'B', text: '2.5 days' }, { letter: 'C', text: '3 days' }, { letter: 'D', text: '3.5 days' }],
        correctAnswer: "C",
        explanation: "A works for 1 day, C works for all x days, B works for (x - 1) days.\n1/4 + (x - 1)/5 + x/10 = 1\nLCM = 20: 5 + 4(x - 1) + 2x = 20\n5 + 4x - 4 + 2x = 20 ➔ 6x + 1 = 20 ➔ 6x = 19? Let's check: x = 19/6... Let's make it clean."
        // Let's replace explanation with a verified clean question.
    },
    {
        topic: "Time and Work",
        questionText: "A and B together can do a piece of work in 8 days. B and C together can do it in 12 days. If A, B and C together can finish it in 6 days, in how many days can A and C together finish it?",
        options: [{ letter: 'A', text: '6 days' }, { letter: 'B', text: '8 days' }, { letter: 'C', text: '10 days' }, { letter: 'D', text: '12 days' }],
        correctAnswer: "B",
        explanation: "(A + B + C)'s 1 day work = 1/6\n(A + B)'s 1 day work = 1/8\nC's 1 day work = 1/6 - 1/8 = (4 - 3)/24 = 1/24.\n(B + C)'s 1 day work = 1/12\nA's 1 day work = 1/6 - 1/12 = 1/12.\n(A + C)'s 1 day work = 1/12 + 1/24 = 3/24 = 1/8.\nA and C together finish it in 8 days."
    }
];

// Let's refine questions 8, 10, 12, 14 to ensure correct answer matching and clean numbers.
// Question 8 correction:
seedQuestions[7] = {
    topic: "Time and Work",
    questionText: "A can do a piece of work in 25 days and B can do it in 20 days. They work together for 5 days and then A leaves. How many days will B take to finish the remaining work?",
    options: [{ letter: 'A', text: '9 days' }, { letter: 'B', text: '10 days' }, { letter: 'C', text: '11 days' }, { letter: 'D', text: '12 days' }],
    correctAnswer: "C",
    explanation: "(A + B)'s 1 day work = 1/25 + 1/20 = 9/100.\nWork done in 5 days = 5 * (9/100) = 45/100 = 9/20.\nRemaining work = 1 - 9/20 = 11/20.\nTime taken by B = (11/20) / (1/20) = 11 days."
};

// Question 10 correction:
seedQuestions[9] = {
    topic: "Time and Work",
    questionText: "A contractor employs 30 men to build a bridge in 40 days. After 24 days, he finds that only half the work is done. How many additional men should he employ to finish the work on time?",
    options: [{ letter: 'A', text: '15' }, { letter: 'B', text: '20' }, { letter: 'C', text: '30' }, { letter: 'D', text: '40' }],
    correctAnswer: "C",
    explanation: "Work done in 24 days by 30 men = 1/2. Remaining work = 1/2. Remaining days = 40 - 24 = 16 days.\n(30 * 24) / (1/2) = (M * 16) / (1/2) ➔ 720 = 16M ➔ M = 45 men.\nAdditional men needed = 45 - 30 = 15? Wait, 720/16 = 45. 45 - 30 = 15. Let's make option A 15 and correctAnswer A."
};
seedQuestions[9].correctAnswer = "A";

// Question 12 correction:
seedQuestions[11] = {
    topic: "Time and Work",
    questionText: "A can finish a work in 12 days and B in 15 days. They work alternately for 1 day each, starting with A. In how many days will the work be completed?",
    options: [{ letter: 'A', text: '13 1/4 days' }, { letter: 'B', text: '13 3/5 days' }, { letter: 'C', text: '14 days' }, { letter: 'D', text: '14 1/2 days' }],
    correctAnswer: "B",
    explanation: "(A + B)'s 2 days work = 1/12 + 1/15 = 9/60 = 3/20.\nIn 6 pairs of days (12 days), work done = 6 * (3/20) = 18/20 = 9/10.\nRemaining work = 1 - 9/10 = 1/10.\nOn the 13th day, A does 1/12 work. Remaining = 1/10 - 1/12 = 1/60.\nOn the 14th day, B does it in (1/60) / (1/15) = 15/60 = 1/4 day.\nTotal days = 13 + 1/4 = 13 1/4 days? Wait, let's check: work done in 12 days = 9/10. Day 13: A does 1/12. Total = 9/10 + 1/12 = 54/60 + 5/60 = 59/60. Remaining = 1/60. Day 14: B does (1/60)/(1/15) = 1/4 day. Total days = 13 1/4 days. Option A is 13 1/4 days."
};
seedQuestions[11].correctAnswer = "A";

// Question 14 correction:
seedQuestions[13] = {
    topic: "Time and Work",
    questionText: "A, B and C can do a piece of work in 20, 30 and 60 days respectively. In how many days can A do the work if he is assisted by B and C on every third day?",
    options: [{ letter: 'A', text: '12 days' }, { letter: 'B', text: '15 days' }, { letter: 'C', text: '16 days' }, { letter: 'D', text: '18 days' }],
    correctAnswer: "B",
    explanation: "A's 2 days work (alone) = 2/20 = 1/10.\n(A + B + C)'s 1 day work = 1/20 + 1/30 + 1/60 = 6/60 = 1/10.\nWork done in a 3-day cycle = 1/10 + 1/10 = 1/5.\nTo complete 1 whole work, it takes 5 cycles * 3 days = 15 days."
};

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Database connection established!");
        
        // --- Clear old questions for Time and Work to prevent duplicates ---
        await Question.deleteMany({ topic: "Time and Work" });
        console.log("Cleared old Time and Work questions...");

        console.log("Uploading 15 refreshed Time and Work questions...");
        await Question.insertMany(seedQuestions);
        
        console.log("✅ Success! 15 refreshed Time and Work questions added to MongoDB.");
        process.exit(); 
    })
    .catch(err => {
        console.log("Error inserting questions:", err);
        process.exit(1);
    });