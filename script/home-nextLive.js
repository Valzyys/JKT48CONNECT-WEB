async function fetchNextLive() {
    try {
        const response = await fetch('https://sorum-valz-store.vercel.app/api/rooms/theater-schedule');
        const data = await response.json();
        const container = document.getElementById('nextlive');

        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-zone" style="text-align: center;">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <img src="https://res.cloudinary.com/doig4w6cm/image/fetch/f_auto,q_80,w_640,c_fill/https://res.cloudinary.com/haymzm4wp/image/upload/assets/svg/web/space_copy.svg" alt="No live" style="width: 300px; margin-bottom: 15px;">
                        <p style="font-size: 18px;">Tidak ada live saat ini 😢</p>
                    </div>
                </div>
            `;
        } else {
            // Generate HTML for live streams
            container.innerHTML = data.map((stream, index) => {
                const timeStamp = new Date(stream.start_at * 1000);
                const timeString = timeStamp.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" });

                const premiumLabel = stream.premium_live_type === 3 
                    ? '<div class="golden-badge" style="color: gold; font-weight: bold; font-size: 16px;">Premium Live</div>'
                    : '';

                return `
                    <div class="fuzzy-item">
                        <img src="https://res.cloudinary.com/haymzm4wp/image/upload/s--rRdgtH_E--/c_fill,w_150/v1697402288/assets/img/jkt48poster1_pemrgm.jpg" alt="${stream.room_name}" style="border-radius: 50%;">
                        <div class="squiggle-info">
                            <h3>${stream.room_name}</h3>
                            <p><strong></strong> ${timeString}</p>
                         </div>
                    </div>
                    <div class="twiddle-divider"></div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error fetching stream data:', error);
        const container = document.getElementById('streams');
        container.innerHTML = `
            <div class="error-zone" style="text-align: center; color: red;">
                <p>Gagal memuat data live. Silakan coba lagi nanti.</p>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", fetchNextLive);
