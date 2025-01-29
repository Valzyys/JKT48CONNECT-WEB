// Ambil parameter "name" dari URL
const urlParams = new URLSearchParams(window.location.search);
const videoName = urlParams.get('name');

// Referensi elemen HTML
const videoElement = document.getElementById('video');
const videoSource = document.getElementById('videoSource');
const titleElement = document.getElementById('title');
const container = document.getElementById('streams');

// Set judul default
titleElement.innerHTML = `<i class="fas fa-star"></i> ${videoName || 'Unknown'}`;

// Fungsi untuk mengambil data stream dari API
async function fetchStreamData() {
    try {
        const response = await fetch('https://api.crstlnz.my.id/api/now_live?group=jkt48');
        const data = await response.json();

        if (!data || data.length === 0) {
            container.innerHTML = `<p style="text-align: center;">Tidak ada live saat ini.</p>`;
            return;
        }

        // Cari data stream berdasarkan "name"
        const streamData = data.find(stream => stream.name === videoName);
        if (!streamData) {
            container.innerHTML = `<p style="text-align: center;">Nama tidak ditemukan dalam live stream saat ini.</p>`;
            return;
        }

        // Ambil URL streaming berkualitas terbaik
        const streamingUrl = streamData.streaming_url_list.length > 0 
            ? streamData.streaming_url_list.sort((a, b) => (b.quality || 0) - (a.quality || 0))[0].url
            : null;

        if (!streamingUrl) {
            container.innerHTML = `<p style="text-align: center;">Tidak ada URL streaming tersedia untuk ${videoName}.</p>`;
            return;
        }

        // Set sumber video dan mulai pemutaran
        videoSource.src = streamingUrl;
        videoElement.load();
    } catch (error) {
        console.error('Error fetching stream data:', error);
        container.innerHTML = `<p style="text-align: center;">Gagal memuat data stream.</p>`;
    }
}

// Fungsi untuk menampilkan daftar live stream
async function loadLiveStreams() {
    try {
        const response = await fetch('https://api.crstlnz.my.id/api/now_live?group=jkt48');
        const data = await response.json();

        if (!data || data.length === 0) {
            container.innerHTML = `<p style="text-align: center;">Tidak ada live saat ini.</p>`;
            return;
        }

        container.innerHTML = data.map(stream => {
            const streamingUrl = stream.streaming_url_list.length > 0 
                ? stream.streaming_url_list.sort((a, b) => (b.quality || 0) - (a.quality || 0))[0].url
                : `https://www.showroom-live.com/${stream.url_key}`;

            return `
                <div class="live-item">
                    <img src="${stream.img}" alt="${stream.name}">
                    <div class="info">
                        <p>Name: ${stream.name}</p>
                        <p>Live: ${stream.type}</p>
                    </div>
                    <div class="buttons">
                        <button onclick="window.open('${streamingUrl}', '_blank')">
                              <i class="fas fa-expand"></i> Fullscreen
                        </button>
                        <button onclick="openModal('${stream.name}')">
                             <i class="fas fa-play"></i> Open
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error fetching stream data:', error);
        container.innerHTML = `<p style="text-align: center;">Gagal memuat data stream.</p>`;
    }
}

// Fungsi untuk membuka modal dengan hanya menggunakan "name"
function openModal(name) {
    window.location.href = `live?name=${encodeURIComponent(name)}`;
}

// Jalankan saat halaman dimuat
fetchStreamData();
loadLiveStreams();
