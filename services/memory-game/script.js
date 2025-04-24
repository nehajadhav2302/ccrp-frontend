// ✅ Game Card Array (Fruits Memory Game)
const cardArray = [
  { name: "apple", img: "images/apple.png" },
  { name: "banana", img: "images/banana.png" },
  { name: "cherry", img: "images/cherry.png" },
  { name: "grape", img: "images/grape.png" },
  { name: "orange", img: "images/orange.png" },
  { name: "pear", img: "images/pear.png" },
  { name: "apple", img: "images/apple.png" },
  { name: "banana", img: "images/banana.png" },
  { name: "cherry", img: "images/cherry.png" },
  { name: "grape", img: "images/grape.png" },
  { name: "orange", img: "images/orange.png" },
  { name: "pear", img: "images/pear.png" },
];

// ✅ Game Variables
let cardChosen = [];
let cardChosenId = [];
let cardsWon = [];
let startTime;
let count = 0; // Track number of attempts
const gameId = 4; // ✅ Game ID for Memory Game
let gameCompleted = false; // ✅ Prevent multiple game-end calls

// ✅ DOM Elements
const cards = document.querySelector(".memory-game");
const resetButton = document.getElementById("reset-button");
const quitButton = document.getElementById("quit-button");
const flipSound = document.getElementById("flip-sound");
const matchSound = document.getElementById("match-sound");
const winSound = document.getElementById("win-sound");

// ✅ Create Board and Shuffle Cards
function createBoard() {
  cards.innerHTML = ""; // Clear existing cards on reset
  cardArray.sort(() => 0.5 - Math.random()); // Shuffle cards
  cardArray.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", index);
    card.innerHTML = `<img src="images/blank.jpg" alt="Card" />`;
    card.addEventListener("click", flipCard);
    cards.appendChild(card);
  });
  // 🎯 Track Game Start Time
  startTime = new Date(); // Start time when the game begins
  count = 0; // Reset attempts
  gameCompleted = false; // Reset game completion status
}

// ✅ Flip Card with Sound
function flipCard() {
  if (gameCompleted) return; // ✅ Prevent actions after game ends

  const selected = this;
  const cardId = selected.getAttribute("data-id");

  // Prevent clicking the same card twice
  if (cardChosenId.includes(cardId)) {
    alert("⚠️ You clicked the same card! Try a different one.");
    return;
  }

  cardChosen.push(cardArray[cardId].name);
  cardChosenId.push(cardId);
  selected.querySelector("img").setAttribute("src", cardArray[cardId].img);

  // ✅ Play Flip Sound Only if Game is Not Completed
  if (!gameCompleted && flipSound) {
    flipSound.play().catch(() => console.log("⚠️ Flip sound error or blocked."));
  }

  // ✅ Check for Match after 2 cards
  if (cardChosen.length === 2) {
    setTimeout(checkMatch, 500);
  }
}

// ✅ Check for Match
function checkMatch() {
  const cards = document.querySelectorAll(".card");
  const [firstId, secondId] = cardChosenId;
  count++; // Increment attempts for each flip

  if (firstId === secondId) {
    // Same card clicked twice
    cards[firstId].querySelector("img").setAttribute("src", "images/blank.jpg");
    alert("⚠️ You clicked the same card!");
  } else if (cardChosen[0] === cardChosen[1]) {
    // ✅ Match Found - Disable Click After Match
    cards[firstId].removeEventListener("click", flipCard);
    cards[secondId].removeEventListener("click", flipCard);
    cardsWon.push(cardChosen);
  } else {
    // ❌ No Match - Reset Cards
    setTimeout(() => {
      cards[firstId].querySelector("img").setAttribute("src", "images/blank.jpg");
      cards[secondId].querySelector("img").setAttribute("src", "images/blank.jpg");
    }, 500);
  }

  // ✅ Reset Choices After Check
  cardChosen = [];
  cardChosenId = [];

  // ✅ Play Win Sound ONLY After Last Pair is Matched
  if (cardsWon.length === cardArray.length / 2) {
    setTimeout(endGame, 500); // Call endGame() after the last pair
  }
}


// ✅ End Game and Save Progress
async function endGame() {
  if (gameCompleted) return;
  gameCompleted = true;

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("❌ User ID not found. Please login again.");
    window.location.href = "../index.html";
    return;
  }

  const completionTime = calculateCompletionTime();
  const accuracy = calculateAccuracy();

  saveProgress(count, completionTime); 
  winSound?.play().catch(() => console.log("⚠️ Win sound error."));

  alert(`🎉 Game Over! You completed the game in ${count} attempts. Time: ${completionTime}`);
}

// ✅ Reset Game with Audio
function resetGame() {
  cards.innerHTML = "";
  cardChosen = [];
  cardChosenId = [];
  cardsWon = [];
  count = 0; // Reset attempts
  createBoard(); // Restart game with shuffled cards
}

// ✅ Clear Game Progress on Quit
function quitGame() {
  const userId = localStorage.getItem("userId");
  alert("You have exited the game.");
  window.location.href = "../index.html"; // Redirect to home page
}

// ✅ Calculate Accuracy Based on Matches
function calculateAccuracy() {
  const totalCards = cardArray.length / 2;
  const matchedPairs = cardsWon.length;
  const accuracy = (matchedPairs / totalCards) * 100;
  return accuracy.toFixed(2); // Return accuracy percentage
}

// ✅ Calculate and Format Completion Time (hh:mm:ss)
function calculateCompletionTime() {
  const endTime = new Date();
  const timeDiff = Math.floor((endTime - startTime) / 1000); // Time in seconds
  const hours = Math.floor(timeDiff / 3600);
  const minutes = Math.floor((timeDiff % 3600) / 60);
  const seconds = timeDiff % 60;

  // Format time to hh:mm:ss
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  return formattedTime;
}

// ✅ Save Game Progress to Backend
async function saveGameProgress(userId, gameId, score, accuracy, completionTime, attempts) {
  const progressData = {
    user_id: userId,
    game_id: gameId,
    score: cardsWon.length,
    accuracy: accuracy,
    completion_time: completionTime,
    attempts: attempts,
  };

  try {
    const response = await fetch("http://localhost:8080/api/progress/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progressData),
    });

    const result = await response.json();
    console.log(result.message); // ✅ Success message from backend
  } catch (error) {
    console.error("⚠️ Error saving game progress:", error);
  }
}

// ✅ Start Game and Initialize Attempts
function startGame() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("❌ User ID not found. Please login.");
    window.location.href = "../index.html";
  } else {
    console.log(`🎮 Game Started for User ID: ${userId}`);
  }
}

// ✅ Reset Button Listener
resetButton.addEventListener("click", resetGame);

// ✅ Quit Button Listener
quitButton.addEventListener("click", quitGame);

// ✅ Clear Progress on Page Unload/Exit
window.addEventListener("beforeunload", () => {
  const userId = localStorage.getItem("userId");
  localStorage.removeItem(`attempts_${userId}_${gameId}`);
});

// ✅ Initialize Game on Load
document.addEventListener("DOMContentLoaded", () => {
  startGame();
  createBoard();
  console.log("🎮 Game Loaded and Ready!");
});

// ✅ Save Progress to Server
async function saveProgress(count, completionTime) {
  let userId = localStorage.getItem("userId");

  if (!userId) {
      console.warn("User ID not found in localStorage.");
      return;
  }

  const progressData = {
      user_id: parseInt(userId),
      game_id: gameId,
      score: count,
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