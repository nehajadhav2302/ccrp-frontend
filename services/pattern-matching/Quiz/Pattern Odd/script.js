document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-button");
    const instructions = document.getElementById("instructions");
    const gameContainer = document.getElementById("game-container");
    const optionsContainer = document.getElementById("options-container");
    const questionText = document.getElementById("question-text");
    const message = document.getElementById("message");
    const nextButton = document.getElementById("next-button");
    const quitButton = document.getElementById("quit-button");
    const timerDisplay = document.getElementById("timer");
    const scoreDisplay = document.getElementById("score-display");
    const finalScore = document.getElementById("final-score");
    const restartButton = document.getElementById("restart-button");
    const quitFinalButton = document.getElementById("quit-final-button");
    const quitButtonTop = document.getElementById("quit-button-top");

    // Adding audio elements for sound effects
    const correctSound = new Audio("../../../../audio/correct.wav");
    const wrongSound = new Audio("../../../../audio/incorrect.wav");
    const timerSound = new Audio("../../../../audio/timeup.wav");
    
    let questions = [
        { correctAnswer: "Table", options: ["Chair", "Sofa", "Table"] },
        { correctAnswer: "Parrot", options: ["Dog", "Cat", "Parrot"] },
        { correctAnswer: "Carrot", options: ["Apple", "Banana", "Carrot"] },
        { correctAnswer: "Boat", options: ["Car", "Bus", "Boat"] },
        { correctAnswer: "Circle", options: ["Red", "Blue", "Circle"] },
        { correctAnswer: "Apple", options: ["Square", "Triangle", "Apple"] },
        { correctAnswer: "Snake", options: ["Cat", "Dog", "Snake"] },
        { correctAnswer: "Notebook", options: ["Spoon", "Fork", "Notebook"] },
        { correctAnswer: "Sun", options: ["Star", "Moon", "Sun"] },
        { correctAnswer: "Rose", options: ["Carrot", "Potato", "Rose"] },
        { correctAnswer: "Soccer", options: ["Chess", "Carrom", "Soccer"] },
        { correctAnswer: "Cow", options: ["Horse", "Sheep", "Cow"] },
        { correctAnswer: "Cabbage", options: ["Mango", "Orange", "Cabbage"] },
        { correctAnswer: "Plane", options: ["Train", "Bus", "Plane"] },
        { correctAnswer: "Fish", options: ["Whale", "Dolphin", "Fish"] },
        { correctAnswer: "Glass", options: ["Spoon", "Plate", "Glass"] },
        { correctAnswer: "Snake", options: ["Tiger", "Lion", "Snake"] },
        { correctAnswer: "Flute", options: ["Piano", "Guitar", "Flute"] },
        { correctAnswer: "Bat", options: ["Sparrow", "Parrot", "Bat"] },
        { correctAnswer: "Circle", options: ["Cube", "Cuboid", "Circle"] },
        { correctAnswer: "February", options: ["January", "March", "February"] },
        { correctAnswer: "Frog", options: ["Turtle", "Crocodile", "Frog"] },
        { correctAnswer: "Helium", options: ["Iron", "Gold", "Helium"] },
        { correctAnswer: "Glasses", options: ["Watch", "Glasses", "Clock"] },
        { correctAnswer: "Pencil", options: ["Pen", "Marker", "Pencil"] }
    ];    

    let shuffledQuestions = shuffle(questions).slice(0, 12);
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 120;

    // 🚀 Start Game
    startButton.addEventListener("click", () => {
        instructions.style.display = "none";
        gameContainer.style.display = "block";
        loadQuestion(currentQuestionIndex);
        startTimer();
    });

    // ⏰ Start Continuous Timer
    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `⏳ Time Left: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                timerSound.play(); // Play sound when time is up
                endGame();
            }
        }, 1000);
    }

    // 🚀 Load Question
    function loadQuestion(index) {
        if (index >= shuffledQuestions.length) {
            endGame();
            return;
        }

        const currentQuestion = shuffledQuestions[index];
        questionText.textContent = "Pick the Odd One Out";
        optionsContainer.innerHTML = "";
        
        let randomizedOptions = shuffle([...currentQuestion.options]);
        
        randomizedOptions.forEach((optionText) => {
            const option = document.createElement("div");
            option.className = "option";
            option.textContent = optionText;
            option.addEventListener("click", () => checkAnswer(option, currentQuestion.correctAnswer));
            optionsContainer.appendChild(option);
        });

        message.textContent = "";
        nextButton.style.display = "none";
    }

    // ✅ Validate Answer
    function checkAnswer(selectedOption, correctAnswer) {
        const selectedAnswer = selectedOption.textContent;

        if (selectedAnswer === correctAnswer) {
            selectedOption.classList.add("correct");
            score += 1;
            message.textContent = "✅ Correct!";
            correctSound.play(); // Play correct answer sound
        } else {
            selectedOption.classList.add("wrong");
            message.textContent = `❌ Wrong! Correct answer: ${correctAnswer}`;
            wrongSound.play(); // Play wrong answer sound
        }

        document.querySelectorAll(".option").forEach(option => {
            option.classList.add("disabled");
        });

        nextButton.style.display = "block";
    }

    // ➡️ Next Question
    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    });

    // 🏆 End Game
    function endGame() {
        gameContainer.style.display = "none";
        scoreDisplay.style.display = "block";
        finalScore.textContent = `${score} / ${shuffledQuestions.length * 10}`;
        const completionTime = 120 - timeLeft;
        saveProgress(score, completionTime, currentQuestionIndex);
        clearInterval(timer);
    }

    // Quit Game Function
    function quitGame() {
        console.log("Quit game triggered");
        instructions.style.display = "none";
        gameContainer.style.display = "none";
        alert("Thanks for playing! You have quit the game.");
        window.location.href = "../../../index.html"; // Update this to your desired URL
    }

    // Restart Game Function
    function restartGame() {
        console.log("Restart game triggered");
        location.reload();
    }

    // Event Listeners for Quit and Restart
    quitButtonTop.addEventListener("click", quitGame);
    quitButton.addEventListener("click", quitGame); // Quit the game when "Quit" button is clicked
    quitFinalButton.addEventListener("click", quitGame); // Quit the game when "Quit" button in the final screen is clicked
    restartButton.addEventListener("click", restartGame); // Restart the game when "Restart" button is clicked

    // 🔀 Shuffle Function
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }
});

// ✅ Save Progress to Server
async function saveProgress(score, completionTime, totalAttempts) {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      console.warn("User ID not found in localStorage.");
      return;
    }
  
    const progressData = {
      user_id: parseInt(userId),
      game_id: 9,
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
  