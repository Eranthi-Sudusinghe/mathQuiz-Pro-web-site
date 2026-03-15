// Math Quiz Questions
const mathQuestions = [
    {
        question: "What is 15 + 27?",
        answers: ["42", "40", "45", "38"],
        correct: 0
    },
    {
        question: "What is 8 × 7?",
        answers: ["54", "56", "63", "64"],
        correct: 1
    },
    {
        question: "What is 144 ÷ 12?",
        answers: ["10", "11", "12", "13"],
        correct: 2
    },
    {
        question: "What is 25% of 80?",
        answers: ["15", "20", "25", "30"],
        correct: 1
    },
    {
        question: "What is the square root of 169?",
        answers: ["11", "12", "13", "14"],
        correct: 2
    },
    {
        question: "What is 2³ (2 cubed)?",
        answers: ["6", "8", "9", "16"],
        correct: 1
    },
    {
        question: "What is the area of a rectangle with length 8 and width 5?",
        answers: ["13", "26", "40", "45"],
        correct: 2
    },
    {
        question: "What is 100 - 37?",
        answers: ["63", "67", "73", "77"],
        correct: 0
    },
    {
        question: "What is 15 × 6?",
        answers: ["80", "85", "90", "95"],
        correct: 2
    },
    {
        question: "What is the perimeter of a square with side length 9?",
        answers: ["18", "27", "36", "81"],
        correct: 2
    },
    {
        question: "What is 72 ÷ 8?",
        answers: ["7", "8", "9", "10"],
        correct: 2
    },
    {
        question: "What is 5² (5 squared)?",
        answers: ["10", "15", "20", "25"],
        correct: 3
    },
    {
        question: "What is 35 + 48?",
        answers: ["73", "83", "93", "103"],
        correct: 1
    },
    {
        question: "What is 12 × 11?",
        answers: ["122", "132", "142", "152"],
        correct: 1
    },
    {
        question: "What is 50% of 150?",
        answers: ["50", "65", "75", "85"],
        correct: 2
    }
];

// Game State
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;

// Initialize leaderboard from localStorage
let leaderboard = JSON.parse(localStorage.getItem('mathQuizLeaderboard')) || [
    { name: "Alice Chen", score: 950, percentage: 95, date: "2024-02-08" },
    { name: "Bob Smith", score: 920, percentage: 92, date: "2024-02-07" },
    { name: "Carol Johnson", score: 880, percentage: 88, date: "2024-02-06" },
    { name: "David Lee", score: 850, percentage: 85, date: "2024-02-05" },
    { name: "Emma Wilson", score: 830, percentage: 83, date: "2024-02-04" }
];

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    updateLeaderboard();

    // Update navbar active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    let pageId = pageName + 'Page';

    if (pageName === 'quiz') {
        startQuiz();
    } else {
        document.getElementById(pageId).classList.add('active');
    }

    // Update navbar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function startQuiz() {
    // Select 10 random questions
    currentQuestions = shuffleArray([...mathQuestions]).slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;

    document.getElementById('currentScore').textContent = score;
    document.getElementById('quizPage').classList.add('active');

    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
        return;
    }

    const question = currentQuestions[currentQuestionIndex];

    // Update UI
    document.getElementById('questionNumber').textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('progressBar').style.width = `${((currentQuestionIndex) / currentQuestions.length) * 100}%`;

    // Load answers
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => selectAnswer(index);
        container.appendChild(btn);
    });

    document.getElementById('nextBtn').classList.remove('show');
}

function selectAnswer(index) {
    const question = currentQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn');

    // Disable all buttons
    buttons.forEach(btn => btn.classList.add('disabled'));

    if (index === question.correct) {
        buttons[index].classList.add('correct');
        correctCount++;
        score += 100;
        document.getElementById('currentScore').textContent = score;
    } else {
        buttons[index].classList.add('incorrect');
        buttons[question.correct].classList.add('correct');
    }

    document.getElementById('nextBtn').classList.add('show');
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function showResults() {
    const percentage = Math.round((correctCount / currentQuestions.length) * 100);

    // Update results display
    document.getElementById('percentageDisplay').textContent = percentage + '%';
    document.getElementById('correctAnswers').textContent = correctCount;
    document.getElementById('totalQuestions').textContent = currentQuestions.length;
    document.getElementById('finalScore').textContent = score;

    // Set icon based on performance
    let icon = '🎉';
    if (percentage === 100) {
        icon = '🏆';
    } else if (percentage >= 80) {
        icon = '⭐';
    } else if (percentage >= 60) {
        icon = '👍';
    } else {
        icon = '📚';
    }
    document.getElementById('resultsIcon').textContent = icon;

    // Add to leaderboard
    const userName = prompt("Great job! Enter your name for the leaderboard:") || "Anonymous";
    const today = new Date().toISOString().split('T')[0];

    leaderboard.push({
        name: userName,
        score: score,
        percentage: percentage,
        date: today
    });

    // Sort and keep top 10
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    // Save to localStorage
    localStorage.setItem('mathQuizLeaderboard', JSON.stringify(leaderboard));
    updateLeaderboard();

    // Show results page
    document.getElementById('quizPage').classList.remove('active');
    document.getElementById('resultsPage').classList.add('active');
}

function updateLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    leaderboard.forEach((entry, index) => {
        const tr = document.createElement('tr');

        let rankBadge = `<span class="rank-badge">${index + 1}</span>`;
        if (index === 0) {
            rankBadge = `<span class="rank-badge gold">👑</span>`;
        } else if (index === 1) {
            rankBadge = `<span class="rank-badge silver">🥈</span>`;
        } else if (index === 2) {
            rankBadge = `<span class="rank-badge bronze">🥉</span>`;
        }

        tr.innerHTML = `
            <td>${rankBadge}</td>
            <td>${entry.name}</td>
            <td><span class="score-badge">${entry.score}</span></td>
            <td>${entry.percentage}%</td>
            <td>${entry.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
