
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
       <div> 
        <div calss="game-detail-list">
        <div>
        <h2>${gameDetails.name}</h2>
        <p><strong>Price:</strong> $${gameDetails.price}</p>
        </div>
        <div class="img-detail">
        <img src="${gameDetails.header_image}" alt="${gameDetails.name}" />
        <div >
        <p><strong>Release Date:</strong> ${gameDetails.release_date}</p>
        <p><strong>Developer:</strong> ${gameDetails.developer}</p>
        <p><strong>Genres:</strong> ${gameDetails.genres}</p>
        <p><strong>Description</strong> ${gameDetails.description}</p>
        </div>
        </div>
        <button onclick="showGameList()">Back to Game List</button>
        </div>
        <div>
    `;
  }

  const url_string = window.location.href; 
  const url = new URL(url_string);
  const appid = url.searchParams.get("id");
  showGameDetails(appid);
  console.log(appid);