// ✅ DOM Elements
const wordBox = document.getElementById("scrambled-word");
const userInput = document.getElementById("user-input");
const checkBtn = document.getElementById("check-btn");
const startBtn = document.getElementById("start-btn");
const quitBtn = document.getElementById("quit-btn");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");

// 🎧 Audio Elements
const correctSound = document.getElementById("correctSound");
const incorrectSound = document.getElementById("incorrectSound");
const timeupSound = document.getElementById("timeupSound");

// ✅ Word List (Dyslexia-Friendly)
let words = [
    "pen", "hen", "ten", "men", "dog", "log", "fog",
    "clap", "trap", "stop", "jump", "grab",
    "flip", "clip", "block", "drop", "crack",
    "window", "butterfly", "elephant", "monkey",
    "flower", "rainbow", "school", "garden",
    "apple", "table", "chair", "grape", "plane", "crane", "shine", "spine", "flame", "frame",
    "star", "scar", "cart", "dart", "mart", "part", "bark", "dark"
];

let currentWord = "";
let scrambledWord = "";
let score = 0;
let timeLeft = 120; // 2 minutes
let timer;
let isGameActive = false;

// 🎮 Start Game Event Listeners
startBtn.addEventListener("click", startGame);
checkBtn.addEventListener("click", checkWord);
quitBtn.addEventListener("click", quitGame);

// ✅ Start Game Function
function startGame() {
    resetGame(); // Reset game before starting
    isGameActive = true;
    nextWord();
    startTimer();
}

// 🎯 Get Next Word and Scramble
function nextWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    scrambledWord = scrambleWord(currentWord);
    wordBox.textContent = scrambledWord;
    userInput.value = "";
}

// 🔄 Scramble Word Function
function scrambleWord(word) {
    return word.split("").sort(() => Math.random() - 0.5).join("");
}

// ⏰ Start Timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 10) {
            timerElement.classList.add("blink");
        }

        if (timeLeft <= 0) {
            endGame(false); // Time's up
        }
    }, 1000);
}

// ✅ Update Timer Display
function updateTimerDisplay() {
    timerElement.textContent = `⏳ Time: ${timeLeft}`;
}

// ✅ Check User’s Answer
function checkWord() {
    if (!isGameActive) return;

    const userAnswer = userInput.value.trim().toLowerCase();
    if (userAnswer === currentWord.toLowerCase()) {
        correctSound.play(); // ✅ Correct Sound
        score++;
        updateScore();
        nextWord(); // Move to next word
    } else {
        incorrectSound.play(); // ❌ Incorrect Sound
        alert(`❌ Incorrect! The correct word was: ${currentWord}`);
        nextWord();
    }
}

// ✅ Update Score
function updateScore() {
    scoreElement.textContent = `🏆 Score: ${score}`;
}

// ❌ Quit Game
function quitGame() {
    endGame(true);
}

// ⏹️ End Game
function endGame(quit = false) {
    clearInterval(timer);
    isGameActive = false;
    const completionTime = 120 - timeLeft;
    if (!quit && score > 0) {
        saveProgress(score, completionTime);
    }

    if (quit) {
        alert("Thank You! See you soon.");
        window.location.href = "../index.html";
    }  else {
        timeupSound.play();
        alert(`⏰ Time's Up! Your final score is: ${score}`);
    }

    resetGame();
}

// 🔄 Reset Game State
function resetGame() {
    clearInterval(timer);
    score = 0;
    timeLeft = 120;
    wordBox.textContent = "Press Start to Begin!";
    updateScore();
    updateTimerDisplay();
    timerElement.classList.remove("blink");
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
      game_id: 3,
      score: score,
      completion_time: completionTime.toString(), // seconds
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
  