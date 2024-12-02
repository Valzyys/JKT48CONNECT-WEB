
        // Function to format date
        function formatDate(dateStr) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateStr).toLocaleDateString('id-ID', options); // Use 'id-ID' for Indonesian locale
        }

        // Function to get URL parameter
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        // Get the beritaId from the URL parameter
        const beritaId = getQueryParam('beritaId');

        // If beritaId is not provided, show an error message
        if (!beritaId) {
            document.querySelector('.container').innerHTML = '<h2>Please provide a beritaId in the URL (e.g., ?beritaId=1853)</h2>';
        } else {
            // Fetch data from API based on beritaId
            fetch(`https://api.crstlnz.my.id/api/news/${beritaId}`)
                .then(response => response.json())
                .then(data => {
                    // Populate title
                    document.querySelector('.title').textContent = data.title;

                    // Populate date from "date" field and format it
                    document.querySelector('.date .skeleton').textContent = formatDate(data.date); // Changed to use data.date

                    // Populate original link
                    const originalLink = document.getElementById('open-original');
                    originalLink.href = `https://jkt48.com/news/detail/id/${data.id}?lang=id`; // Use data.id for the URL

                    // Populate theater label image and URL
                    const theaterImagePath = data.label; // Assuming the label contains the image path
                    const theaterUrl = `https://jkt48.com${theaterImagePath}`; // Construct the full image URL

                    const theaterLink = document.getElementById('theater-link');
                    theaterLink.href = `https://jkt48.com`; // Set the theater link

                    const theaterImage = document.getElementById('theater-image');
                    theaterImage.src = theaterUrl; // Set the image source
                    theaterImage.alt = theaterImagePath.split('/').pop(); // Use the file name as alt text for accessibility

                    // Populate content
                    document.querySelector('.content').innerHTML = data.content;

                    // Remove skeleton classes after data is loaded
                    document.querySelectorAll('.skeleton').forEach(element => {
                        element.classList.remove('skeleton');
                    });
                })
                .catch(error => console.error('Error fetching news:', error));
        }
