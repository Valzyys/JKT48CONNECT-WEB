// Function to extract the ID from the URL
function extractIdFromUrl() {
  const url = window.location.href; // Get current page URL
  const match = url.match(/detail\/(\d+)/); // Match the pattern "detail/XXXXXXXX"
  return match ? match[1] : null; // Return the matched ID or null if not found
}

async function fetchEventDetails() {
  const id = extractIdFromUrl(); // Extract ID from URL
  if (!id) {
    console.error("Invalid URL or ID not found");
    return;
  }
  const apiUrl = `https://api.jkt48connect.my.id/api/recent/${id}?api_key=JKTCONNECT`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data) {
      // Parsing created_at
      const createdAt = new Date(data.created_at);
      const optionsDateTime = {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const eventDate = new Intl.DateTimeFormat('id-ID', optionsDateTime).format(createdAt);

      // Parsing duration
      const durationMillis = data.live_info.duration;
      const durationSeconds = Math.floor(durationMillis / 1000);
      const hours = Math.floor(durationSeconds / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      const eventDuration = `${hours} Jam ${minutes} Menit`;

      // Updating HTML
      document.getElementById('event-date').textContent = eventDate;
      document.getElementById('event-time').textContent = "Waktu Indonesia Barat (WIB)";
      document.getElementById('event-duration').textContent = eventDuration;
    } else {
      console.error("Invalid API response or missing data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchProfileData() {
  const id = extractIdFromUrl(); // Extract ID from URL
  if (!id) {
    console.error("Invalid URL or ID not found");
    return;
  }
  const apiUrl = `https://api.jkt48connect.my.id/api/recent/${id}?api_key=JKTCONNECT`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.room_info && data.idn) {
      const nameElement = document.querySelector('.name');
      const profileImgElement = document.querySelector('.profile img');
      const contentImgElement = document.querySelector('.content img');

      nameElement.innerHTML = `
        ${data.room_info.nickname}
        <span class="badge">
          Sousenkyo 2024
        </span>
      `;

      profileImgElement.src = data.room_info.img_alt;
      profileImgElement.alt = `Profile image of ${data.room_info.nickname}`;

      contentImgElement.src = data.idn.image;
      contentImgElement.alt = `Content image for ${data.room_info.nickname}`;
    } else {
      console.error("Invalid API response or missing data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchGiftData() {
  const id = extractIdFromUrl(); // Extract ID from URL
  if (!id) {
    console.error("Invalid URL or ID not found");
    return;
  }
  const apiUrl = `https://api.jkt48connect.my.id/api/recent/${id}?api_key=JKTCONNECT`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data) {
      const totalGifts = data.total_gifts || 0;
      const giftRate = data.gift_rate || 0;
      const giftValue = totalGifts * giftRate;
      const formattedValue = giftValue.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
      });
      document.getElementById('gift-detail').textContent = `${totalGifts}G (± ${formattedValue})`;

      const viewers = data.live_info.viewers ? data.live_info.viewers.num : 0;
      const activeViewers = data.live_info.viewers ? data.live_info.viewers.active : 0;
      document.getElementById('viewers-detail').textContent = viewers;
      document.getElementById('active-viewers-detail').textContent = activeViewers;

      const comments = data.live_info.comments ? data.live_info.comments.num : 0;
      const uniqueUsers = data.live_info.comments ? data.live_info.comments.users : 0;
      document.getElementById('comments-detail').textContent = `${comments} by ${uniqueUsers} users`;

      document.getElementById('total-gifts').textContent = `${totalGifts} pts`;

      const progressPercentage = giftRate > 0 ? Math.min(giftRate * 100, 100) : 0;
      document.getElementById('gift-progress').style.width = `${progressPercentage}%`;

      document.querySelector('.paid').textContent = `Paid gifts (100%)`; 
      document.querySelector('.free').textContent = `Free gifts (0%)`;
    } else {
      console.error("No data found or empty response.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call all functions
fetchEventDetails();
fetchProfileData();
fetchGiftData();
