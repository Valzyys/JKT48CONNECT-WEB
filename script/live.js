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

                // Format waktu mulai
                const startDate = new Date(streamData.started_at);
                const formattedTime = startDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' });

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
                    "mute", "volume", "pip", "settings", "fullscreen",
                    "captions" // Menambahkan kontrol captions
                ],
                settings: ["quality", "speed"],
                captions: { active: true, language: "id" } // Mengaktifkan captions Bahasa Indonesia secara default
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
