function returnToHome() {
  document.getElementById("main").innerHTML = '<div class="card-container" id="card-container"></div>';
  fetch("https://api.npoint.io/60cbd4313ed9c75c4209")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("card-container");

      // Generate Cards
      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.title}">
          <div class="card-content">
            <h3 class="card-title">${item.title}</h3>
            <p class="card-author">${item.author}</p>
            <p class="card-description">${item.description}</p>
          </div>
        `;

        // Open full-screen iframe and log course ID on click
        card.addEventListener("click", () => {
          console.log(`Course ID: ${item.id}`);
          
          // Remove card container
          container.innerHTML = '';

          // Create and append iframe
          const iframe = document.createElement('iframe');
          iframe.src = `./eLearning/index.html?id=${item.id}`;
          iframe.style.position = 'absolute';
          iframe.style.top = '0';
          iframe.style.left = '0';
          iframe.style.width = '100%';
          iframe.style.height = '92vh';
          iframe.style.marginTop = "50px";
          iframe.style.border = 'none';
          iframe.style.zIndex = '0';
          
          // Append the iframe to the main content area
          const mainContent = document.querySelector("#main");
          mainContent.appendChild(iframe);
        });

        container.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

returnToHome();
