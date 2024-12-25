    
        // Get URL parameters for the video source and name
        const urlParams = new URLSearchParams(window.location.search);
        const videoUrl = urlParams.get('stream_url');
        const videoName = urlParams.get('name');

        // Set the video source and load it
        const videoSource = document.getElementById('videoSource');
        videoSource.src = videoUrl || '-';
        document.getElementById('video').load();

        // Set the name in the title
        const titleElement = document.getElementById('title');
        titleElement.innerHTML = `<i class="fas fa-star"></i> ${videoName || 'Unknown'}`;

        // Fetch stream data
        async function fetchStreamData() {
            try {
                const response = await fetch('https://api.crstlnz.my.id/api/now_live?group=jkt48');
                const data = await response.json();

                const container = document.getElementById('streams');
                if (data.length === 0) {
                    container.innerHTML = `<p style="text-align: center;">Tidak ada live saat ini.</p>`;
                } else {
                    container.innerHTML = data.map(stream => {
                        const streamingUrl = stream.streaming_url_list.length > 0 
                            ? stream.streaming_url_list[0].url 
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
                                  <button onclick="openModal('${streamingUrl}', '${stream.name}')">
                                             <i class="fas fa-play"></i> Open
                                    </button>
                               
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            } catch (error) {
                console.error('Error fetching stream data:', error);
            }
        }

        function openModal(streamUrl, name) {
            window.location.href = `live?stream_url=${encodeURIComponent(streamUrl)}&name=${encodeURIComponent(name)}`;
        }

        // Load stream data on page load
        fetchStreamData();
    
