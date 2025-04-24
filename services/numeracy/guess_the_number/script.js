document.addEventListener("DOMContentLoaded", () => {
    let randomNumber, attempts, startTime;
    const gameId = 5; // ✅ Game ID for Number Guessing Game
    const startBtn = document.getElementById("start-btn");
    const quitBtn = document.getElementById("quit-btn");
    const gameArea = document.getElementById("game-area");
    const submitBtn = document.getElementById("submit-btn");
    const guessInput = document.getElementById("guess-input");
    const message = document.getElementById("message");
    const attemptsDisplay = document.getElementById("attempts");

    // ✅ Start Game
    startBtn.addEventListener("click", () => {
        randomNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        message.innerText = "";
        message.className = "";
        attemptsDisplay.innerText = "Attempts: 0";
        gameArea.style.display = "block";
        startBtn.style.display = "none";
        guessInput.disabled = false;
        submitBtn.disabled = false;
        guessInput.value = "";
        guessInput.focus();

        startTime = new Date(); // ✅ Start time when game begins
    });

    // ✅ Quit Game
    quitBtn.addEventListener("click", () => {
        alert("Game Over! Thanks for playing.");
        window.location.href = "../../index.html";
    });

    // ✅ Submit Guess
    submitBtn.addEventListener("click", async () => {
        let userGuess = parseInt(guessInput.value);

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            message.innerText = "❌ Please enter a number between 1 and 100.";
            message.className = "wrong";
            return;
        }

        attempts++;
        attemptsDisplay.innerText = `Attempts: ${attempts}`;

        if (userGuess === randomNumber) {
            const endTime = new Date();
            const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000); // ✅ Duration in seconds

            message.innerText = `🎉 Correct! You guessed the number in ${attempts} attempts!`;
            message.className = "correct";
            submitBtn.disabled = true;
            guessInput.disabled = true;

            await saveProgress(attempts, timeTakenInSeconds); // ✅ Save score = attempts
        } else if (userGuess < randomNumber) {
            message.innerText = "⬆ Too low! Try again.";
            message.className = "wrong";
        } else {
            message.innerText = "⬇ Too high! Try again.";
            message.className = "wrong";
        }
    });

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
            score: score, // ✅ Number of attempts
            completion_time: completionTime.toString(), // ✅ Raw seconds
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
});
