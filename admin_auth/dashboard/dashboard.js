document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 🔗 API Requests
    const [usersRes, gamesRes, topScoreRes, mostPlayedGameRes, avgScorePerGameRes, gameDistRes] = await Promise.all([
      fetch('http://127.0.0.1:8080/api/admin/total-users'),
      fetch('http://127.0.0.1:8080/api/admin/total-games'),
      fetch('http://127.0.0.1:8080/api/admin/top-score'),
      fetch('http://127.0.0.1:8080/api/admin/most-played-game'),
      fetch('http://127.0.0.1:8080/api/admin/average-score-per-game'),
      fetch('http://127.0.0.1:8080/api/admin/game-distribution'),
    ]);

    // 📦 JSON Parsing
    const [totalUsers, totalGames, topScore, mostPlayedGame, avgScorePerGame, gameDistribution] = await Promise.all([
      usersRes.json(),
      gamesRes.json(),
      topScoreRes.json(),
      mostPlayedGameRes.json(),
      avgScorePerGameRes.json(),
      gameDistRes.json(),
    ]);

    // 📋 Summary Cards
    document.getElementById("userCount").textContent = totalUsers.count ?? "--";
    document.getElementById("gamesPlayed").textContent = totalGames.count ?? "--";
    document.getElementById("topScore").textContent = topScore.topScore ?? "--";
    document.getElementById("mostPlayedGame").textContent = mostPlayedGame?.[0]?.game_name ?? "--";


    // 📊 Chart: Game Distribution
    new Chart(document.getElementById("gameDistributionChart"), {
      type: "bar",
      data: {
        labels: gameDistribution?.map(item => item.game_name),
        datasets: [{
          label: "Games Played",
          data: gameDistribution?.map(item => item.times_played),
          backgroundColor: "#4caf50",
          borderColor: "#2c3e50",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // 📈 Chart: Average Score Per Game
    new Chart(document.getElementById("avgScorePerGameChart"), {
      type: "line",
      data: {
        labels: avgScorePerGame?.map(item => item.game_name),
        datasets: [{
          label: "Average Score",
          data: avgScorePerGame?.map(item => item.avg_score),
          borderColor: "#8e44ad",
          backgroundColor: "rgba(142, 68, 173, 0.2)",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  } catch (error) {
    console.error("🚨 Error loading admin dashboard data:", error);
  }
});
