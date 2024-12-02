      
        const API_KEY = 'AIzaSyACgpG3XScR1d5f_qZ-deCr0FSuViPOYdM'; // Ganti dengan API key Anda
        const channelIds = ['UCaIbbu5Xg3DpHsn_3Zw2m9w', 'UCadv-UfEyjjwOPcZHc2QvIQ'];
        const maxResults = 4;

        async function fetchChannelThumbnail(channelId) {
          const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`);
          const data = await response.json();
          return data.items[0]?.snippet.thumbnails.default.url || '';
        }

        async function fetchVideoViews(videoId) {
          const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
          const data = await response.json();
          return data.items[0]?.statistics.viewCount || '0';
        }

        async function fetchVideos() {
          const videoListElement = document.getElementById('video-list');
          const allVideos = [];

          for (const channelId of channelIds) {
            const channelThumbnail = await fetchChannelThumbnail(channelId);
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=${maxResults}`);
            const data = await response.json();

            for (const item of data.items) {
              const { title, thumbnails, publishedAt, channelTitle } = item.snippet;
              const thumbnail = thumbnails.high;

              // Filter untuk menghilangkan video dengan [MV] dan Shorts
              if (!title.includes('[MV]') && thumbnail.width / thumbnail.height >= 1.33) {
                const viewCount = await fetchVideoViews(item.id.videoId); // Mendapatkan jumlah viewers

                allVideos.push({
                  title,
                  videoId: item.id.videoId,
                  thumbnailUrl: thumbnail.url,
                  channelTitle,
                  publishedAt,
                  channelThumbnail,
                  viewCount
                });
              }
            }
          }

          // Urutkan video berdasarkan tanggal publikasi (terbaru di atas)
          allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

          allVideos.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.classList.add('video');
            videoElement.innerHTML = `
                            <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">
                                <img src="${video.thumbnailUrl}" alt="${video.title}">
                            </a>
                            <div class="details">
                                <h2>${video.title}</h2>
                                <div class="meta-info">
                                    <img src="${video.channelThumbnail}" alt="${video.channelTitle} thumbnail">
                                    <span>${video.channelTitle}</span>
                                    <span>• ${new Date(video.publishedAt).toLocaleDateString()}</span>
                                    <span>• ${Number(video.viewCount).toLocaleString()} views</span>
                                </div>
                            </div>
                        `;
            videoListElement.appendChild(videoElement);
          });
        }

        
      
      
        async function fetchStreamData() {
          try {
            // Fetch data from the new API (JKT48)
            const response = await fetch('https://api.crstlnz.my.id/api/now_live?group=jkt48');
            const data = await response.json();

            const container = document.getElementById('streams');
            const memberCount = document.getElementById('member-count');
            const liveDot = document.querySelector('.live-dot'); // Get the live dot element

            // Handle JKT48 data
            if (data.length === 0) {
              container.innerHTML = `
                <div class="nolive">
                    <img src="https://res.cloudinary.com/doig4w6cm/image/fetch/f_auto,q_80,w_640,c_fill/https://res.cloudinary.com/haymzm4wp/image/upload/assets/svg/web/space_copy.svg" alt="No live" style="width: 150px; margin-bottom: 10px;">
                    <p>Tidak ada live saat ini 😢</p>
                </div>
            `;
              memberCount.textContent = `0 Member`;
              liveDot.style.backgroundColor = 'grey'; // Set dot to grey
              liveDot.classList.remove('blinking'); // Remove blinking animation
            } else {
              memberCount.textContent = `${data.length} Member`;
              liveDot.style.backgroundColor = 'red'; // Set dot to red when live
              liveDot.classList.add('blinking'); // Add blinking animation

              container.innerHTML = data.map(stream => {
                // Determine which image to use based on the type
                const imageUrl = stream.type === 'showroom' ? stream.img_alt : stream.img;

                // Determine label based on type
                const label = stream.type === 'idn' ?
                  `<img src="https://res.cloudinary.com/doig4w6cm/image/fetch/f_auto,q_80/https://upload.wikimedia.org/wikipedia/commons/b/ba/IDN_Live.svg" alt="LIVE" style="width: 80px; height: auto; margin-left: -66px;">` :
                  `<img src="https://files.catbox.moe/kf217f.png" alt="SHOWROOM" style="width: 80px; height: auto; margin-left: -66px; border-radius: 5px;">`;

                // Add Premium Live label if applicable
                const premiumLabel = stream.is_premium ?
                  '<div class="premium-label" style="color: gold; font-weight: bold;">Premium Live</div>' :
                  '';

                return `
                    <div class="wijaya" onclick="openModal('${stream.streaming_url_list[0]?.url || '#'}', '${stream.name}')">
                        <img src="${imageUrl}" alt="${stream.name}">
                        <div class="live-label">${label}</div>
                        <div class="wijaya-content">
                            <h3>${stream.name}</h3>
                            ${premiumLabel} <!-- Add the Premium Live label here -->
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
          // Redirect to the video player page with the stream URL and name as query parameters
          window.location.href = `live?stream_url=${encodeURIComponent(streamUrl)}&name=${encodeURIComponent(name)}`;
        }

        function closeModal() {
          const modal = document.getElementById('videoModal');
          const videoPlayer = document.getElementById('streamVideo');

          videoPlayer.pause(); // Pause the video when closing the modal
          modal.style.display = 'none'; // Hide the modal
        }

        async function fetchBirthdayData() {
          try {
            const response = await fetch('https://api.crstlnz.my.id/api/next_birthday?group=jkt48');
            const data = await response.json();

            const kontol = document.getElementById('birthdays');

            // Get today's date in Jakarta time (UTC+7)
            const today = new Date();
            const todayInJakarta = new Date(today.getTime() + 7 * 60 * 60 * 1000);
            const todayDay = todayInJakarta.getDate(); // Day of the month (1-31 in Jakarta time)
            const todayMonth = todayInJakarta.getMonth(); // Month index (0-11 in Jakarta time)

            // Helper function to check if a birthday is within the next 7 days
            const isUpcoming = (birthdayDate) => {
              const upcomingDate = new Date(birthdayDate);
              upcomingDate.setFullYear(todayInJakarta.getFullYear()); // Set the year to this year in Jakarta time
              const timeDiff = upcomingDate - todayInJakarta; // Difference in milliseconds
              const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
              return daysDiff > 0 && daysDiff <= 7; // Check if it's in the next 7 days
            };

            kontol.innerHTML = data.map(birthday => {
              // Parse the birthdate to get the day and month, and adjust to Jakarta timezone
              const birthDate = new Date(birthday.birthdate);
              const birthDateInJakarta = new Date(birthDate.getTime() + 7 * 60 * 60 * 1000); // Adjust to Jakarta time
              const birthdayDay = birthDateInJakarta.getDate(); // Day of the month (1-31 in Jakarta time)
              const birthdayMonth = birthDateInJakarta.getMonth(); // Month index (0-11 in Jakarta time)

              // Format date to "Tanggal, Bulan Tahun"
              const formattedDate = `${birthdayDay} ${birthDateInJakarta.toLocaleString('default', { month: 'long' })} ${birthDateInJakarta.getFullYear()}`;

              // Determine the label
              let label = '';
              let labelIcon = '';

              if (birthdayDay === todayDay && birthdayMonth === todayMonth) {
                label = 'Hari ini';
                labelIcon = '🎉'; // Celebration icon
              } else if (isUpcoming(birthDateInJakarta)) {
                label = 'Bentar lagi';
                labelIcon = '⏳'; // Hourglass icon
              }

              return `
                <div class="pseudo-profile">
                    <div class="wacky-photo-container">
                        <img src="${birthday.img}" alt="Profile picture of ${birthday.name}" />
                    </div>
                    <div class="mad-info">
                        <p class="crazy-name">${birthday.name}</p>
                        <p class="silly-date">${formattedDate}</p>
                        ${label ? `<div class="wacky-label" style="background-color: #ff4d4d; color: white; padding: 5px; border-radius: 3px; display: inline-flex; align-items: center;">${labelIcon} ${label}</div>` : ''}
                    </div>
                </div>
            `;
            }).join('');
          } catch (error) {
            console.error('Error fetching birthday data:', error);
            document.getElementById('birthdays').innerHTML = `<p>Error loading data. Please try again later.</p>`;
          }
        }

        // Function to fetch the latest news from the API
        async function fetchNewsData2() {
          try {
            const response = await fetch('https://jkt-48-scrape-xi.vercel.app/api/news');
            const data = await response.json();

            const newsContainer = document.getElementById('news-container');

            if (data.berita && Array.isArray(data.berita) && data.berita.length > 0) {
              // Clear previous content and initialize the container with the main structure
              newsContainer.innerHTML = `
                <div class="sigma">
                    <div class="header">
                        <h2>News</h2>
                        <a href="#">Selengkapnya</a>
                    </div>
                    <div class="news-list"></div>
                    <div class="valzy">
                        9 menit yang lalu <i class="fas fa-sync-alt"></i>
                    </div>
                </div>
            `;

              const newsList = newsContainer.querySelector('.news-list');
              const limitedNews = data.berita.slice(0, 5);

              // Append each news item inside the news-list div
              limitedNews.forEach((newsItem) => {
                const title = newsItem.judul;
                const date = newsItem.waktu;
                const badgeUrl = `https://jkt48.com${newsItem.badge_url}`;

                // Assign different badge classes based on type
                let badgeClass = newsItem.badge_type ? newsItem.badge_type : 'news'; // Default to 'news' if undefined

                const newsHtml = `
                    <div class="news-item">
                        <div class="tag ${badgeClass}"></div>
                        <img src="${badgeUrl}" alt="${title}">
                        <div class="date">${date}</div>
                        <div class="title">${title}</div>
                    </div>
                    <div class="footer"></div>
                `;

                newsList.innerHTML += newsHtml;
              });
            } else {
              // Display message when no news is available inside a box
              newsContainer.innerHTML = `
                <div class="no-news-box">
                    <h2>No News Available</h2>
                    <p>Sorry, there are no news updates at the moment. Please check back later.</p>
                </div>
            `;
            }
          } catch (error) {
            console.error('Error fetching news data:', error);
            document.getElementById('news-container').innerHTML = `
            <div class="error-message">
                <h2>Error Loading News</h2>
                <p>There was an error fetching the news. Please try again later.</p>
            </div>
        `;
          }
        }


        async function fetchTheaterSchedule() {
          try {
            const response = await fetch('https://api.crstlnz.my.id/api/event');
            const data = await response.json();

            const scheduleContainer = document.getElementById('schedule-list');

            // Check if the data contains the 'theater' and 'upcoming' fields
            if (data.theater && Array.isArray(data.theater.upcoming) && data.theater.upcoming.length > 0) {
              // Clear previous content
              scheduleContainer.innerHTML = '';

              // Slice the array to limit to 5 items
              const limitedSchedules = data.theater.upcoming.slice(0, 5);

              limitedSchedules.forEach(schedule => {
                const startDate = new Date(schedule.date); // Use the date string directly
                const formattedDate = startDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }); // Format date for Indonesia
                const formattedTime = startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); // Format time in HH:mm

                const scheduleHtml = `
                    <div class="event">
                        <div class="date">${formattedDate.split(' ')[0]}<br>${formattedDate.split(' ')[1]}</div>
                        <div class="badge event">|</div>
                        <div class="time"> ${formattedTime} </div>
                        <div class="title"> ${schedule.title}</div>
                        <button onclick="window.location.href='https://live.valzyofc.my.id/dtheater?id=${schedule.id}'" style="cursor: pointer; display: flex; align-items: center;">
                            <span style="margin-right: 5px;">🔍</span> <!-- Use an appropriate icon here -->
                            Lihat Detail
                        </button>
                    </div>
                `;

                scheduleContainer.innerHTML += scheduleHtml;
              });
            } else {
              scheduleContainer.innerHTML = '<p>No schedule data available</p>'; // Fallback if no data
            }
          } catch (error) {
            console.error('Error fetching schedule data:', error);
            document.getElementById('schedule-list').innerHTML = '<p>Error loading schedule</p>'; // Fallback on error
          }
        }

        const apiEndpoint = "https://jkt-48-scrape-xi.vercel.app/api/events";
        const baseUrl = "https://jkt48.com";

        // Fungsi untuk mengambil data dari API
        async function fetchEvents() {
          try {
            const response = await fetch(apiEndpoint);
            const result = await response.json();

            // Log hasil dari API untuk debugging
            console.log(result);

            // Pastikan data yang diambil berada di dalam kolom 'data'
            if (result.success && result.data && Array.isArray(result.data)) {
              // Filter hanya event dari Okt 2024
              const filteredEvents = result.data.filter(event => event.bulan_tahun === "Okt 2024");
              renderEvents(filteredEvents);
            } else {
              document.getElementById("events-jadwal").innerHTML = "<p>No events found</p>";
            }
          } catch (error) {
            console.error("Error fetching events:", error);
            document.getElementById("events-jadwal").innerHTML = "<p>Failed to load events</p>";
          }
        }

        // Fungsi untuk merender event di HTML
        function renderEvents(events) {
          const jadwal = document.getElementById("events-jadwal");
          jadwal.innerHTML = ""; // Kosongkan isi sebelumnya

          events.forEach(event => {
            if (event.have_event) {
              // Buat div untuk setiap event
              const eventElement = document.createElement("div");
              eventElement.classList.add("event");

              // Ambil data tanggal, bulan, hari
              const day = event.tanggal;
              const month = event.bulan_tahun.split(" ")[0];
              const dayName = event.hari;

              // Tambahkan elemen tanggal
              const dateElement = `
                        <div class="date">
                            <span class="day">${day} ${month}</span>
                            <span class="month">${dayName}</span>
                        </div>
                    `;

              // Tambahkan elemen gambar badge dan informasi event
              const eventDetails = `
                        <div class="details">
                            <img src="${baseUrl + event.badge_url}" alt="Event Label"> 
                            <div class="info">${event.event_time} - ${event.event_name}</div>
                        </div>
                    `;

              // Gabungkan elemen tanggal dan detail
              eventElement.innerHTML = dateElement + eventDetails;

              // Tambahkan eventElement ke jadwal
              jadwal.appendChild(eventElement);
            }
          });
        }


        fetchTheaterSchedule();

        fetchStreamData();
        fetchBirthdayData();
        fetchEvents();
        setInterval(() => {
          fetchStreamData(); // Refresh only the stream data
        }, 3000); // 3000 milliseconds = 3 secondd  

        async function fetchNewsData() {
          try {
            const response = await fetch('https://jkt-48-scrape-xi.vercel.app/api/news');
            const data = await response.json();

            const newsContainer = document.getElementById('news-container');

            if (data.berita && Array.isArray(data.berita) && data.berita.length > 0) {
              // Clear previous content and initialize the container with the main structure
              newsContainer.innerHTML = `
                <div class="sigma">
                    <div class="header">
                        <h2>News</h2>
                        <a href="#">Selengkapnya</a>
                    </div>
                    <div class="news-list"></div>
                    <div class="valzy">
                        9 menit yang lalu <i class="fas fa-sync-alt"></i>
                    </div>
                </div>
            `;

              const newsList = newsContainer.querySelector('.news-list');
              const limitedNews = data.berita.slice(0, 5);

              // Append each news item inside the news-list div
              limitedNews.forEach((newsItem) => {
                const title = newsItem.judul;
                const date = newsItem.waktu;
                const badgeUrl = `https://jkt48.com${newsItem.badge_url}`;

                // Assign different badge classes based on type
                let badgeClass = newsItem.badge_type ? newsItem.badge_type : 'news'; // Default to 'news' if undefined

                const newsHtml = `
        <div class="news-item" onclick="window.location.href='news?beritaId=${newsItem.berita_id}'">
            <div class="tag ${badgeClass}"></div>
            <img src="${badgeUrl}" alt="${title}">
            <div class="date">${date}</div>
            <div class="title">${title}</div>
        </div>
        <div class="footer"></div>
    `;

                newsList.innerHTML += newsHtml;
              });
            } else {
              // Display message when no news is available inside a box
              newsContainer.innerHTML = `
                <div class="no-news-box">
                    <h2>No News Available</h2>
                    <p>Sorry, there are no news updates at the moment. Please check back later.</p>
                </div>
            `;
            }
          } catch (error) {
            console.error('Error fetching news data:', error);
            document.getElementById('news-container').innerHTML = `
            <div class="error-message">
                <h2>Error Loading News</h2>
                <p>There was an error fetching the news. Please try again later.</p>
            </div>
        `;
          }
        }


        async function fetchNewsDetail(beritaId, title) {
          try {
            const url = `https://jkt48.com/news/detail/id/${beritaId}?lang=id`;
            const response = await axios.get(url);

            // Parse the HTML response with DOMParser
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.data, 'text/html');

            // Extract the news date and the entire HTML content of the news detail
            const newsDate = doc.querySelector('.entry-news__detail .metadata2');
            const newsContent = doc.querySelector('.entry-news__detail'); // Get the entire news content including images and text

            const dateText = newsDate ? newsDate.innerText : 'No Date Available';

            // Set the title from the clicked item (passed as an argument)
            document.getElementById('popup-title').innerText = title;

            // Set the date content
            document.getElementById('popup-date').innerText = dateText;

            // Insert the entire HTML content into the popup detail
            document.getElementById('popup-detail').innerHTML = newsContent.innerHTML;

            // Show the popup
            document.getElementById('popup-overlay').style.display = 'flex';
          } catch (error) {
            console.error('Error fetching news detail:', error);
            alert('Failed to load news details. Please try again later.');
          }
        }

        // Close popup event listener
        document.getElementById('close-popup').addEventListener('click', () => {
          document.getElementById('popup-overlay').style.display = 'none';
        });

        // Initial fetch
        fetchNewsData();
      
      
        // Check screen width on page load
        function checkDevice() {
          if (window.innerWidth > 768) {
            document.querySelector('.mobile-content').style.display = 'none';
            document.querySelector('.desktop-message').style.display = 'block';

            // Display alert for desktop users
            alert("This page is only accessible on mobile devices.");
          } else {
            document.querySelector('.mobile-content').style.display = 'block';
            document.querySelector('.desktop-message').style.display = 'none';
          }
        }

        // Initial check
        checkDevice();

        // Optional: check on window resize to adapt if needed
        window.addEventListener('resize', checkDevice);
      

      
        async function fetchOtherSchedule() {
          try {
            const response = await fetch('https://api.crstlnz.my.id/api/event');
            const data = await response.json();
            const otherSchedule = data.other_schedule;

            displayEvents(otherSchedule);
          } catch (error) {
            console.error('Error fetching events:', error);
            document.getElementById('eventsContainer').innerHTML = '<p>Failed to load events.</p>';
          }
        }

        function displayEvents(events) {
          const container = document.getElementById('eventsContainer');
          container.innerHTML = ''; // Clear any existing content

          if (events.length === 0) {
            container.innerHTML = '<p>No upcoming events available.</p>';
            return;
          }

          events.forEach(event => {
            const eventCard = `
                    <div class="whimsical-event">
                        <i class="fas fa-calendar-alt"></i>
                        <div>
                            <div class="wacky-date">
                                <img src="https://jkt48.com${event.label}" class="silly-label" alt="Label" width="40" height="14"  style="border-radius: 3px;"/>
                                <span>${formatDate(event.date)}</span>
                            </div>
                            <div class="quirky-title"><a href="https://jkt48.com${event.url}" style="color: #e0e0e0; text-decoration: none;">${event.title}</a></div>
                        </div>
                    </div>
                `; 
            container.innerHTML += eventCard;
          });
        }

        function formatDate(dateString) {
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          return new Date(dateString).toLocaleDateString('id-ID', options);
        }

      
        fetchOtherSchedule();
        fetchVideos();
        
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
