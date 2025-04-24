document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error("User ID not found in localStorage.");
    return;
  }

  loadSummaryCards(userId);
  loadCharts(userId);
  loadProgressTable(userId);
});

function getGameName(gameId) {
  const map = {
    1: "Focus Finder",
    2: "Phonics Champion",
    3: "Word Scramble",
    4: "Memory Master",
    5: "Guess The Number",
    6: "Think & Solve",
    7: "Brain Blink",
    8: "Think & Repeat",
    9: "Quiz Game",
    10: "Pattern Play",
    11: "Sentence Builder",
    12: "Word Hunt"
  };
  return map[gameId] || `Game ${gameId}`;
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🎯 Summary Cards
async function loadSummaryCards(userId) {
  const summary = await fetchData(`http://127.0.0.1:8080/api/progress/summary/${userId}`);
  const scores = await fetchData(`http://127.0.0.1:8080/api/progress/scores/${userId}`);
  const avgTime = await fetchData(`http://127.0.0.1:8080/api/progress/average-time/${userId}`);

  document.getElementById("totalGames").textContent = summary?.games?.length ?? "--";

  const highScore = Math.max(...(scores?.scores ?? [0]));
  document.getElementById("highestScore").textContent = highScore;

  const timeArr = avgTime?.times?.map(parseFloat) ?? [];
  const avg = timeArr.length ? (timeArr.reduce((a, b) => a + b, 0) / timeArr.length).toFixed(2) : "--";
  document.getElementById("avgTime").textContent = `${avg} mins`;

  const totalAttempts = summary?.attempts?.reduce((a, b) => a + b, 0) ?? 0;
  const accuracy = totalAttempts ? ((summary.games.length / totalAttempts) * 100).toFixed(1) : "--";
  document.getElementById("accuracyRate").textContent = `${accuracy}%`;
}

// 📊 Charts
async function loadCharts(userId) {
  const summary = await fetchData(`http://127.0.0.1:8080/api/progress/summary/${userId}`);
  const scores = await fetchData(`http://127.0.0.1:8080/api/progress/scores/${userId}`);
  const history = await fetchData(`http://127.0.0.1:8080/api/progress/history/${userId}`);
  const avgTime = await fetchData(`http://127.0.0.1:8080/api/progress/average-time/${userId}`);

  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: summary?.games?.map(getGameName),
      datasets: [{
        label: "Attempts",
        data: summary?.attempts,
        backgroundColor: ["#4caf50", "#1e88e5", "#ff9800", "#e91e63", "#9c27b0", "#00bcd4"]
      }]
    }
  });

  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: scores?.games,
      datasets: [{
        label: "Scores",
        data: scores?.scores,
        backgroundColor: "#4caf50"
      }]
    }
  });

  new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: history?.map(h => new Date(h.completed_at).toLocaleDateString()),
      datasets: [{
        label: "Score Trend",
        data: history?.map(h => h.score),
        borderColor: "#1e88e5",
        fill: false
      }]
    }
  });


  new Chart(document.getElementById("averageTimeChart"), {
    type: "bar",
    data: {
      labels: avgTime?.games ?? [],
      datasets: [{
        label: "Avg Time (mins)",
        data: avgTime?.times?.map(parseFloat),
        backgroundColor: "#9c27b0"
      }]
    }
  });
}

// 🧾 Game History Table
async function loadProgressTable(userId) {
  const history = await fetchData(`http://127.0.0.1:8080/api/progress/history/${userId}`);
  const tableBody = document.querySelector("#progressTable tbody");
  tableBody.innerHTML = "";

  history?.forEach(game => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${game.game_name || getGameName(game.game_id)}</td>
      <td>${game.score}</td>
      <td>${game.total_attempts}</td>
      <td>${formatTimeObj(game.completion_time)}</td>
      <td>${new Date(game.completed_at).toLocaleString()}</td>
    `;
    tableBody.appendChild(row);
  });
}

// ⏱ Time Formatter
function formatTimeObj(timeObj) {
  if (!timeObj || (typeof timeObj !== "object")) return "--";

  const mins = timeObj.minutes ?? 0;
  const secs = timeObj.seconds ?? 0;
  const formatted = `${mins}:${secs < 10 ? '0' + secs : secs}`;
  return (mins === 0 && secs === 0) ? "--" : formatted;
}
