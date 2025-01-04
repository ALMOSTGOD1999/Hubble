const apiUrl = "https://api.npoint.io/60cbd4313ed9c75c4209";
let data = []; // Initialize data array
const container = document.getElementById("data-container");
const form = document.getElementById("entry-form");

// Fetch data from the API
async function fetchData() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    data = await response.json();
    renderData();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Render data to the DOM
function renderData() {
  container.innerHTML = ""; // Clear existing data
  data.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <img src="${entry.imageUrl}" alt="Avatar">
      <div class="details">
        <h3>${entry.title}</h3>
        <p>${entry.description}</p>
        <p><strong>Author:</strong> ${entry.author}</p>
        <p><strong>Date:</strong> ${entry.date}</p>
        <p class="tags"><strong>Tags:</strong> ${entry.tags.join(", ")}</p>
      </div>
      <button onclick="deleteEntry(${entry.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

// Add a new entry
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form from refreshing the page

  const newEntry = {
    id: data.length + 1,
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    description: document.getElementById("description").value,
    date: document.getElementById("date").value,
    tags: document.getElementById("tags").value.split(",").map((tag) => tag.trim()),
    imageUrl: document.getElementById("imageUrl").value,
  };

  data.push(newEntry);
  await updateData();
  form.reset(); // Clear the form fields
});

// Delete an entry
async function deleteEntry(id) {
  const index = data.findIndex((entry) => entry.id === id);
  if (index !== -1) {
    data.splice(index, 1);
    await updateData();
  }
}

// Update data on the server
async function updateData() {
  try {
    const response = await fetch(apiUrl, {
      method: "PUT", // Use PUT to overwrite the data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update data: ${response.status}`);
    }

    renderData();
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

// Initialize
fetchData();
