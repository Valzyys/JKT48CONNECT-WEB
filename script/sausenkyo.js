    
        const API_KEY = 'AIzaSyACgpG3XScR1d5f_qZ-deCr0FSuViPOYdM';
        const CHANNEL_ID = 'UCaIbbu5Xg3DpHsn_3Zw2m9w';
        const SEARCH_QUERY = 'Pemilihan Member Single ke-26 JKT48';
        const EXCLUDED_IDS = ["JnfQ7_LGmHo", "ialsxbmz_jo"];
        const EXCLUDED_TITLES = ["Pemilihan Member Single ke-26 JKT48", "Saatnya Kesempatan - JKT48 | Pemilihan Member Single ke-26 JKT48 Official Theme Song", "Laptime Masa Remaja - JKT48 Official Teaser"];

        async function fetchVideos() {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&q=${encodeURIComponent(SEARCH_QUERY)}&part=snippet,id&order=date&maxResults=56`);
            const data = await response.json();
            return data.items;
        }

        function createCard(video) {
            const card = document.createElement('div');
            card.className = 'card';
            const title = video.snippet.title.replace(/\s*\(Trainee\)/i, '');
            card.innerHTML = `
                <img src="${video.snippet.thumbnails.high.url}" alt="${title}"/>
                <h2>${title}</h2>
                <button class="watch-button" onclick="openModal('${video.id.videoId}')">
                    <i class="fa-regular fa-circle-play"></i> Tonton Sekarang
                </button>
            `;
            return card;
        }

        async function displayVideos() {
            const videos = await fetchVideos();
            const container = document.getElementById('videoContainer');
            videos.forEach(video => {
                if (!EXCLUDED_TITLES.includes(video.snippet.title) && !EXCLUDED_IDS.includes(video.id.videoId)) {
                    const card = createCard(video);
                    container.appendChild(card);
                }
            });
        }

        function openModal(videoId) {
            const modal = document.getElementById("videoModal");
            const videoPlayer = document.getElementById("videoPlayer");
            videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            modal.style.display = "block";
        }

        document.querySelector('.close').onclick = function() {
            const modal = document.getElementById("videoModal");
            const videoPlayer = document.getElementById("videoPlayer");
            modal.style.display = "none";
            videoPlayer.src = "";
        }

        window.onclick = function(event) {
            const modal = document.getElementById("videoModal");
            if (event.target === modal) {
                modal.style.display = "none";
                const videoPlayer = document.getElementById("videoPlayer");
                videoPlayer.src = "";
            }
        }

        displayVideos();
      /*=============== EXPANDED LIST ===============*/
      const navExpand = document.getElementById('nav-expand'),
        navExpandList = document.getElementById('nav-expand-list'),
        navExpandIcon = document.getElementById('nav-expand-icon')

    navExpand.addEventListener('click', () => {
      // Expand list
      navExpandList.classList.toggle('show-list')

      // Rotate icon
      navExpandIcon.classList.toggle('rotate-icon')
    })

    /*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
    const sections = document.querySelectorAll('section[id]')

    const scrollActive = () => {
      const scrollDown = window.scrollY

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
          sectionTop = current.offsetTop - 58,
          sectionId = current.getAttribute('id'),
          sectionsClass = document.querySelector('.nav__list a[href*=' + sectionId + ']')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
          sectionsClass.classList.add('active-link')
        } else {
          sectionsClass.classList.remove('active-link')
        }
      })
    }
    window.addEventListener('scroll', scrollActive)

