async function fetchRecentLives() {
  const apiUrl = "https://api.jkt48connect.my.id/api/recent?api_key=JKTCONNECT";
  const kks = document.getElementById('recent-lives');

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.recents && Array.isArray(data.recents)) {
      // Ambil hanya 4 data terbaru
      const recentLives = data.recents.slice(0, 4);

      recentLives.forEach((live) => {
        const member = live.member;
        const createdAt = new Date(live.created_at); // Waktu live selesai
        const now = new Date(); // Waktu sekarang

        // Hitung selisih waktu (dalam milidetik)
        const elapsed = now - createdAt;

        // Konversi milidetik ke hari, jam, dan menit
        const days = Math.floor(elapsed / (1000 * 60 * 60 * 24)); // Total hari
        const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Sisa jam
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60)); // Sisa menit

        // Format durasi
        let durationText = "";
        if (days > 0) {
          durationText = days === 1 ? `${days} day ago` : `${days} days ago`;
        } else if (hours > 0 || minutes > 0) {
          durationText = hours > 0 ?
            `${hours}h ${minutes}m ago` :
            `${minutes}m ago`;
        }

        // Calculate estimated gifts
        const giftAmount = Math.round(live.gift_rate * live.points).toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
        });

        // Create cccard HTML
        const cccard = document.createElement('div');
        cccard.className = 'cccard';

        cccard.innerHTML = `
          <img src="${member.img_alt}" alt="Profile picture of ${member.nickname}" />
          <div class="cccard-content">
            <h2>${member.nickname}</h2>
            <p class="icon-text">
              <i class="fas fa-users"></i> ${live.live_info.viewers.num.toLocaleString()}
            </p>
            <p class="icon-text">
              <i class="fas fa-gift"></i> ± ${giftAmount}
            </p>
            <p class="icon-text">
              <i class="fas fa-clock"></i> ${durationText}
            </p>
          </div>
          <a class="detil" href="https://showroom-live.com/${member.url}" target="_blank">detil</a>
        `;

        kks.appendChild(cccard);
      });
    } else {
      kks.innerHTML = "<p>No recent lives found.</p>";
    }
  } catch (error) {
    kks.innerHTML = `<p>Error loading data: ${error.message}</p>`;
  }
}

fetchRecentLives();
