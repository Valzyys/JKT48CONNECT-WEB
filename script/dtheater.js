    
        async function fetchTheaterData(theaterId) {
            try {
                const response = await fetch(`https://api.crstlnz.my.id/api/theater/${theaterId}`);
                const data = await response.json();

                const show = data.shows[0];

                // Update Header
                document.getElementById('header').innerText = show.title;

                // Update Images for Mobile and Desktop
                document.getElementById('mobile-banner').src = show.setlist.banner;
                document.getElementById('desktop-poster').src = show.setlist.poster;

                // Update Title and Description
                document.getElementById('title').innerHTML = `
                    ${show.title}
                    <img src="https://jkt48.com${show.team.img}" alt="Badge">
                `;
                document.getElementById('description').innerText = show.setlist.description;

                // Update Info
                const info = document.getElementById('info');
                info.innerHTML = `
                    <p><i class="fas fa-calendar-alt"></i> Tanggal: ${new Date(show.date).toLocaleDateString('id-ID')}</p>
                    <p><i class="fas fa-clock"></i> Waktu: ${new Date(show.date).toLocaleTimeString('id-ID')}</p>
                `;

                // Update Buttons
                const offlineBtn = document.getElementById('offlineTicketBtn');
                const onlineBtn = document.getElementById('onlineTicketBtn');

                if (show.url) {
                    offlineBtn.onclick = () => window.location.href = show.url;
                } else {
                    offlineBtn.style.display = 'none';
                }

                if (show.showroomTheater?.entrance_url) {
                    onlineBtn.onclick = () => window.location.href = show.showroomTheater.entrance_url;
                } else {
                    onlineBtn.style.display = 'none';
                }

                // Update Members
                const members = document.getElementById('members');
                show.members.forEach(member => {
                    members.innerHTML += `
                        <div class="member">
                            <img src="${member.img || 'default.jpg'}" alt="${member.name}">
                            <span>${member.name || 'Unknown'}</span>
                        </div>
                    `;
                });

            } catch (error) {
                console.error('Error fetching theater data:', error);
            }
        }

function getTheaterIdFromURL() {
          const urlParams = new URLSearchParams(window.location.search);
          return urlParams.get('id');
        }
        
        window.onload = () => {
          const theaterId = getTheaterIdFromURL();
          if (theaterId) {
            fetchTheaterData(theaterId);
          } else {
            document.getElementById('description').innerHTML = '<p>Please provide a theater ID in the URL.</p>';
          }
        };
    
