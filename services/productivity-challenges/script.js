const startButton = document.getElementById("start-button");
const gameContainer = document.getElementById("game-container");
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const answerBox = document.getElementById("answer-box");
const timerDisplay = document.getElementById("timer");
const resultContainer = document.getElementById("result-container");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");
let correctAnswers = 0;
let totalQuestions = 25;
let currentQuestionIndex = 0;
let timeLeft = 120;
let timer;

const questions = [
    { question: "What color is an apple?", answer: "Red", options: ["Red", "Blue", "Green"] },
    { question: "What is the source of light for Earth?", answer: "Sun", options: ["Moon", "Sun", "Star"] },
    { question: "What comes after 2?", answer: "3", options: ["1", "3", "4"] },
    { question: "What moves on four wheels?", answer: "Car", options: ["Bike", "Car", "Bus"] },
    { question: "Largest land animal?", answer: "Elephant", options: ["Lion", "Elephant", "Giraffe"] },
    { question: "Which animal is kept as a pet?", answer: "Dog", options: ["Tiger", "Dog", "Lion"] },
    { question: "Which is the largest ocean?", answer: "Pacific", options: ["Atlantic", "Indian", "Pacific"] },
    { question: "What letter comes after B?", answer: "C", options: ["C", "D", "E"] },
    { question: "What is the color of the sky?", answer: "Blue", options: ["Yellow", "Green", "Blue"] },
    { question: "Which animal can swim and fly?", answer: "Duck", options: ["Duck", "Cat", "Elephant"] },
    { question: "What fruit is yellow and long?", answer: "Banana", options: ["Banana", "Apple", "Orange"] },
    { question: "What do we blow on a birthday cake?", answer: "Candles", options: ["Balloons", "Candles", "Lights"] },
    { question: "Where do we live?", answer: "House", options: ["Tent", "House", "Car"] },
    { question: "What is sweet and round with chocolate chips?", answer: "Cookie", options: ["Cookie", "Bread", "Biscuit"] },
    { question: "King of the jungle?", answer: "Lion", options: ["Elephant", "Lion", "Bear"] },
    { question: "What helps us see the time?", answer: "Clock", options: ["Mirror", "Clock", "Window"] },
    { question: "What shape has three sides?", answer: "Triangle", options: ["Square", "Triangle", "Circle"] },
    { question: "What do we listen to for fun?", answer: "Music", options: ["Book", "Music", "Movie"] },
    { question: "What do we use to write?", answer: "Pen", options: ["Brush", "Pen", "Spoon"] },
    { question: "Where do doctors work?", answer: "Hospital", options: ["School", "Hospital", "Bank"] },
    { question: "Where do we sleep?", answer: "Bed", options: ["Sofa", "Chair", "Bed"] },
    { question: "How many colors are in a rainbow?", answer: "Seven", options: ["Five", "Six", "Seven"] },
    { question: "Which traffic light means 'stop'?", answer: "Red", options: ["Red", "Yellow", "Green"] },
    { question: "What helps us hear?", answer: "Ear", options: ["Eye", "Ear", "Nose"] },
    { question: "What shines in the night sky?", answer: "Star", options: ["Moon", "Star", "Sun"] },
];

const shuffledQuestions = questions.sort(() => Math.random() - 0.5);


startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

function startGame() {
    document.getElementById("instructions").classList.add("hidden");
    document.getElementById("start-container").classList.add("hidden");
    gameContainer.classList.remove("hidden");
    resultContainer.classList.add("hidden");
    correctAnswers = 0;
    currentQuestionIndex = 0;
    timeLeft = 120;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    timer = setInterval(countdown, 1000);
    nextQuestion();
}

function countdown() {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
        endGame();
    }
}

function nextQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        endGame();
        return;
    }
    const q = shuffledQuestions[currentQuestionIndex];
    questionContainer.textContent = q.question;
    optionsContainer.innerHTML = "";
    q.options.forEach(optionText => {
        let option = document.createElement("div");
        option.classList.add("option");
        option.textContent = optionText;
        option.draggable = true;
        option.setAttribute("ondragstart", "drag(event)");
        option.id = optionText;
        optionsContainer.appendChild(option);
    });
    answerBox.addEventListener("drop", drop);
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let selectedAnswer = document.getElementById(data).textContent;
    if (selectedAnswer === shuffledQuestions[currentQuestionIndex].answer) {
        correctAnswers++;
    }
    document.getElementById(data).remove();
    currentQuestionIndex++;
    nextQuestion();
}

function endGame() {
    clearInterval(timer);
    gameContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreDisplay.textContent = `You got ${correctAnswers} questions correct!`;
    const completionTime = 120 - timeLeft; // Time taken by the user
    saveProgress(correctAnswers, completionTime, currentQuestionIndex);
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
      game_id: 10,
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
  