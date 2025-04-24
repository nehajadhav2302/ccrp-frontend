const problemElement = document.getElementById("problem");
const userAnswerElement = document.getElementById("user-answer");
const submitButton = document.getElementById("submit-button");
const resultElement = document.getElementById("result");
const timerElement = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const quitButton = document.getElementById("quit-button");
const scoreCount = document.getElementById("score-count");
const timeUpSound = document.getElementById("time-up-sound");

let timeLeft = 120;
let score = 0;
let gameTimer;
let startTime;
const gameId = 6; // ✅ Game ID

startButton.addEventListener("click", startGame);
submitButton.addEventListener("click", checkAnswer);
restartButton.addEventListener("click", restartGame);
quitButton.addEventListener("click", () => {
    clearInterval(gameTimer);
    const timePlayed = Math.max(0, 120 - timeLeft);
    saveProgress(score, timePlayed); // ✅ Save progress on quit
    window.location.href = "../../index.html";
});

function generateProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ["+", "-", "×", "÷"];
    const randomOperator = operators[Math.floor(Math.random() * operators.length)];

    let correctAnswer;

    if (randomOperator === "+") {
        correctAnswer = num1 + num2;
    } else if (randomOperator === "-") {
        correctAnswer = num1 - num2;
    } else if (randomOperator === "×") {
        correctAnswer = num1 * num2;
    } else {
        correctAnswer = num1;
        problemElement.dataset.answer = num1;
        return `${num1 * num2} ÷ ${num2}`;
    }

    problemElement.dataset.answer = correctAnswer;
    return `${num1} ${randomOperator} ${num2}`;
}

function startGame() {
    startButton.style.display = "none";
    quitButton.style.display = "inline-block";
    restartButton.style.display = "none";
    submitButton.disabled = false;
    userAnswerElement.disabled = false;
    problemElement.textContent = generateProblem();
    score = 0;
    scoreCount.textContent = score;
    timeLeft = 120;
    updateTimer();
    startTime = new Date(); // ✅ Capture start time
    startTimer();
}

function startTimer() {
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            timeUpSound.play();
            endGame();
        }
    }, 1000);
}

function updateTimer() {
    timerElement.textContent = timeLeft;
    progressBar.style.width = (timeLeft / 120) * 100 + "%";
}

function checkAnswer() {
    const correctAnswer = parseInt(problemElement.dataset.answer);
    const userAnswer = parseInt(userAnswerElement.value);

    if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
        score++;
        scoreCount.textContent = score;
    }

    userAnswerElement.value = "";
    problemElement.textContent = generateProblem();
}

function endGame() {
    submitButton.disabled = true;
    userAnswerElement.disabled = true;
    quitButton.style.display = "inline-block";
    restartButton.style.display = "inline-block";
    resultElement.innerHTML = `<strong>Time's up! Final Score: ${score}</strong>`;

    const endTime = new Date();
    const timePlayed = Math.floor((endTime - startTime) / 1000); // ✅ Time played in seconds
    saveProgress(score, timePlayed); // ✅ Save score and time
}

function restartGame() {
    resultElement.textContent = "";
    startGame();
}

// ✅ Save Progress to Server
async function saveProgress(score, completionTime) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.warn("User ID not found in localStorage.");
        return;
    }

    const progressData = {
        user_id: parseInt(userId),
        game_id: gameId,
        score: score,
        completion_time: completionTime.toString(), // ✅ Store in seconds
    };

    try {
        const response = await fetch("http://127.0.0.1:8080/api/progress/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(progressData),
        });

        if (response.ok) {
            console.log("🎯 Progress saved successfully!");
        } else {
            console.error("❌ Failed to save progress.");
        }
    } catch (error) {
        console.error("⚠️ Error saving progress:", error);
    }
}
