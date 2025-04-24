document.addEventListener("DOMContentLoaded", () => {
    const gridSize = 10;
    const words = ["SHIP", "FROG", "TRAP", "CLAP", "GLUE", "SPOT", "BRICK", "TRAIN", "PLANE", "HORSE", "CROWN", "TABLE"];
    let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));
    let foundWords = new Set();
    let timeLeft = 300;
    let timerInterval;
    let selectedCells = [];
    let gameStarted = false;
    let gameEnded = false;

    const startBtn = document.getElementById("start-btn");
    const restartBtn = document.getElementById("restart-btn");
    const quitBtn = document.getElementById("quit-btn");

    function startGame() {
        gameStarted = true;
        gameEnded = false;
        timeLeft = 300;
        foundWords.clear();
        selectedCells = [];

        document.getElementById("game-board").style.display = "grid";
        startBtn.style.display = "none";
        restartBtn.style.display = "block";
        quitBtn.style.display = "block";

        document.getElementById("score-display").innerHTML = "";
        document.getElementById("word-list").innerHTML = "";

        words.forEach(word => {
            let wordSpan = document.createElement("li");
            wordSpan.innerText = word;
            wordSpan.id = `word-${word}`;
            document.getElementById("word-list").appendChild(wordSpan);
        });

        generateGrid();
        startTimer();
    }

    function startTimer() {
        document.getElementById("timer").innerText = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                highlightMissingWords();
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        if (gameEnded) return; // ✅ Prevent multiple execution
        gameEnded = true;
        clearInterval(timerInterval);
        let score = foundWords.size;
        let completionTime = 300 - timeLeft;
        saveProgress(score, completionTime);
        document.getElementById("score-display").innerHTML = `✅ Score: ${score} / ${words.length}`;
        alert(`Game Over! You found ${score} out of ${words.length} words.`);
    }

    function quitGame() {
        clearInterval(timerInterval);
        alert("Game Quit! Thanks for playing.");
        window.location.href="../index.html";
    }

    function generateGrid() {
        let gameBoardDiv = document.getElementById("game-board");
        gameBoardDiv.innerHTML = "";
        grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));

        placeWords();
        fillEmptyCells();

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                cell.innerText = grid[r][c];
                cell.dataset.row = r;
                cell.dataset.col = c;
                gameBoardDiv.appendChild(cell);
                cell.addEventListener("click", () => selectCell(cell));
            }
        }
    }

    function placeWords() {
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        words.forEach(word => {
            let placed = false;
            while (!placed) {
                let row = Math.floor(Math.random() * gridSize);
                let col = Math.floor(Math.random() * gridSize);
                let [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
                if (canPlaceWord(word, row, col, dr, dc)) {
                    for (let i = 0; i < word.length; i++) {
                        grid[row + i * dr][col + i * dc] = word[i];
                    }
                    placed = true;
                }
            }
        });
    }

    function canPlaceWord(word, row, col, dr, dc) {
        for (let i = 0; i < word.length; i++) {
            let newRow = row + i * dr;
            let newCol = col + i * dc;
            if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize || grid[newRow][newCol] !== "") {
                return false;
            }
        }
        return true;
    }

    function fillEmptyCells() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === "") {
                    grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
    }

    function selectCell(cell) {
        if (!gameStarted || cell.classList.contains("found")) return;
        selectedCells.push(cell);
        cell.classList.add("selected");

        if (selectedCells.length === 2) {
            checkForWord();
            selectedCells = [];
        }
    }

    function checkForWord() {
        if (selectedCells.length !== 2) return;
        let startCell = selectedCells[0];
        let endCell = selectedCells[1];
      
        let startRow = parseInt(startCell.dataset.row);
        let startCol = parseInt(startCell.dataset.col);
        let endRow = parseInt(endCell.dataset.row);
        let endCol = parseInt(endCell.dataset.col);
      
        for (let word of words) {
            if (!foundWords.has(word) &&
                grid[startRow][startCol] === word[0] &&
                grid[endRow][endCol] === word[word.length - 1]) {
      
                highlightWord(word, startRow, startCol, endRow, endCol);
                return;
            }
        }
      
        // ❌ Invalid word: remove highlight after short delay
        selectedCells.forEach(cell => cell.classList.add("wrong"));
        setTimeout(() => {
            selectedCells.forEach(cell => cell.classList.remove("selected", "wrong"));
        }, 100);
    }
    
    function highlightWord(word, startRow, startCol, endRow, endCol) {
        let direction = getWordDirection(startRow, startCol, endRow, endCol, word.length);
        if (!direction) return;
      
        let [dr, dc] = direction;
        let cellsToHighlight = [];
      
        for (let i = 0; i < word.length; i++) {
            let cell = document.querySelector(
                `[data-row="${startRow + i * dr}"][data-col="${startCol + i * dc}"]`
            );
            if (!cell || cell.innerText !== word[i]) return;
            cellsToHighlight.push(cell);
        }
      
        cellsToHighlight.forEach(cell => {
            cell.classList.add("highlight", "found");
            cell.classList.remove("selected");
        });
      
        foundWords.add(word);
        document.getElementById(`word-${word}`).style.textDecoration = "line-through";
      
        // ✅ Check if all words are found
        if (foundWords.size === words.length) {
            endGame();
        }
    }    
    
    function highlightWord(word, startRow, startCol, endRow, endCol) {
        let direction = getWordDirection(startRow, startCol, endRow, endCol, word.length);
        if (!direction) return;
    
        let [dr, dc] = direction;
        let cellsToHighlight = [];
    
        for (let i = 0; i < word.length; i++) {
            let cell = document.querySelector(
                `[data-row="${startRow + i * dr}"][data-col="${startCol + i * dc}"]`
            );
            if (!cell || cell.innerText !== word[i]) return;
            cellsToHighlight.push(cell);
        }
    
        cellsToHighlight.forEach(cell => {
            cell.classList.add("highlight", "found");
            cell.classList.remove("selected");
        });
    
        foundWords.add(word);
        document.getElementById(`word-${word}`).style.textDecoration = "line-through";
    
        // ✅ Check if all words are found
        if (foundWords.size === words.length) {
            endGame();
        }
    }
    
    function highlightWord(word, startRow, startCol, endRow, endCol) {
        let direction = getWordDirection(startRow, startCol, endRow, endCol, word.length);
        if (!direction) return;

        let [dr, dc] = direction;
        let cellsToHighlight = [];
        for (let i = 0; i < word.length; i++) {
            let cell = document.querySelector(`[data-row="${startRow + i * dr}"][data-col="${startCol + i * dc}"]`);
            if (!cell || cell.innerText !== word[i]) return;
            cellsToHighlight.push(cell);
        }

        cellsToHighlight.forEach(cell => cell.classList.add("highlight"));
        foundWords.add(word);
        document.getElementById(`word-${word}`).style.textDecoration = "line-through";
        if (foundWords.size === words.length) {
            endGame();
        }
    }

    function getWordDirection(startRow, startCol, endRow, endCol, length) {
        let possibleDirections = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (let [dr, dc] of possibleDirections) {
            let newRow = startRow + dr * (length - 1);
            let newCol = startCol + dc * (length - 1);
            if (newRow === endRow && newCol === endCol) {
                return [dr, dc];
            }
        }
        return null;
    }

    function highlightMissingWords() {
        words.forEach(word => {
            if (!foundWords.has(word)) {
                document.getElementById(`word-${word}`).style.color = "red";
            }
        });
    }

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", startGame);
    quitBtn.addEventListener("click", quitGame);
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
      game_id: 12,
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
  