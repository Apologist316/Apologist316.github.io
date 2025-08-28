async function loadVideos() {
  try {
    const res = await fetch("/.netlify/functions/get-videos");
    const videos = await res.json();

    const gallery = document.getElementById("video-gallery");
    gallery.innerHTML = videos.map(video => `
      <div class="video-card">
        <a href="https://youtube.com/watch?v=${video.videoId}" target="_blank">
          <img src="${video.thumbnail}" alt="${video.title}">
        </a>
        <div class="video-info">
          <span class="category">${video.category}</span>
          <h3 class="title">${video.title}</h3>
        </div>
      </div>
    `).join("");
  } catch (err) {
    document.getElementById("video-gallery").innerHTML =
      `<p style="color:red;">Failed to load videos. ${err.message}</p>`;
  }
}

loadVideos();
