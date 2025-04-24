const patternDisplay = document.getElementById("pattern-display");
const optionsContainer = document.getElementById("options-container");
const startButton = document.getElementById("start-button");
const quitButton = document.getElementById("quit-button");
const restartButton = document.getElementById("restart-button");
const feedback = document.getElementById("feedback");
const loseSound = document.getElementById("lose-sound");

const instructions = document.getElementById("instructions");
const gameSection = document.getElementById("game-section");

let patternSequence = [];
let userSequence = [];
let level = 1;
let displayTime = 30000;
let score = 0;
let startTime = null;
let totalAttempts = 1;

// Pattern Choices
const patterns = ["🔴", "🔵", "⚫", "🟢", "🟠", "🟣"];

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", () => {
  totalAttempts++;
  startGame();
});
quitButton.addEventListener("click", () => {
  window.location.href = "../../index.html";
});

function startGame() {
  instructions.style.display = "none";
  startButton.style.display = "none";
  gameSection.classList.remove("hidden");

  restartButton.style.display = "none";
  feedback.textContent = "";

  level = 1;
  score = 0;
  displayTime = 30000;
  patternSequence = [];
  userSequence = [];

  startTime = Date.now(); // ✅ Start the timer
  generatePattern();
}

function generatePattern() {
  patternSequence = [];
  userSequence = [];

  for (let i = 0; i < level; i++) {
    patternSequence.push(patterns[Math.floor(Math.random() * patterns.length)]);
  }

  displayPattern();
}

function displayPattern() {
  patternDisplay.textContent = patternSequence.join("  ");
  optionsContainer.innerHTML = "";

  setTimeout(() => {
    patternDisplay.textContent = "Repeat the pattern!";
    showOptions();
  }, displayTime);
}

function showOptions() {
  optionsContainer.innerHTML = "";
  patterns.forEach(pattern => {
    const option = document.createElement("div");
    option.classList.add("option");
    option.textContent = pattern;
    option.addEventListener("click", () => selectPattern(pattern));
    optionsContainer.appendChild(option);
  });
}

function selectPattern(pattern) {
  userSequence.push(pattern);
  if (userSequence.length === patternSequence.length) {
    checkAnswer();
  }
}

function checkAnswer() {
  if (JSON.stringify(userSequence) === JSON.stringify(patternSequence)) {
    score += level;
    feedback.textContent = `✅ Correct! Level ${level + 1} Unlocked!`;
    level++;
    setTimeout(generatePattern, 1500);
  } else {
    endGame();
  }
}

// ✅ End Game Function
function endGame() {
  const unlockedLevels = level - 1;
  const endTime = Date.now();
  const completionTime = Math.floor((endTime - startTime) / 1000); // in seconds

  feedback.textContent = `❌ Wrong! Game Over. You unlocked ${unlockedLevels} level${unlockedLevels !== 1 ? "s" : ""}.`;
  loseSound.play();
  saveProgress(unlockedLevels, completionTime, totalAttempts);
  restartButton.style.display = "inline-block";
}

// ✅ Save Progress to Server
async function saveProgress(score, completionTime, totalAttempts) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.warn("User ID not found in localStorage.");
    return;
  }

  const progressData = {
    user_id: parseInt(userId),
    game_id: 8,
    score: score,
    total_attempts: totalAttempts,
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
