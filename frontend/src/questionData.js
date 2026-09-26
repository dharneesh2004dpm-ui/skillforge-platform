export const aptitudeQuestions = {
    "Time and Work": [
        {
            id: "tw1",
            question: "A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is:",
            options: { A: "1/4", B: "1/10", C: "7/15", D: "8/15" },
            correctAnswer: "D",
            explanation: "A's 1 day's work = 1/15\nB's 1 day's work = 1/20\n(A + B)'s 1 day's work = (1/15 + 1/20) = 7/60\n(A + B)'s 4 day's work = (7/60 x 4) = 7/15\nTherefore, remaining work = (1 - 7/15) = 8/15."
        },
        {
            id: "tw2",
            question: "A can finish a work in 18 days and B can do the same work in 15 days. B worked for 10 days and left the job. In how many days, A alone can finish the remaining work?",
            options: { A: "5", B: "5.5", C: "6", D: "8" },
            correctAnswer: "C",
            explanation: "B's 10 day's work = (1/15 x 10) = 2/3\nRemaining work = (1 - 2/3) = 1/3\nNow, 1/18 work is done by A in 1 day.\nTherefore, 1/3 work is done by A in (18 x 1/3) = 6 days."
        },
        {
            id: "tw3",
            question: "A and B together can complete a piece of work in 4 days. If A alone can complete the same work in 12 days, in how many days can B alone complete that work?",
            options: { A: "4 days", B: "5 days", C: "6 days", D: "8 days" },
            correctAnswer: "C",
            explanation: "(A + B)'s 1 day's work = 1/4\nA's 1 day's work = 1/12\nB's 1 day's work = (1/4 - 1/12) = (3 - 1)/12 = 2/12 = 1/6\nHence, B alone can complete the work in 6 days."
        },
        {
            id: "tw4",
            question: "A is twice as good a workman as B and together they finish a piece of work in 18 days. In how many days will A alone finish the work?",
            options: { A: "27 days", B: "54 days", C: "12 days", D: "36 days" },
            correctAnswer: "A",
            explanation: "(A's 1 day's work) : (B's 1 day's work) = 2 : 1\n(A + B)'s 1 day's work = 1/18\nA's 1 day's work = (1/18 x 2/3) = 1/27\nHence, A alone can finish the work in 27 days."
        },
        {
            id: "tw5",
            question: "A and B can do a piece of work in 8 days, B and C can do it in 12 days, A, B and C together can finish it in 6 days. A and C together will do it in:",
            options: { A: "8 days", B: "10 days", C: "12 days", D: "16 days" },
            correctAnswer: "A",
            explanation: "(A + B + C)'s 1 day's work = 1/6\n(A + B)'s 1 day's work = 1/8\n(B + C)'s 1 day's work = 1/12\n(A + C)'s 1 day's work = 2(A + B + C)'s 1 day's work - [(A + B)'s 1 day's work + (B + C)'s 1 day's work]\n= 2(1/6) - [1/8 + 1/12] = 1/3 - 5/24 = 3/24 = 1/8\nSo, A and C together will do the work in 8 days."
        },
        {
            id: "tw6",
            question: "A can do a certain work in the same time in which B and C together can do it. If A and B together could do it in 10 days and C alone in 50 days, then B alone could do it in:",
            options: { A: "15 days", B: "20 days", C: "25 days", D: "30 days" },
            correctAnswer: "C",
            explanation: "(A + B)'s 1 day's work = 1/10\nC's 1 day's work = 1/50\n(A + B + C)'s 1 day's work = (1/10 + 1/50) = 6/50 = 3/25\nSince A's work = (B + C)'s work, (A + A)'s 1 day's work = 3/25\n2A = 3/25 ➔ A's 1 day's work = 3/50\nB's 1 day's work = (1/10 - 3/50) = 2/50 = 1/25\nTherefore, B alone can do it in 25 days."
        },
        {
            id: "tw7",
            question: "A works twice as fast as B. If B can complete a work in 12 days independently, the number of days in which A and B can together finish the work is:",
            options: { A: "4 days", B: "6 days", C: "8 days", D: "18 days" },
            correctAnswer: "A",
            explanation: "Ratio of rates of working of A and B = 2 : 1.\nSo, ratio of times taken = 1 : 2.\nB's time = 12 days. A's time = 6 days.\n(A + B)'s 1 day's work = (1/6 + 1/12) = 3/12 = 1/4\nSo, they together can finish the work in 4 days."
        },
        {
            id: "tw8",
            question: "10 men can complete a piece of work in 15 days and 15 women can complete the same work in 12 days. If all the 10 men and 15 women work together, in how many days will the work get completed?",
            options: { A: "6", B: "6 2/3", C: "7.5", D: "8" },
            correctAnswer: "B",
            explanation: "10 men's 1 day's work = 1/15\n15 women's 1 day's work = 1/12\n(10 men + 15 women)'s 1 day's work = (1/15 + 1/12) = 9/60 = 3/20\nSo, the work will be completed in 20/3 = 6 2/3 days."
        },
        {
            id: "tw9",
            question: "X can do a piece of work in 40 days. He works at it for 8 days and then Y finished it in 16 days. How long will they together take to complete the work?",
            options: { A: "13 1/3 days", B: "15 days", C: "20 days", D: "26 days" },
            correctAnswer: "A",
            explanation: "X's 8 day's work = (1/40 x 8) = 1/5\nRemaining work = (1 - 1/5) = 4/5\nNow, 4/5 work is done by Y in 16 days.\nWhole work will be done by Y in (16 x 5/4) = 20 days.\nX's 1 day's work = 1/40, Y's 1 day's work = 1/20\n(X + Y)'s 1 day's work = (1/40 + 1/20) = 3/40\nHence, they together take 40/3 = 13 1/3 days."
        },
        {
            id: "tw10",
            question: "P, Q and R can do a work in 20, 30 and 60 days respectively. In how many days can P do the work if he is assisted by Q and R on every third day?",
            options: { A: "12 days", B: "15 days", C: "16 days", D: "18 days" },
            correctAnswer: "B",
            explanation: "P's 2 day's work = (1/20 x 2) = 1/10\n(P + Q + R)'s 1 day's work = (1/20 + 1/30 + 1/60) = 6/60 = 1/10\nWork done in 3 days = (1/10 + 1/10) = 1/5\nNow, 1/5 work is done in 3 days.\nWhole work will be done in (3 x 5) = 15 days."
        }
    ],
    "Problems on Trains": [
        // --- EASY ---
        {
            id: "pt1",
            question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
            options: { A: "120 metres", B: "180 metres", C: "324 metres", D: "150 metres" },
            correctAnswer: "D",
            explanation: "Speed = (60 x 5/18) m/sec = 50/3 m/sec.\nLength of the train = (Speed x Time).\nLength = (50/3 x 9) m = 150 m."
        },
        {
            id: "pt2",
            question: "A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:",
            options: { A: "45 km/hr", B: "50 km/hr", C: "54 km/hr", D: "55 km/hr" },
            correctAnswer: "B",
            explanation: "Speed of the train relative to man = (125 / 10) m/sec = 25/2 m/sec.\n(25/2 x 18/5) km/hr = 45 km/hr.\nLet the speed of the train be x km/hr. Then, relative speed = (x - 5) km/hr.\nx - 5 = 45 ➔ x = 50 km/hr."
        },
        {
            id: "pt3",
            question: "The length of the bridge, which a train 130 metres long and travelling at 45 km/hr can cross in 30 seconds, is:",
            options: { A: "200 m", B: "225 m", C: "245 m", D: "250 m" },
            correctAnswer: "C",
            explanation: "Speed = (45 x 5/18) m/sec = 25/2 m/sec.\nTime = 30 sec.\nLet the length of bridge be x metres.\nThen, (130 + x) / 30 = 25/2\n2(130 + x) = 750 ➔ 260 + 2x = 750 ➔ x = 245 m."
        },
        {
            id: "pt4",
            question: "A train passes a station platform in 36 seconds and a man standing on the platform in 20 seconds. If the speed of the train is 54 km/hr, what is the length of the platform?",
            options: { A: "120 m", B: "240 m", C: "300 m", D: "None of these" },
            correctAnswer: "B",
            explanation: "Speed = (54 x 5/18) m/sec = 15 m/sec.\nLength of the train = (15 x 20) m = 300 m.\nLet the length of the platform be x metres.\nThen, (x + 300) / 36 = 15\nx + 300 = 540 ➔ x = 240 m."
        },
        {
            id: "pt5",
            question: "Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. The ratio of their speeds is:",
            options: { A: "1 : 3", B: "3 : 2", C: "3 : 4", D: "None of these" },
            correctAnswer: "B",
            explanation: "Let the speeds of the two trains be x and y respectively.\nLengths of the trains = 27x and 17y.\n(27x + 17y) / (x + y) = 23\n27x + 17y = 23x + 23y ➔ 4x = 6y ➔ x/y = 3/2."
        },
        // --- MEDIUM ---
        {
            id: "pt6",
            question: "A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?",
            options: { A: "65 sec", B: "89 sec", C: "100 sec", D: "150 sec" },
            correctAnswer: "B",
            explanation: "Speed = 240 / 24 = 10 m/sec.\nRequired time = (240 + 650) / 10 = 890 / 10 = 89 sec."
        },
        {
            id: "pt7",
            question: "Two trains of equal length are running on parallel lines in the same direction at 46 km/hr and 36 km/hr. The faster train passes the slower train in 36 seconds. The length of each train is:",
            options: { A: "50 m", B: "72 m", C: "80 m", D: "82 m" },
            correctAnswer: "A",
            explanation: "Relative speed = (46 - 36) km/hr = 10 km/hr = (10 x 5/18) m/sec = 25/9 m/sec.\nLet the length of each train be x metres.\nThen, (x + x) / 36 = 25/9\n2x = (25/9 x 36) ➔ 2x = 100 ➔ x = 50."
        },
        {
            id: "pt8",
            question: "A train 360 m long is running at a speed of 45 km/hr. In what time will it pass a bridge 140 m long?",
            options: { A: "40 sec", B: "42 sec", C: "45 sec", D: "48 sec" },
            correctAnswer: "A",
            explanation: "Speed = (45 x 5/18) m/sec = 25/2 m/sec.\nTotal distance = (360 + 140) m = 500 m.\nTime = 500 / (25/2) = (500 x 2/25) = 40 sec."
        },
        {
            id: "pt9",
            question: "Two trains are moving in opposite directions @ 60 km/hr and 90 km/hr. Their lengths are 1.10 km and 0.9 km respectively. The time taken by the slower train to cross the faster train in seconds is:",
            options: { A: "36", B: "45", C: "48", D: "49" },
            correctAnswer: "C",
            explanation: "Relative speed = (60 + 90) km/hr = 150 km/hr.\n= (150 x 5/18) m/sec = 125/3 m/sec.\nTotal distance = (1.10 + 0.9) km = 2 km = 2000 m.\nTime = 2000 / (125/3) = 2000 x 3 / 125 = 48 sec."
        },
        {
            id: "pt10",
            question: "A jogger running at 9 kmph alongside a railway track in 240 metres ahead of the engine of a 120 metres long train running at 45 kmph in the same direction. In how much time will the train pass the jogger?",
            options: { A: "3.6 sec", B: "18 sec", C: "36 sec", D: "72 sec" },
            correctAnswer: "C",
            explanation: "Speed of train relative to jogger = (45 - 9) km/hr = 36 km/hr.\n= (36 x 5/18) m/sec = 10 m/sec.\nDistance to be covered = (240 + 120) m = 360 m.\nTime taken = 360 / 10 = 36 sec."
        },
        // --- HARD ---
        {
            id: "pt11",
            question: "A goods train runs at the speed of 72 kmph and crosses a 250 m long platform in 26 seconds. What is the length of the goods train?",
            options: { A: "230 m", B: "240 m", C: "260 m", D: "270 m" },
            correctAnswer: "D",
            explanation: "Speed = (72 x 5/18) m/sec = 20 m/sec.\nLet the length of train be x metres.\nThen, (x + 250) / 26 = 20\nx + 250 = 520 ➔ x = 270 m."
        },
        {
            id: "pt12",
            question: "Two trains, one from Howrah to Patna and the other from Patna to Howrah, start simultaneously. After they meet, the trains reach their destinations after 9 hours and 16 hours respectively. The ratio of their speeds is:",
            options: { A: "2 : 3", B: "4 : 3", C: "6 : 7", D: "9 : 16" },
            correctAnswer: "B",
            explanation: "Let the speeds of the trains be S1 and S2, and time taken after meeting be T1 and T2.\nAccording to the formula: S1/S2 = √(T2/T1)\nS1/S2 = √(16/9) = 4/3.\nRatio is 4:3."
        },
        {
            id: "pt13",
            question: "A train takes 18 seconds to pass completely through a station 162 m long and 15 seconds through another station 120 m long. The length of the train is:",
            options: { A: "70 m", B: "80 m", C: "90 m", D: "100 m" },
            correctAnswer: "C",
            explanation: "Let the length of the train be x metres.\nSince speed is constant: (x + 162)/18 = (x + 120)/15\n15(x + 162) = 18(x + 120)\n15x + 2430 = 18x + 2160\n3x = 270 ➔ x = 90 m."
        },
        {
            id: "pt14",
            question: "A train travels at a speed of 30 km/hr and crosses a man walking at 6 km/hr in the opposite direction in 10 seconds. The length of the train is:",
            options: { A: "100 m", B: "120 m", C: "140 m", D: "150 m" },
            correctAnswer: "A",
            explanation: "Relative speed = (30 + 6) = 36 km/hr.\n= (36 x 5/18) m/sec = 10 m/sec.\nLength of the train = (Relative Speed x Time)\n= 10 x 10 = 100 m."
        },
        {
            id: "pt15",
            question: "Two trains of length 115 m and 110 m respectively run on parallel rails. When running in the same direction the faster train clears the slower one in 25 seconds. When running in opposite directions, they pass each other in 9 seconds. The speed of the faster train is:",
            options: { A: "42 km/hr", B: "55 km/hr", C: "62 km/hr", D: "84 km/hr" },
            correctAnswer: "C",
            explanation: "Let the speeds be u and v m/sec.\nWhen moving in same direction: u - v = (115 + 110) / 25 = 9\nWhen moving in opposite directions: u + v = (115 + 110) / 9 = 25\nSolving u - v = 9 and u + v = 25:\n2u = 34 ➔ u = 17 m/sec.\nSpeed of faster train = (17 x 18/5) km/hr = 61.2 ≈ 62 km/hr."
        }
    ],

    "Percentage": [
        // --- EASY ---
        {
            id: "pc1",
            question: "A batsman scored 110 runs which included 3 boundaries and 8 sixes. What percent of his total score did he make by running between the wickets?",
            options: { A: "45%", B: "45 5/11%", C: "54 6/11%", D: "55%" },
            correctAnswer: "B",
            explanation: "Runs scored from boundaries = (3 x 4) + (8 x 6) = 12 + 48 = 60.\nRuns scored by running = (110 - 60) = 50.\nPercentage = (50 / 110) x 100% = 500 / 11% = 45 5/11%."
        },
        {
            id: "pc2",
            question: "Two students appeared at an examination. One of them secured 9 marks more than the other and his marks was 56% of the sum of their marks. The marks obtained by them are:",
            options: { A: "39, 30", B: "41, 32", C: "42, 33", D: "43, 34" },
            correctAnswer: "C",
            explanation: "Let their marks be (x + 9) and x.\nThen, x + 9 = 56/100 (x + 9 + x)\n25(x + 9) = 14(2x + 9)\n25x + 225 = 28x + 126 ➔ 3x = 99 ➔ x = 33.\nSo, their marks are 42 and 33."
        },
        {
            id: "pc3",
            question: "A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had:",
            options: { A: "588 apples", B: "600 apples", C: "672 apples", D: "700 apples" },
            correctAnswer: "D",
            explanation: "Suppose originally he had x apples.\nSince he sold 40%, he has 60% left.\n60% of x = 420\n(60/100) x = 420 ➔ x = (420 x 100/60) = 700."
        },
        {
            id: "pc4",
            question: "What percentage of numbers from 1 to 70 have 1 or 9 in the unit's digit?",
            options: { A: "1", B: "14", C: "20", D: "21" },
            correctAnswer: "C",
            explanation: "From 1 to 70, the numbers ending in 1 are: 1, 11, 21, 31, 41, 51, 61. (7 numbers)\nThe numbers ending in 9 are: 9, 19, 29, 39, 49, 59, 69. (7 numbers)\nTotal numbers = 14.\nPercentage = (14 / 70) x 100% = 20%."
        },
        {
            id: "pc5",
            question: "If A = x% of y and B = y% of x, then which of the following is true?",
            options: { A: "A is smaller than B", B: "A is greater than B", C: "Relationship can't be determined", D: "A is equal to B" },
            correctAnswer: "D",
            explanation: "A = x% of y = (x/100) * y = (xy/100).\nB = y% of x = (y/100) * x = (xy/100).\nTherefore, A is equal to B."
        },
        // --- MEDIUM ---
        {
            id: "pc6",
            question: "If 20% of a = b, then b% of 20 is the same as:",
            options: { A: "4% of a", B: "5% of a", C: "20% of a", D: "None of these" },
            correctAnswer: "A",
            explanation: "20% of a = b ➔ (20/100)a = b.\nb% of 20 = (b/100) * 20 = [(20/100)a / 100] * 20 = 400a / 10000 = 4a / 100 = 4% of a."
        },
        {
            id: "pc7",
            question: "In a certain school, 20% of students are below 8 years of age. The number of students above 8 years of age is 2/3 of the number of students of 8 years of age which is 48. What is the total number of students in the school?",
            options: { A: "72", B: "80", C: "100", D: "120" },
            correctAnswer: "C",
            explanation: "Number of students of 8 years = 48.\nNumber of students above 8 years = 2/3 of 48 = 32.\nTotal students 8 years and above = 48 + 32 = 80.\nSince 20% are below 8 years, 80% are 8 years and above.\nLet total students be x. Then 80% of x = 80 ➔ x = 100."
        },
        {
            id: "pc8",
            question: "Two numbers A and B are such that the sum of 5% of A and 4% of B is two-third of the sum of 6% of A and 8% of B. Find the ratio of A : B.",
            options: { A: "2 : 3", B: "1 : 1", C: "3 : 4", D: "4 : 3" },
            correctAnswer: "D",
            explanation: "5% of A + 4% of B = 2/3(6% of A + 8% of B)\n5A/100 + 4B/100 = 2/3(6A/100 + 8B/100)\n3(5A + 4B) = 2(6A + 8B)\n15A + 12B = 12A + 16B ➔ 3A = 4B ➔ A/B = 4/3."
        },
        {
            id: "pc9",
            question: "A student multiplied a number by 3/5 instead of 5/3. What is the percentage error in the calculation?",
            options: { A: "34%", B: "44%", C: "54%", D: "64%" },
            correctAnswer: "D",
            explanation: "Let the number be x.\nTrue value = (5/3)x.\nCalculated value = (3/5)x.\nError = (5/3)x - (3/5)x = 16x/15.\nPercentage Error = (16x/15) / (5x/3) * 100 = (16/15 * 3/5 * 100)% = 64%."
        },
        {
            id: "pc10",
            question: "In an election between two candidates, one got 55% of the total valid votes, 20% of the votes were invalid. If the total number of votes was 7500, the number of valid votes that the other candidate got, was:",
            options: { A: "2700", B: "2900", C: "3000", D: "3100" },
            correctAnswer: "A",
            explanation: "Total votes = 7500. Invalid votes = 20% of 7500 = 1500.\nValid votes = 7500 - 1500 = 6000.\n1st candidate got 55% of valid votes.\n2nd candidate got (100 - 55) = 45% of valid votes.\nValid votes of 2nd candidate = 45% of 6000 = (45/100) * 6000 = 2700."
        },
        // --- HARD ---
        {
            id: "pc11",
            question: "The population of a town increased from 1,75,000 to 2,62,500 in a decade. The average percent increase of population per year is:",
            options: { A: "4.37%", B: "5%", C: "6%", D: "8.75%" },
            correctAnswer: "B",
            explanation: "Increase in 10 years = 2,62,500 - 1,75,000 = 87,500.\nIncrease % in 10 years = (87500 / 175000) * 100 = 50%.\nAverage percent increase per year = 50% / 10 = 5%."
        },
        {
            id: "pc12",
            question: "If the price of a book is first decreased by 25% and then increased by 20%, then the net change in the price will be:",
            options: { A: "10% decrease", B: "5% decrease", C: "No change", D: "5% increase" },
            correctAnswer: "A",
            explanation: "Let the original price be Rs. 100.\nNew final price = 120% of (75% of Rs. 100)\n= (120/100) * (75/100) * 100 = 90.\nDecrease = 100 - 90 = 10.\nNet change = 10% decrease."
        },
        {
            id: "pc13",
            question: "Gauri went to the stationers and bought things worth Rs. 25, out of which 30 paise went on sales tax on taxable purchases. If the tax rate was 6%, then what was the cost of the tax free items?",
            options: { A: "Rs. 15", B: "Rs. 15.70", C: "Rs. 19.70", D: "Rs. 20" },
            correctAnswer: "C",
            explanation: "Let the amount of taxable purchases be Rs. x.\nThen, 6% of x = 30/100 (since 30 paise = Rs. 0.30).\nx = (30/100) * (100/6) = Rs. 5.\nCost of tax free items = Total Cost - (Taxable items + Tax)\n= 25 - (5 + 0.30) = Rs. 19.70."
        },
        {
            id: "pc14",
            question: "A bag contains 600 pens of 3 different colors: red, blue, and black. 20% are red, 45% are blue, and the rest are black. If 10% of the red pens and 20% of the black pens are defective, how many non-defective black pens are there?",
            options: { A: "168", B: "180", C: "192", D: "210" },
            correctAnswer: "A",
            explanation: "Percentage of black pens = 100% - (20% + 45%) = 35%.\nNumber of black pens = 35% of 600 = 210.\nDefective black pens = 20% of 210 = 42.\nNon-defective black pens = 210 - 42 = 168."
        },
        {
            id: "pc15",
            question: "In an examination, 35% of total students failed in Hindi, 45% failed in English and 20% in both. The percentage of those who passed in both subjects is:",
            options: { A: "10%", B: "20%", C: "30%", D: "40%" },
            correctAnswer: "D",
            explanation: "Let total students be 100.\nFailed in Hindi = 35. Failed in English = 45. Failed in both = 20.\nFailed in exactly one or both = (35 + 45) - 20 = 60.\nPassed in both = Total - Failed in at least one = 100 - 60 = 40.\nPercentage passed in both = 40%."
        }
    ],
    "Profit and Loss": [
        {
            id: "pl1",
            question: "Alfred buys an old scooter for Rs. 4700 and spends Rs. 800 on its repairs. If he sells the scooter for Rs. 5800, his gain percent is:",
            options: { A: "4 4/7%", B: "5 5/11%", C: "10%", D: "12%" },
            correctAnswer: "B",
            explanation: "Total cost price = Rs. (4700 + 800) = Rs. 5500.\nSelling price = Rs. 5800.\nGain = Rs. (5800 - 5500) = Rs. 300.\nGain % = (300 / 5500 x 100)% = 60/11% = 5 5/11%."
        },
        {
            id: "pl2",
            question: "The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:",
            options: { A: "15", B: "16", C: "18", D: "25" },
            correctAnswer: "B",
            explanation: "Let C.P. of each article be Re. 1. \nC.P. of x articles = Rs. x.\nS.P. of x articles = C.P. of 20 articles = Rs. 20.\nProfit = Rs. (20 - x).\nProfit % = [(20 - x) / x] x 100 = 25\n2000 - 100x = 25x ➔ 125x = 2000 ➔ x = 16."
        },
        {
            id: "pl3",
            question: "If selling price is doubled, the profit triples. Find the profit percent.",
            options: { A: "66 2/3%", B: "100%", C: "105 1/3%", D: "120%" },
            correctAnswer: "B",
            explanation: "Let C.P. be Rs. x and S.P. be Rs. y.\nThen, 3(y - x) = (2y - x)\n3y - 3x = 2y - x ➔ y = 2x.\nProfit = Rs. (y - x) = Rs. (2x - x) = Rs. x.\nProfit % = (x / x) x 100% = 100%."
        },
        {
            id: "pl4",
            question: "In a certain store, the profit is 320% of the cost. If the cost increases by 25% but the selling price remains constant, approximately what percentage of the selling price is the profit?",
            options: { A: "30%", B: "70%", C: "100%", D: "250%" },
            correctAnswer: "B",
            explanation: "Let C.P. = Rs. 100. Then, Profit = Rs. 320, S.P. = Rs. 420.\nNew C.P. = 125% of Rs. 100 = Rs. 125.\nNew S.P. = Rs. 420.\nProfit = Rs. (420 - 125) = Rs. 295.\nRequired percentage = (295 / 420 x 100)% ≈ 70%."
        },
        {
            id: "pl5",
            question: "A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?",
            options: { A: "3", B: "4", C: "5", D: "6" },
            correctAnswer: "C",
            explanation: "C.P. of 6 toffees = Re. 1.\nS.P. of 6 toffees = 120% of Re. 1 = Rs. 6/5.\nFor Rs. 6/5, toffees sold = 6.\nFor Re. 1, toffees sold = (6 x 5/6) = 5."
        },
        {
            id: "pl6",
            question: "The percentage profit earned by selling an article for Rs. 1920 is equal to the percentage loss incurred by selling the same article for Rs. 1280. At what price should the article be sold to make 25% profit?",
            options: { A: "Rs. 2000", B: "Rs. 2200", C: "Rs. 2400", D: "Data inadequate" },
            correctAnswer: "A",
            explanation: "Let C.P. be Rs. x.\nThen, (1920 - x) / x * 100 = (x - 1280) / x * 100\n1920 - x = x - 1280 ➔ 2x = 3200 ➔ x = 1600.\nRequired S.P. = 125% of Rs. 1600 = (125 / 100 x 1600) = Rs. 2000."
        },
        {
            id: "pl7",
            question: "A shopkeeper expects a gain of 22.5% on his cost price. If in a week, his sale was of Rs. 392, what was his profit?",
            options: { A: "Rs. 18.20", B: "Rs. 70", C: "Rs. 72", D: "Rs. 88.25" },
            correctAnswer: "C",
            explanation: "C.P. = Rs. [100 / (100 + 22.5) x 392] = Rs. [100 / 122.5 x 392] = Rs. 320.\nProfit = Rs. (392 - 320) = Rs. 72."
        },
        {
            id: "pl8",
            question: "A man buys a cycle for Rs. 1400 and sells it at a loss of 15%. What is the selling price of the cycle?",
            options: { A: "Rs. 1090", B: "Rs. 1160", C: "Rs. 1190", D: "Rs. 1202" },
            correctAnswer: "C",
            explanation: "S.P. = 85% of Rs. 1400 = (85 / 100 x 1400) = Rs. 1190."
        },
        {
            id: "pl9",
            question: "Sam purchased 20 dozens of toys at the rate of Rs. 375 per dozen. He sold each one of them at the rate of Rs. 33. What was his percentage profit?",
            options: { A: "3.5", B: "4.5", C: "5.6", D: "6.5" },
            correctAnswer: "C",
            explanation: "Cost Price of 1 toy = Rs. (375 / 12) = Rs. 31.25.\nSelling Price of 1 toy = Rs. 33.\nProfit = Rs. (33 - 31.25) = Rs. 1.75.\nProfit % = (1.75 / 31.25 x 100)% = 5.6%."
        },
        {
            id: "pl10",
            question: "Some articles were bought at 6 articles for Rs. 5 and sold at 5 articles for Rs. 6. Gain percent is:",
            options: { A: "30%", B: "33 1/3%", C: "35%", D: "44%" },
            correctAnswer: "D",
            explanation: "Suppose number of articles bought = LCM of 6 and 5 = 30.\nC.P. of 30 articles = Rs. (5/6 x 30) = Rs. 25.\nS.P. of 30 articles = Rs. (6/5 x 30) = Rs. 36.\nGain = Rs. (36 - 25) = Rs. 11.\nGain % = (11 / 25 x 100)% = 44%."
        }
    ]
};
