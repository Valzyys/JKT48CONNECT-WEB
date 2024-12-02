
    const apiKey = 'AIzaSyALDAm7Ueoh29tGubH4sTcJV70mMAv7JdE'; // Ganti dengan API Key YouTube Anda
    const channelId = 'UCAZ5bu4iyRIxsHVp5HbKGZw'; // ID Channel JKT48

    async function fetchVideos() {
        const videoUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=100`;

        try {
            const response = await fetch(videoUrl);
            const data = await response.json();

            if (data.items.length > 0) {
                const videoList = document.getElementById('videoList');
                videoList.innerHTML = ''; // Kosongkan daftar video sebelumnya

                data.items.forEach(item => {
                    if (item.id.kind === 'youtube#video') {
                        const videoItem = document.createElement('div');
                        videoItem.className = 'video-item';

                        // Ambil thumbnail dan judul video
                        const thumbnailUrl = item.snippet.thumbnails.medium.url;
                        const videoTitle = item.snippet.title;
                        const videoId = item.id.videoId; // Ambil ID video YouTube

                        // Buat elemen gambar thumbnail
                        const thumbnailImg = document.createElement('img');
                        thumbnailImg.src = thumbnailUrl;
                        thumbnailImg.alt = 'Video Thumbnail';

                        // Buat elemen judul video
                        const titleElement = document.createElement('div');
                        titleElement.className = 'video-title';
                        titleElement.innerText = videoTitle;

                        // Tambahkan event klik untuk mengarahkan langsung ke video YouTube
                        videoItem.onclick = () => window.location.href = `https://www.youtube.com/watch?v=${videoId}`;

                        // Gabungkan elemen-elemen ke dalam videoItem
                        videoItem.appendChild(thumbnailImg);
                        videoItem.appendChild(titleElement);

                        // Tambahkan videoItem ke dalam videoList
                        videoList.appendChild(videoItem);
                    }
                });
            } else {
                document.getElementById('videoList').innerText = 'No videos found.';
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            document.getElementById('videoList').innerText = 'Failed to load videos.';
        }
    }

    // Muat video saat halaman dimuat
    window.onload = fetchVideos;


    
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
    
const scrollActive = () =>{
  	const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
			  sectionTop = current.offsetTop - 58,
			  sectionId = current.getAttribute('id'),
			  sectionsClass = document.querySelector('.nav__list a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)

      
