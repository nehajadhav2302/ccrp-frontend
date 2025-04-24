// ✅ DOM Elements
const gameContainer = document.getElementById("game-container");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const quitBtn = document.getElementById("quit-btn");
const startSound = document.getElementById("start-sound");
const timesUpSound = document.getElementById("timeup-sound");

const userId = localStorage.getItem("userId");
const gameId = 1;
let score = 0;
let timeLeft = 120; // ⏰ 2 minutes
let circleInterval;
let timerInterval;
let isGameActive = false;
let startTime;

// ✅ Start Game Button Click
startBtn.addEventListener("click", () => {
    if (!userId) {
        alert("Please log in first.");
        window.location.href = "../../User/index.html";
        return;
    }
    startGame();
});

// ❌ Quit Game Button Click
quitBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
});

// 🎮 Start Game Function
function startGame() {
    if (isGameActive) return;

    resetGame();
    isGameActive = true;
    startBtn.disabled = true;
    quitBtn.disabled = false;

    startSound.play();
    startTime = new Date(); // Record game start time
    timerInterval = setInterval(updateTimer, 1000);
    circleInterval = setInterval(createRandomCircle, 1500);
}

// ❌ Quit or End Game
function endGame(quit = false) {
    clearInterval(timerInterval);
    clearInterval(circleInterval);
    isGameActive = false;

    const endTime = new Date();
    const completionTime = calculateTimePlayed(startTime, endTime);

    if (!quit) {
        timesUpSound.play();
        alert(`🎉 Game Over! Final Score: ${score}`);

        saveProgress(score, completionTime);        
    } else {
        alert("Thank You! See you soon....");
        window.location.href = "../index.html";
    }

    resetButtons();
}

// ✅ Reset Game State
function resetGame() {
    score = 0;
    timeLeft = 120;
    updateScore();
    updateTimer();
    gameContainer.innerHTML = "";
}

// ⏰ Update Timer
function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerElement.textContent = `⏳ Time: ${minutes}:${seconds}`;

    if (timeLeft <= 10) {
        timerElement.classList.add("blink");
    } else {
        timerElement.classList.remove("blink");
    }

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        endGame(); // Time’s up
    }
}

// ✅ Create Random Circle
function createRandomCircle() {
    if (!isGameActive) return;

    const circle = document.createElement("div");
    const randomColor = getRandomColor();
    circle.className = `circle ${randomColor}`;

    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight * 0.75 - 100);
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    gameContainer.appendChild(circle);

    circle.addEventListener("click", () => {
        circle.remove();
        score++;
        updateScore();
    });

    setTimeout(() => {
        if (circle.parentElement) {
            circle.remove();
        }
    }, 5000);
}

// ✅ Update Score
function updateScore() {
    scoreElement.textContent = `🏆 Score: ${score}`;
}

// ✅ Get Random Circle Color
function getRandomColor() {
    const circleColors = ["red", "blue", "green", "yellow"];
    return circleColors[Math.floor(Math.random() * circleColors.length)];
}

// 🔁 Reset Buttons After Game Ends
function resetButtons() {
    startBtn.textContent = "Restart Game";
    startBtn.disabled = false;
    quitBtn.disabled = true;
}

// ✅ Calculate Completion Time
function calculateTimePlayed(start, end) {
    const diffMs = end - start;
    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    const hours = Math.floor(diffMs / 1000 / 60 / 60);
    return `${hours}:${minutes}:${seconds}s`;
}

// ✅ Save Progress to Server
async function saveProgress(score, completionTime) {
    let userId = localStorage.getItem("userId");

    if (!userId) {
        console.warn("User ID not found in localStorage.");
        return;
    }

    const progressData = {
        user_id: parseInt(userId),
        game_id: gameId,
        score: score,
        completion_time: completionTime,
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