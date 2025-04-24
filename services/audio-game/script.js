document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-button");
    const quitButton = document.getElementById("quit-button");
    const quitButtonFinal = document.getElementById("quit-button-final"); 
    const gameArea = document.getElementById("game-area");
    const questionText = document.getElementById("question-text");
    const audioPlayer = document.getElementById("audio-player");
    const optionsContainer = document.getElementById("options-container");
    const nextButton = document.getElementById("next-button");
    const echoMessage = document.getElementById("echo-message");
    const levelDisplay = document.getElementById("level-display");
    const restartButton = document.getElementById("restart-button");
    const finalScoreDisplay = document.getElementById("final-score");
    const gameOverScreen = document.getElementById("game-over");

    let level = "easy";
    let score = 0;
    let correctAnswers = 0;
    let questions = [];
    let currentQuestionIndex = 0;
    const gameId = 2;
    let userId = localStorage.getItem("userId"); // Ensure this is set correctly
    let startTime;

    // Check if userId exists in localStorage
    if (!userId) {
        alert("Please log in first.");
        window.location.href = "../../User/index.html"; // Redirect to login page if no userId
        return;
    }
    
    // Quit button event listeners
    if (quitButton) {
        quitButton.addEventListener("click", () => window.location.href = "../index.html");
    }

    if (quitButtonFinal) {
        quitButtonFinal.addEventListener("click", () => window.location.href = "../index.html");
    }

    const allQuestions = {
        easy: [
            { word: "bat", audio: "audio/easy/bat.mp3", options: ["bat", "bag", "bet"] },
            { word: "bed", audio: "audio/easy/bed.mp3", options: ["bed", "bad", "bid"] },
            { word: "bus", audio: "audio/easy/bus.mp3", options: ["bus", "but", "bat"] },
            { word: "cat", audio: "audio/easy/cat.mp3", options: ["cat", "cut", "cot"] },
            { word: "dog", audio: "audio/easy/dog.mp3", options: ["dog", "dot", "dig"] },
            { word: "fox", audio: "audio/easy/fox.mp3", options: ["fox", "fix", "fax"] },
            { word: "hat", audio: "audio/easy/hat.mp3", options: ["hat", "hot", "hut"] },
            { word: "pen", audio: "audio/easy/pen.mp3", options: ["pen", "pan", "pin"] },
            { word: "rat", audio: "audio/easy/rat.mp3", options: ["rat", "rut", "rot"] },
            { word: "sun", audio: "audio/easy/sun.mp3", options: ["sun", "sin", "soon"] }
        ],
        medium: [
            { word: "apple", audio: "audio/medium/apple.mp3", options: ["apple", "ample", "ankle"] },
            { word: "dinner", audio: "audio/medium/dinner.mp3", options: ["dinner", "diner", "danger"] },
            { word: "doctor", audio: "audio/medium/doctor.mp3", options: ["doctor", "duster", "dollar"] },
            { word: "flower", audio: "audio/medium/flower.mp3", options: ["flower", "flour", "flavor"] },
            { word: "ladder", audio: "audio/medium/ladder.mp3", options: ["ladder", "leader", "latter"] },
            { word: "monkey", audio: "audio/medium/monkey.mp3", options: ["monkey", "money", "monthly"] },
            { word: "parrot", audio: "audio/medium/parrot.mp3", options: ["parrot", "parent", "patent"] },
            { word: "pencil", audio: "audio/medium/pencil.mp3", options: ["pencil", "panel", "parcel"] },
            { word: "rocket", audio: "audio/medium/rocket.mp3", options: ["rocket", "racket", "rocket"] },
            { word: "tiger", audio: "audio/medium/tiger.mp3", options: ["tiger", "trigger", "tighter"] }
        ],
        hard: [
            { word: "banana", audio: "audio/hard/banana.mp3", options: ["banana", "bandana", "banner"] },
            { word: "butterfly", audio: "audio/hard/butterfly.mp3", options: ["butterfly", "buttercup", "battery"] },
            { word: "calculator", audio: "audio/hard/calculator.mp3", options: ["calculator", "calibrate", "calendar"] },
            { word: "chocolate", audio: "audio/hard/chocolate.mp3", options: ["chocolate", "choke", "chronic"] },
            { word: "crocodile", audio: "audio/hard/crocodile.mp3", options: ["crocodile", "coconut", "chronicle"] },
            { word: "elephant", audio: "audio/hard/elephant.mp3", options: ["elephant", "elegant", "element"] },
            { word: "helicopter", audio: "audio/hard/helicopter.mp3", options: ["helicopter", "helium", "helmet"] },
            { word: "pineapple", audio: "audio/hard/pineapple.mp3", options: ["pineapple", "pipeline", "pinwheel"] },
            { word: "television", audio: "audio/hard/television.mp3", options: ["television", "telephone", "telegram"] },
            { word: "umbrella", audio: "audio/hard/umbrella.mp3", options: ["umbrella", "universe", "underlay"] }
        ]
    };

    function startGame() {
        document.getElementById("instructions").style.display = "none";
        gameArea.style.display = "block";
        score = 0;
        correctAnswers = 0;
        level = "easy";
        startTime = new Date(); 
        loadQuestions();
        nextQuestion();
    }
    
    function calculateTimePlayed(start, end) {
        const diffMs = end - start; // milliseconds
        const seconds = Math.floor((diffMs / 1000) % 60);
        const minutes = Math.floor((diffMs / 1000 / 60) % 60);
        const hours = Math.floor(diffMs / 1000 / 60 / 60);
        return `${hours}:${minutes}:${seconds}s`;
    }    

    function loadQuestions() {
        questions = shuffleArray([...allQuestions[level]]);
        currentQuestionIndex = 0;
        levelDisplay.textContent = `Level: ${level.toUpperCase()} 🎯`;
    }

    function nextQuestion() {
        nextButton.style.display = "none"; 

        if (currentQuestionIndex >= questions.length) {
            checkLevelProgress();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = "🎧 Listen to the word...";
        audioPlayer.src = currentQuestion.audio;
        audioPlayer.play();

        optionsContainer.innerHTML = "";
        const shuffledOptions = shuffleArray(currentQuestion.options);
        shuffledOptions.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("option-button");
            button.addEventListener("click", () => checkAnswer(option, currentQuestion.word));
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(selected, correct) {
        if (selected === correct) {
            score++;
            correctAnswers++;
            echoMessage.textContent = "🦉 Hoo-ray! That’s right! ✅";
        } else {
            echoMessage.textContent = `🦉 Oops! The correct word was ${correct}. ❌`;
        }

        currentQuestionIndex++;
        nextButton.style.display = "block";
    }

    function checkLevelProgress() {
        if (level === "easy" && correctAnswers >= 7) {
            level = "medium";
            echoMessage.textContent = "🦉 Level 2 Unlocked! 🚀";
        } else if (level === "medium" && correctAnswers >= 8) {
            level = "hard";
            echoMessage.textContent = "🦉 Level 3 Unlocked! 🎯";
        } else {
            return endGame();
        }

        correctAnswers = 0;
        loadQuestions();
        nextQuestion();
    }

    function endGame() {
        gameArea.style.display = "none";
        gameOverScreen.style.display = "block";
        finalScoreDisplay.textContent = `Final Score: ${score} 🎉`;
    
        const endTime = new Date();
        const completionTime = calculateTimePlayed(startTime, endTime);
    
        saveProgress(score, completionTime);
    }    

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    startButton.addEventListener("click", startGame);
    nextButton.addEventListener("click", nextQuestion);
    restartButton.addEventListener("click", () => location.reload());
});

async function saveProgress(score, completionTime) {
    let userId = localStorage.getItem("userId");

    if (!userId) {
        console.warn("User ID not found in localStorage.");
        return;
    }

    const progressData = {
        user_id: parseInt(userId),
        game_id: 2,
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
