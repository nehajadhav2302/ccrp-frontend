const sentences = [
    "The sun is shining brightly", "She loves to read books", "Birds are flying in the sky",
    "He is playing football", "The cat is sleeping on the mat", "We went to the park yesterday",
    "She drinks a glass of water", "They are learning to swim", "The teacher writes on the board",
    "My mother cooks delicious food", "I am going to the market", "She has a beautiful smile",
    "We are watching a movie", "They enjoy playing outside", "The dog is barking loudly",
    "I love eating ice cream", "The stars are twinkling at night", "She wears a blue dress",
    "He is running very fast", "The baby is sleeping peacefully", "We should always tell the truth",
    "She is painting a beautiful picture", "He plays the guitar very well", "My father drives a car",
    "She is singing a lovely song", "They are building a sandcastle", "He is solving a math problem",
    "She makes a paper boat", "We love to dance together", "The rabbit hops in the garden"
];

let selectedWords = [];
let correctSentence = "";
let score = 0;
let timeLeft = 180;
let timer;
let currentQuestionIndex = 0;
const totalQuestions = 30;

const startButton = document.getElementById("startButton");
const quitButton = document.getElementById("quitButton");
const gameArea = document.getElementById("gameArea");
const resultArea = document.getElementById("resultArea");
const restartButton = document.getElementById("restartButton");
const quitFinalButton = document.getElementById("quitFinalButton");
const instructions = document.getElementById("instructions");
const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const resultMessage = document.getElementById("resultMessage");
const scoreDisplay = document.getElementById("score");
const userAnswerDisplay = document.getElementById("userAnswer");
const timerDisplay = document.getElementById("timer");

// Start Game
startButton.addEventListener("click", () => {
    instructions.classList.add("hidden");
    quitButton.classList.remove("hidden");
    gameArea.classList.remove("hidden");
    resultArea.classList.add("hidden");
    score = 0;
    scoreDisplay.innerText = `0`; // Initialize score display
    timeLeft = 180;
    currentQuestionIndex = 0;
    startTimer();
    loadQuestion();
});

// Quit Game
quitButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

// Restart Game
restartButton.addEventListener("click", () => location.reload());
quitFinalButton.addEventListener("click", () => {
        window.location.href = "../index.html";
});

// Start Timer
function startTimer() {
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time Left: ${timeLeft}`;
        if (timeLeft === 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// Load a random question
function loadQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        endGame();
        return;
    }

    let randomIndex = Math.floor(Math.random() * sentences.length);
    correctSentence = sentences[randomIndex];
    let words = correctSentence.split(" ").sort(() => Math.random() - 0.5);

    selectedWords = [];
    userAnswerDisplay.innerText = "";
    questionText.innerText = "Arrange the words:";
    optionsContainer.innerHTML = "";

    words.forEach(word => {
        let span = document.createElement("span");
        span.innerText = word;
        span.classList.add("option");
        span.onclick = () => selectWord(word, span);
        optionsContainer.appendChild(span);
    });
}

// Select word function
function selectWord(word, element) {
    selectedWords.push(word);
    userAnswerDisplay.innerText = selectedWords.join(" ");
    element.style.display = "none";
}

// Submit answer
submitBtn.addEventListener("click", () => {
    if (selectedWords.join(" ") === correctSentence) {
        score++;
        scoreDisplay.innerText = `${score}`; // Update score display
    }
    currentQuestionIndex++;
    loadQuestion();
});

// Reset current sentence
resetBtn.addEventListener("click", () => {
    selectedWords = [];
    userAnswerDisplay.innerText = "";
    optionsContainer.innerHTML = "";
    let words = correctSentence.split(" ").sort(() => Math.random() - 0.5);

    words.forEach(word => {
        let span = document.createElement("span");
        span.innerText = word;
        span.classList.add("option");
        span.onclick = () => selectWord(word, span);
        optionsContainer.appendChild(span);
    });
});

// End Game
function endGame() {
    clearInterval(timer);
    gameArea.classList.add("hidden");
    resultArea.classList.remove("hidden");
    const completionTime = 180 - timeLeft;
    const totalAttempts = currentQuestionIndex; // or totalQuestions
    saveProgress(score, completionTime, totalAttempts);
    setTimeout(() => {
        alert(`🎉 Game Over! Your Final Score: ${score}`);
    }, 500);
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
      game_id: 11,
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
  