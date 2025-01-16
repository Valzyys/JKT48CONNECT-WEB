    
        let members = [];

        // Function to fetch Oshi names from the API
        async function fetchOshiNames() {
            try {
                const response = await fetch('https://jkt-48-scrape-xi-indol.vercel.app/api/member');
                const data = await response.json();
                members = data.members.member;
                const oshiSelect = document.getElementById('oshi');

                members.forEach(member => {
                    const option = document.createElement('option');
                    option.value = member.ava_member;
                    option.textContent = member.nama_member;
                    oshiSelect.appendChild(option);
                });
            } catch (error) {
                console.error("Error fetching Oshi names:", error);
            }
        }

        // Function to update the avatar image
        function updateAvatar() {
            const oshiSelect = document.getElementById('oshi');
            const avatarPath = oshiSelect.value;
            const avatarUrl = avatarPath ? `https://jkt48.com${avatarPath}` : '';
            const oshiAvatar = document.getElementById('oshi-avatar');

            if (avatarUrl) {
                oshiAvatar.src = avatarUrl;
                oshiAvatar.classList.add('show');
            } else {
                oshiAvatar.classList.remove('show');
            }
        }

        // Function to save data to Local Storage
        function saveData() {
            const nama = document.getElementById('nama').value;
            const oshiSelect = document.getElementById('oshi');
            const oshi = oshiSelect.options[oshiSelect.selectedIndex].text;
            const avatarUrl = document.getElementById('oshi-avatar').src;

            localStorage.setItem('nama', nama);
            localStorage.setItem('oshi', oshi);
            localStorage.setItem('avatar', avatarUrl); // Save the avatar URL
        }

        // Function to change background periodically with fade-in effect
        const backgroundImages = [
                    "url('https://ssk.jkt48.com/2024/_next/image?url=%2F2024%2Fassets%2Fimg%2Fmember%2Fadeline-wijaya%2Fadeline-wijaya.jpg&w=384&q=90')",
                    "url('https://ssk.jkt48.com/2024/_next/image?url=%2F2024%2Fassets%2Fimg%2Fmember%2Fabigail-rachel%2Fabigail-rachel.jpg&w=384&q=75')",
                    "url('https://ssk.jkt48.com/2024/_next/image?url=%2F2024%2Fassets%2Fimg%2Fmember%2Falya-amanda%2Falya-amanda.jpg&w=384&q=75')",
                    "url('https://ssk.jkt48.com/2024/_next/image?url=%2F2024%2Fassets%2Fimg%2Fmember%2Famanda-sukma%2Famanda-sukma.jpg&w=384&q=75')",
                    "url('https://ssk.jkt48.com/2024/_next/image?url=%2F2024%2Fassets%2Fimg%2Fmember%2Fangelina-christy%2Fangelina-christy.jpg&w=384&q=75')",
                    "url('https://ssk.jkt48.com/2024/_next/image?url=%2F2024%2Fassets%2Fimg%2Fmember%2Fanindya-ramadhani%2Fanindya-ramadhani.jpg&w=384&q=75')",
                    "url('https://ssk.jkt48.com/2024/_next/image?url=%2F2024%2Fassets%2Fimg%2Fmember%2Faurellia%2Faurellia.jpg&w=384&q=75')",
                    "url('https://example.com/image3.jpg')"
                ];
        let currentImageIndex = 0;

        function changeBackground() {
            const backgroundContainer = document.getElementById('background');
            backgroundContainer.style.opacity = 0; // Fade out the current background
            setTimeout(() => {
                backgroundContainer.style.backgroundImage = backgroundImages[currentImageIndex];
                backgroundContainer.style.opacity = 1; // Fade in the new background
            }, 1000); // Wait for 1 second before changing the background
            currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
        }

        // Start changing background every 10 seconds
        setInterval(changeBackground, 7000); // Change every 10 seconds
        changeBackground(); // Initial background change on page load

        // Play the welcome sound when the page loads
        window.onload = function() {
            document.getElementById('welcome-sound').play();
        };

        document.addEventListener('DOMContentLoaded', fetchOshiNames);
    
    
  document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
  });

  document.onkeydown = function (e) {
      if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && e.keyCode == 73)) {
          return false;
      }
  };


    // Fungsi untuk memeriksa apakah data pengguna sudah ada di Local Storage
    function checkExistingData() {
        const nama = localStorage.getItem('nama');
        const oshi = localStorage.getItem('oshi');
        const avatar = localStorage.getItem('avatar');

        // Jika semua data ditemukan, redirect ke endpoint /home
        if (nama && oshi && avatar) {
            window.location.href = '/home';
        }
    }

    // Panggil fungsi saat halaman dimuat
    document.addEventListener('DOMContentLoaded', checkExistingData);

