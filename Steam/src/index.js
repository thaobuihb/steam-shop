const apiUrl = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/games";
const url = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres";
let feat = [];
let types = [];
let currentView = "gameList";

const getGames = async (callback) => {
  try {
    const response = await fetch(apiUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }
    const gamesData = await response.json();
    callback(null, gamesData.data);
  } catch (err) {
    callback(err, null);
  }
};

const renderGames = (error, gamesData) => {
  let gameList = document.getElementById("showing");
  if (error) {
    return console.log(error);
  }
  if (currentView !== "gameList") {
    gameList.style.display = "none"; 
  } else {
    gameList.style.display = "flex"; 
  }
  gameList.innerHTML = "";
  gamesData.forEach((game) => {
    let output = document.createElement("div");
    output.innerHTML += `
        <div class="card" onclick="showGameDetails('${game.appid}')">
          <img src="${game.header_image}" alt="${game.name}" />
          <p>${game.name}</p>
          <p><strong>Price:</strong> $${game.price}</p>
        </div>
      `;
    gameList.appendChild(output);
  });
};

function renderCate() {
  fetch(url)
    .then((response) => response.json())
    .then((res) => {
      const cate = res.data;
      let list = "";
      cate.forEach((data) => {
        list += `<li><button id="btn-cate" onclick="getGamesByGenre('${data.name}')" searchGameWithCate="${data.name}" type="${data.name}">${data.name}</button></li>`;
      });
      document.getElementById("categories").innerHTML = list;
    })
    .catch((error) => console.log(error));
}

function getListFeature() {
  fetch("https://steam-api-dot-cs-platform-306304.et.r.appspot.com/features")
    .then((response) => response.json())
    .then((res) => {
      feat = res.data;
    })
    .catch((error) => console.log(error));
}

function searchGameWithName() {
  let valueSearchInput = document.getElementById("input-box").value.trim();
  let userSearch = feat.filter((data) => {
    return data.name.toUpperCase().includes(valueSearchInput.toUpperCase());
  });
  let gameList = "";
  userSearch.forEach((data) => {
    gameList += ` 
        <div class="card" onclick="showGameDetails('${data.appid}')">
          <p>${data.name}</p>
          <p>${data.genres}</p>
          <div id="container">
            <img src="${data.header_image}" alt="${data.name}" />
            <div class="info">
              <p>Release date:${data.release_date}</p>
              <p>Developer:${data.developer}</p>
              <p>Positive rating:${data.positive_ratings}</p>
            </div>
          </div>
        </div>
    `;
  });
  document.getElementById("showing").innerHTML = gameList;
  showGameList(); // Đảm bảo giao diện chuyển về hiển thị danh sách game
}
// // CÁCH 1
// function showGameDetails (appid) {
//   window.location.href=`${window.location.origin}/detail.html?id=${appid}`;
// }

// CÁCH 2
async function showGameDetails(appid) {
  try {
    const response = await fetch(`https://steam-api-dot-cs-platform-306304.et.r.appspot.com/single-game/${appid}`);
    
    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }
    const gameDetails = await response.json();
    console.log("@@@@@", gameDetails);
    renderGameDetails(gameDetails.data);
    document.getElementById("showing").style.display = "none"; 
    document.getElementById("game-details").style.display = "flex"; // Hiển thị phần tử game-details
    currentView = "gameDetails"; // Cập nhật giá trị của currentView
  } catch (err) {
    console.log(err);
  }
}

function renderGameDetails(gameDetails) {
  const gameDetailsElement = document.getElementById("game-details");
  gameDetailsElement.innerHTML = `
      <div calss="game-detail-list">
      <div>
      <h2>${gameDetails.name}</h2>
      <p><strong>Price:</strong> $${gameDetails.price}</p>
      </div>
      <div class="img-detail">
      <img src="${gameDetails.header_image}" alt="${gameDetails.name}" />
      <div class="description-game">
      <p><strong>Release Date:</strong> ${gameDetails.release_date}</p>
      <p><strong>Developer:</strong> ${gameDetails.developer}</p>
      <p><strong>Genres:</strong> ${gameDetails.genres}</p>
      <p><strong>Description</strong> ${gameDetails.description}</p>
      <button onclick="showGameList()">Back to Game List</button>
      </div>
      </div>
      </div>
  `;
}

const getGamesByGenre = async (genre) => {
  try {
    const response = await fetch(`https://steam-api-dot-cs-platform-306304.et.r.appspot.com/games?genres=${genre}`);
    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }
    const gamesData = await response.json();
    renderGames(null, gamesData.data);
    showGameList(); 
  } catch (err) {
    console.log(err);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getGames(renderGames);
  getListFeature();
  renderCate();
});

function showGameList() {
  document.getElementById("showing").style.display = "flex"; // Hiển thị phần tử showing
  document.getElementById("game-details").style.display = "none"; // Ẩn phần tử game-details
  currentView = "gameList"; // Cập nhật giá trị của currentView
}




