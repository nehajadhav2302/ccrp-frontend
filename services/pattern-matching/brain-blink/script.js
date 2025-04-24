// ✅ Game Variables
let currentIndex = 0;
let score = 0;
let lives = 3;
let timer;
let streak = 0;
const gameDuration = 60; // ⏰ Total game time in seconds
let remainingTime = gameDuration;
let gameActive = false;

// ✅ Pattern Array with New Patterns
const patternArray = [
  { pattern: "🔴🔵🟢", options: ["🔴🔵🟢", "🟢🔴🔵", "🔵🔴🟢"], correct: 0 },
  { pattern: "ABC", options: ["ABC", "ACB", "BAC"], correct: 0 },
  { pattern: "▲▼▲", options: ["▲▼▲", "▼▲▼", "▲▲▼"], correct: 0 },
  { pattern: "🔺🔻🔺🔻", options: ["🔺🔻🔺🔻", "🔻🔺🔺🔻", "🔺🔺🔻🔻"], correct: 0 },
  { pattern: "AABBA", options: ["ABABA", "AABBA", "ABBAB"], correct: 1 },
  { pattern: "⭐️🌟⭐️🌟", options: ["⭐️🌟⭐️🌟", "🌟⭐️🌟⭐️", "⭐️⭐️🌟🌟"], correct: 0 },
  { pattern: "🎸🥁🎹", options: ["🎸🥁🎹", "🥁🎸🎹", "🎹🎸🥁"], correct: 0 },
  { pattern: "🐶🐱🐭", options: ["🐶🐱🐭", "🐭🐶🐱", "🐱🐭🐶"], correct: 0 },
  { pattern: "☀️🌧️🌈", options: ["☀️🌧️🌈", "🌧️☀️🌈", "🌈☀️🌧️"], correct: 0 },
  { pattern: "🚗🚚🛵", options: ["🚗🚚🛵", "🛵🚗🚚", "🚚🛵🚗"], correct: 0 },
  { pattern: "🍕🍔🍟", options: ["🍕🍔🍟", "🍟🍕🍔", "🍔🍟🍕"], correct: 0 },
  { pattern: "⚽🏀🎾", options: ["⚽🏀🎾", "🏀🎾⚽", "🎾⚽🏀"], correct: 0 },
  { pattern: "💡🔋⚡", options: ["💡🔋⚡", "⚡💡🔋", "🔋⚡💡"], correct: 0 },
  { pattern: "🎁🎀🎉", options: ["🎁🎀🎉", "🎀🎁🎉", "🎉🎁🎀"], correct: 0 },
  { pattern: "🎮🕹️💻", options: ["🎮🕹️💻", "💻🎮🕹️", "🕹️💻🎮"], correct: 0 },
  { pattern: "⏰🕰️⏱️", options: ["⏰🕰️⏱️", "⏱️⏰🕰️", "🕰️⏱️⏰"], correct: 0 },
  { pattern: "🧩🟥🟧", options: ["🧩🟥🟧", "🟧🧩🟥", "🟥🟧🧩"], correct: 0 },
  { pattern: "🌸🍁🌻", options: ["🌸🍁🌻", "🌻🌸🍁", "🍁🌸🌻"], correct: 0 },
  { pattern: "✈️🚂⛵", options: ["✈️🚂⛵", "🚂⛵✈️", "⛵✈️🚂"], correct: 0 },
  { pattern: "🍩🍫🍭", options: ["🍩🍫🍭", "🍫🍭🍩", "🍭🍩🍫"], correct: 0 },
  { pattern: "🏈⚾🏐", options: ["🏈⚾🏐", "⚾🏐🏈", "🏐🏈⚾"], correct: 0 },
  { pattern: "☀️🌙⭐", options: ["☀️🌙⭐", "🌙⭐☀️", "⭐☀️🌙"], correct: 0 },
  { pattern: "🎈🎂🎊", options: ["🎈🎂🎊", "🎂🎊🎈", "🎊🎈🎂"], correct: 0 },
  { pattern: "📱⌚📺", options: ["📱⌚📺", "📺📱⌚", "⌚📱📺"], correct: 0 },
];

// ✅ DOM Elements
const patternDisplay = document.getElementById("pattern-display");
const optionsContainer = document.getElementById("options-container");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const timerDisplay = document.getElementById("timer");
const timerBar = document.getElementById("timer-bar");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

// ✅ Audio Elements
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");

// 🎲 Shuffle Array Function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 🎮 Start Game
function startGame() {
  if (gameActive) return;
  gameActive = true;

  shuffleArray(patternArray);
  currentIndex = 0;
  score = 0;
  lives = 3;
  remainingTime = gameDuration;
  updateUI();
  displayPattern();
  startTimer();

  startButton.style.display = "none";
  resetButton.style.display = "inline-block";
}

