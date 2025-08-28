export async function handler(event, context) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UCv6JmCS_68JdSDsrgjUeCqw"; // Replace with your channel ID
  const MAX_RESULTS = 6;

  try {
    // 1. Fetch latest video IDs
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    const videoIds = searchData.items
      .filter(item => item.id.videoId) // only actual videos
      .map(item => item.id.videoId)
      .join(",");

    // 2. Fetch video details (to get duration)
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,contentDetails`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    const videos = detailsData.items.map(item => {
      const duration = item.contentDetails.duration; // ISO 8601 format
      const seconds = isoDurationToSeconds(duration);

      return {
        videoId: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        category: seconds < 60 ? "Short" : "Video"
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(videos)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

// Helper: Convert ISO 8601 duration (PT1M30S) → seconds
function isoDurationToSeconds(isoDuration) {
  const regex = /PT(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);
  const minutes = parseInt(matches[1] || 0);
  const seconds = parseInt(matches[2] || 0);
  return minutes * 60 + seconds;
}
