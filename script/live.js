const urlParams = new URLSearchParams(window.location.search);
        const videoUrl = urlParams.get('stream_url');
        const videoName = urlParams.get('name');

        // Set judul sementara
        document.getElementById("breadcrumb-name").textContent = videoName || "Unknown";
        document.getElementById("stream-title").textContent = videoName || "Unknown";

        async function fetchStreamData() {
    try {
        const response = await fetch('https://api.crstlnz.my.id/api/now_live?group=jkt48');
        const data = await response.json();

        if (!data || data.length === 0) {
            document.getElementById("stream-title").textContent = "Tidak ada live saat ini";
            return;
        }

        const streamData = data.find(stream => stream.name === videoName);
        if (!streamData) {
            document.getElementById("stream-title").textContent = "Nama tidak ditemukan dalam live stream saat ini.";
            return;
        }

        // Format waktu mulai ke WIB (Waktu Indonesia Barat)
        const startDate = new Date(streamData.started_at);
        const formattedTime = startDate.toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            hour: '2-digit',
            minute: '2-digit'
        }) + " WIB"; // Tambahkan "WIB"

        // Set data ke HTML
        document.getElementById("stream-title").textContent = streamData.name;
        document.getElementById("stream-group").textContent = streamData.type;
        document.getElementById("start-time").textContent = formattedTime;
        document.getElementById("stream-quality").textContent = streamData.streaming_url_list.length > 0 ? "Original Quality" : "N/A";

        // Ambil URL streaming kualitas terbaik
        const bestStream = streamData.streaming_url_list.sort((a, b) => (b.quality || 0) - (a.quality || 0))[0];
        if (bestStream) {
            document.getElementById("videoSource").src = bestStream.url;
            document.getElementById("player").load();
            document.getElementById("video-container").classList.remove("hidden");
        }

        // Mulai update viewers setiap detik
        startRandomViewers();
    } catch (error) {
        console.error("Error fetching stream data:", error);
    }
}

        // Fungsi untuk menghasilkan angka random dalam rentang tertentu
        function getRandomViewers(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Fungsi untuk memperbarui jumlah viewers setiap detik
        function startRandomViewers() {
            let viewers = getRandomViewers(500, 5000);
            document.getElementById("viewer-count").textContent = `${viewers} viewers`;

            setInterval(() => {
                viewers += getRandomViewers(-50, 50);
                viewers = Math.max(500, viewers); // Minimal 500 viewers
                document.getElementById("viewer-count").textContent = `${viewers} viewers`;
            }, 1000);
        }

              // Inisialisasi Plyr.js
        document.addEventListener("DOMContentLoaded", () => {
            const player = new Plyr("#player", {
                controls: [
                    "play-large", "play", "progress", "current-time",
                    "mute", "volume", "pip", "settings", "fullscreen" // Menambahkan kontrol captions
                ],
                settings: ["quality", "speed"] // Mengaktifkan captions Bahasa Indonesia secara default
            });

            // Pastikan durasi video berjalan maju
            player.on("timeupdate", event => {
                if (player.currentTime < 0) {
                    player.currentTime = 0; // Reset waktu ke 0 jika negatif
                }
            });

            // Sembunyikan kontrol saat klik video
            const videoContainer = document.getElementById("video-container");
            videoContainer.addEventListener("click", () => {
                videoContainer.classList.toggle("hide-controls");
            });

            fetchStreamData();
        });

async function fetchLiveStreams() {
  try {
    const response = await fetch('https://api.crstlnz.my.id/api/now_live?group=jkt48');
    const streams = await response.json();
    
    const container = document.getElementById("streams-container");
    container.innerHTML = ""; // Hapus konten lama jika ada
    
    if (!streams || streams.length === 0) {
      container.innerHTML = "<p class='text-center text-gray-500'>Tidak ada live saat ini</p>";
      return;
    }
    
    streams.forEach(stream => {
      const isShowroom = stream.type === "showroom";
      const bgColor = isShowroom ? "bg-pink-100" : "bg-yellow-100";
      const tagColor = isShowroom ? "bg-pink-500" : "bg-black";
      const streamPlatform = isShowroom ? "SHOWROOM" : "IDN Live";
      const streamURL = `https://www.jkt48connect.my.id/live?name=${encodeURIComponent(stream.name)}`;
      
      // Konversi waktu ke WIB
      const startDate = new Date(stream.started_at);
      const formattedTime = startDate.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + " WIB";
      
      // Template Card
      const cardHTML = `
                        <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
                            <div class="relative">
                                <img src="${stream.img}" alt="Live stream thumbnail" class="w-full h-48 object-cover" />
                                <div class="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">LIVE</div>
                                <div class="absolute top-2 right-2 ${tagColor} text-white text-xs font-semibold px-2 py-1 rounded-full">${streamPlatform}</div>
                            </div>
                            <div class="p-4 ${bgColor}">
                                <div class="flex items-center space-x-2">
                                    <img src="${stream.img_alt}" alt="Profile picture" class="w-10 h-10 rounded-full" />
                                    <div>
                                        <div class="text-sm font-semibold">${stream.name}</div>
                                        <div class="text-xs text-gray-500">${formattedTime}</div>
                                    </div>
                                </div>
                                <button onclick="window.location.href='${streamURL}'" class="mt-4 w-full ${isShowroom ? 'bg-pink-500' : 'bg-yellow-500'} text-white text-sm font-semibold py-2 rounded-full flex items-center justify-center">
                                    <i class="fas fa-play mr-2"></i> Watch Stream
                                </button>
                            </div>
                        </div>
                    `;
      
      container.innerHTML += cardHTML;
    });
    
  } catch (error) {
    console.error("Error fetching live streams:", error);
  }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchLiveStreams);