// ✅ Display Pattern and Options with Shuffled Choices
function displayPattern() {
  if (!gameActive) return;

  const currentPattern = patternArray[currentIndex];
  patternDisplay.textContent = currentPattern.pattern;

  // 🎲 Shuffle Options Before Display
  const shuffledOptions = [...currentPattern.options];
  shuffleArray(shuffledOptions);

  optionsContainer.innerHTML = ""; // Clear previous options
  shuffledOptions.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("option");
    optionElement.textContent = option;
    optionElement.setAttribute(
      "data-index",
      currentPattern.options.indexOf(option) // Get original index for comparison
    );
    optionElement.addEventListener("click", checkMatch);
    optionsContainer.appendChild(optionElement);
  });
}

// ✅ Check User Match and Score
function checkMatch() {
  if (!gameActive) return;

  const selectedIndex = parseInt(this.getAttribute("data-index"));
  const currentPattern = patternArray[currentIndex];

  if (selectedIndex === currentPattern.correct) {
    this.classList.add("correct"); // 🟢 Highlight correct
    correctSound.play();
    score += 1;
    currentIndex++;

    // 🎉 Continue to Next Pattern Without Restriction
    if (currentIndex >= patternArray.length) {
      currentIndex = 0; // Loop to first pattern after end
    }
    setTimeout(() => {
      resetOptionColors();
      displayPattern();
    }, 800);
  } else {
    this.classList.add("wrong"); // 🔴 Highlight wrong
    wrongSound.play();
    lives--;

    if (lives === 0) {
      setTimeout(loseGame, 500);
    } else {
      setTimeout(() => {
        resetOptionColors();
      }, 800);
    }
  }
  updateUI();
}

// ✅ Reset Colors of Options
function resetOptionColors() {
  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.classList.remove("correct", "wrong");
  });
}

// ✅ Update Score, Lives, and Timer Display
function updateUI() {
  scoreDisplay.textContent = `🏆 Score: ${score}`;
  livesDisplay.textContent = `❤️ Lives: ${lives}`;
  timerDisplay.textContent = `⏳ Time: ${remainingTime}s`;

  // 🎯 Timer Bar Progress
  const barWidth = (remainingTime / gameDuration) * 100;
  timerBar.style.width = `${barWidth}%`;

  if (remainingTime <= 20) {
    timerBar.style.backgroundColor = "red";
  } else if (remainingTime <= 40) {
    timerBar.style.backgroundColor = "orange";
  } else {
    timerBar.style.backgroundColor = "green";
  }
}

// ⏰ Start Timer
function startTimer() {
  timer = setInterval(() => {
    remainingTime--;
    updateUI();

    if (remainingTime <= 0) {
      clearInterval(timer);
      loseGame();
    }
  }, 1000);
}

// 🎉 Win Game (Endless Mode, loops through patterns)
function winGame() {
  clearInterval(timer);
  winSound.play();
  alert(`🎉 Well done! You scored ${score} points!`);
  gameActive = false;
  resetButton.style.display = "inline-block";
  const completionTime = gameDuration - remainingTime;
  saveProgress(score, completionTime);
}

// ❌ Lose Game
function loseGame() {
  clearInterval(timer);
  loseSound.play();
  alert(`Game Over! You scored ${score} points.`);
  gameActive = false;
  resetButton.style.display = "inline-block";
  const completionTime = gameDuration - remainingTime;
  saveProgress(score, completionTime);
}

// 🔄 Reset Game
function resetGame() {
    clearInterval(timer); // ✅ Stop the previous timer
    gameActive = false;
  
    // 🎮 Reset Game Variables
    currentIndex = 0;
    score = 0;
    lives = 3;
    remainingTime = gameDuration; // ⏳ Reset to 60 seconds
  
    // 🧩 Reset UI
    patternDisplay.textContent = "";
    optionsContainer.innerHTML = "";
    scoreDisplay.textContent = `🏆 Score: 0`;
    livesDisplay.textContent = `❤️ Lives: 3`;
    timerDisplay.textContent = `⏳ Time: 60s`;
    timerBar.style.width = "100%";
    timerBar.style.backgroundColor = "green";
  
    startButton.style.display = "inline-block";
    resetButton.style.display = "none";
  
    updateUI(); // ✅ Update UI before starting again
  }
  

// 🚪 Quit Game
function quitGame() {
  alert("👋 Thanks for playing! See you soon!");
  resetGame();
  window.location.href = "../../index.html";
}

// 🎮 Event Listeners
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
document.getElementById("quit-button").addEventListener("click", quitGame);

// ✅ Save Progress to Server
async function saveProgress(score, completionTime, totalAttempts) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.warn("User ID not found in localStorage.");
    return;
  }

  const progressData = {
    user_id: parseInt(userId),
    game_id: 7, // ✅ Set Game ID explicitly
    score: score, // ✅ Score being saved
    total_attempts: totalAttempts, // ✅ Total attempts
    completion_time: completionTime.toString(), // ✅ Completion time in seconds
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

