// script.js (FIXED)

async function loadVideos() {
  const gallery = document.getElementById("video-gallery");

  try {
    const res = await fetch("/.netlify/functions/get-videos");

    // Check if the server responded with an error (e.g., 500 status)
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Server responded with an error");
    }

    const videos = await res.json();

    // Ensure the data is an array before trying to map it
    if (!Array.isArray(videos)) {
      throw new Error("Invalid data format received from server.");
    }

    // If there are no videos, show a message instead of a blank page
    if (videos.length === 0) {
      gallery.innerHTML = "<p>No recent videos found.</p>";
      return;
    }

    // If everything is okay, render the videos
    gallery.innerHTML = videos.map(video => `
      <div class="video-card">
        <a href="https://youtube.com/watch?v=${video.videoId}" target="_blank" rel="noopener noreferrer">
          <img src="${video.thumbnail}" alt="${video.title}">
        </a>
        <div class="video-info">
          <span class="category">${video.category}</span>
          <h3 class="title">${video.title}</h3>
        </div>
      </div>
    `).join("");

  } catch (err) {
    // This will now catch network errors and server errors gracefully
    gallery.innerHTML =
      `<p style="color:red; font-weight: bold;">Failed to load videos. Please try again later.</p>`;
    console.error(err);
  }
}

loadVideos();