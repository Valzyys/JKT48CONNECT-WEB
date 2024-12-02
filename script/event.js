
    // API endpoint
    const apiEndpoint = "https://api.crstlnz.my.id/api/event";
    const baseUrl = "https://jkt48.com";

    // Function to fetch events from the API
    async function fetchEvents() {
        try {
            const response = await fetch(apiEndpoint);
            const result = await response.json();

            // Log the result from the API for debugging
            console.log(result);

            // Ensure that data is available in 'theater' > 'other_schedule'
            if (result.success && result.theater && Array.isArray(result.theater.other_schedule)) {
                renderEvents(result.theater.other_schedule);
            } else {
                document.getElementById("events-peler amat").innerHTML = "<p>No events found</p>";
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            document.getElementById("events-peler amat").innerHTML = "<p>Failed to load events</p>";
        }
    }



// Function to render events in HTML
function renderEvents(events) {
    const pelerAmat = document.getElementById("events-pelerAmat"); // Changed ID to match naming conventions
    pelerAmat.innerHTML = "";  // Clear previous content

    events.forEach(event => {
        const eventDate = new Date(event.date); // Convert to Date object
        const day = eventDate.getUTCDate();
        const month = eventDate.toLocaleString('default', { month: 'short' }); // Get short month name
        const dayName = eventDate.toLocaleString('default', { weekday: 'long' }); // Get day name
    
        // Create div for each event
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");
    
        // Add date element
        const dateElement = `
            <div class="date">
                <span class="day">${day} ${month}</span>
                <span class="month">${dayName}</span>
            </div>
        `;
    
        // Add event details including the label URL
        const eventDetails = `
            <div class="details">
                <img src="${baseUrl + event.label}" alt="Event Label">
                <div class="info">
                    <a href="${baseUrl + event.url}" target="_blank">${event.title}</a>
                </div>
            </div>
        `;
    
        // Combine date and details
        eventElement.innerHTML = dateElement + eventDetails;
    
        // Append eventElement to pelerAmat
        pelerAmat.appendChild(eventElement);
    });
}

    window.onload = fetchEvents;



    function redirectTo(url) {
        window.location.href = url; // Redirect to the specified URL
    }



async function fetchTheaterSchedule() {
    try {
        const response = await fetch('https://api.crstlnz.my.id/api/event');
        const data = await response.json();

        const scheduleContainer = document.getElementById('schedule-list');

        if (data.theater && Array.isArray(data.theater.upcoming) && data.theater.upcoming.length > 0) {
            // Clear previous content
            scheduleContainer.innerHTML = '';

            // Limit to 10 items
            const limitedSchedules = data.theater.upcoming.slice(0, 10);
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1); // Set tomorrow's date

            limitedSchedules.forEach(schedule => {
                const startDate = new Date(schedule.date); // Parse ISO date
                const formattedDate = startDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }); // Format date
                const formattedTime = startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); // Format time

                // Choose the image (using 'banner' or fallback to 'poster')
                const imageUrl = schedule.banner || schedule.poster;

                // Determine label based on time
                let label = 'Mendatang';
                const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // One hour ago

                if (startDate.toDateString() === now.toDateString()) {
                    if (now >= startDate) {
                        // If the event started more than one hour ago
                        if (startDate < oneHourAgo) {
                            label = 'Finish';
                        } else {
                            label = 'Berlangsung';
                        }
                    } else {
                        label = 'Hari ini';
                    }
                } else if (startDate.toDateString() === tomorrow.toDateString()) {
                    label = 'Besok'; // Set label to "Besok" if the event is for tomorrow
                }

                let labelStyle = '';
                if (label === 'Finish') {
                    labelStyle = 'background-color: #6c757d;'; // Gray for Finished
                } else if (label === 'Berlangsung') {
                    labelStyle = 'background-color: #28a745;'; // Green for Ongoing
                } else if (label === 'Besok') {
                    labelStyle = 'background-color: #FFA500;'; // Yellow for Tomorrow
                } else {
                    labelStyle = 'background-color: #ff3b30;'; // Red for Upcoming
                }

                // Construct the seitansai label with an icon if available
                let seitansaiHtml = '';
                if (schedule.seitansai && Array.isArray(schedule.seitansai) && schedule.seitansai.length > 0) {
                    const member = schedule.seitansai[0]; // Get the first member for the icon
                    const seitansaiIcon = member.img; // Image URL for the icon
                    const memberName = member.name; // Member name

                    // Create the seitansai label HTML
                    seitansaiHtml = `
                        <div class="seitansai-label" style="display: flex; align-items: center; margin-top: 5px; background-color: #28a745; padding: 5px; border-radius: 5px;">
                            <img src="${seitansaiIcon}" alt="${memberName}" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 5px;" />
                            <span style="color: #fff;"><b>${memberName}</b> Seitansai!!</span>
                        </div>
                    `;
                }

                // Construct the HTML for each event
                const scheduleHtml = `
                <div class="event-item">
                    <div style="position: relative;">
                        <img alt="Image for ${schedule.title}" src="${imageUrl}" onerror="this.onerror=null; this.src='https://via.placeholder.com/900x300?text=Image+Not+Found';"/>
                        <div class="event-badge" style="${labelStyle}">${label}</div>
                    </div>
                    <div class="event-details">
                        <h2>${schedule.title}</h2>
                        <p>${formattedDate} <br> ${formattedTime}</p>
                        <p><strong>Member Count:</strong> ${schedule.member_count || 'N/A'}</p> <!-- Add Member Count -->
                        ${seitansaiHtml} <!-- Include the seitansai members label -->
                        <div class="event-members-container" style="display: flex; align-items: center; justify-content: flex-end; gap: 5px;">
                            <button class="entrance-button" style="background-color: #34526f; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 12px; cursor: pointer;" onclick="window.location.href='https://showroom-live.com/r/${schedule.url}'">
                                Entrance
                            </button>
                            <button class="detail-button" style="background-color: #1e90ff; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 12px; cursor: pointer;" onclick="window.location.href='https://live.valzyofc.my.id/dtheater?id=${schedule.id}'">
                                <i class="fas fa-info-circle"></i> Detail
                            </button>
                        </div>
                    </div>
                </div>
                `;

                scheduleContainer.innerHTML += scheduleHtml;
            });
        } else {
            scheduleContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                    <img src="https://res.cloudinary.com/doig4w6cm/image/fetch/f_auto,q_80/https://res.cloudinary.com/haymzm4wp/image/upload/assets/svg/web/schedule.svg" style="width: 300px; height: 300px; margin-bottom: 15px;" alt="No data available" />
                    <p style="font-size: 1.2em; color: #fff;">No schedule data available</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching schedule data:', error);
        document.getElementById('schedule-list').innerHTML = '<p>Error loading schedule</p>';
    }
}


async function lastshow() {
    try {
        const response = await fetch('https://api.crstlnz.my.id/api/event');
        const data = await response.json();

        const pastScheduleContainer = document.getElementById('past-schedule-list');
        const noShowsContainer = document.getElementById('no-shows');
        const now = new Date();

        // Clear previous content
        pastScheduleContainer.innerHTML = '';

        // Check if "theater" and "recent" exist in the data
        if (data.theater && data.theater.recent && data.theater.recent.length > 0) {
            let hasShows = false; // Flag to check if there are shows

            // Hide skeleton while data is loaded
            document.querySelectorAll('.skeleton-card').forEach(skeleton => skeleton.style.display = 'none');

            data.theater.recent.forEach(schedule => {
                const startDate = new Date(schedule.date); // Convert to Date object

                // If event is in the past, display it
                if (startDate < now) {
                    hasShows = true; // Set flag to true
                    const formattedDate = startDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
                    const formattedTime = startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                    // Use the poster as the image
                    const scheduleHtml = `
                        <div class="card" onclick="window.location.href='/rtheater?id=${schedule.id}'">
                            <img alt="${schedule.title} performance poster" src="${schedule.poster || 'https://placehold.co/400x400'}" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x400?text=Image+Not+Found';"/>
                            <div class="card-content">
                                <span class="date">${formattedDate}</span>
                                <h2 style="font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${schedule.title}</h2>
                            </div>
                        </div>
                    `;

                    pastScheduleContainer.innerHTML += scheduleHtml;
                }
            });

            // If no shows were added, display the no shows message
            if (!hasShows) {
                pastScheduleContainer.style.display = 'none';
                noShowsContainer.style.display = 'flex'; // Show no shows message
            } else {
                noShowsContainer.style.display = 'none'; // Hide no shows message
            }
        } else {
            // If there are no recent events
            pastScheduleContainer.style.display = 'none';
            noShowsContainer.style.display = 'flex'; // Show no shows message
        }
    } catch (error) {
        console.error('Error fetching schedule data:', error);
        document.getElementById('past-schedule-list').innerHTML = '<p>Error loading schedule</p>';
    }
}


        // Memanggil fungsi untuk memuat peler amat teater
        fetchTheaterSchedule();
        lastshow();
    

    async function fetchStreamData() {
        try {
            const response = await fetch('https://api.crstlnz.my.id/api/now_live?group=jkt48');
            const data = await response.json();
            const container = document.getElementById('streams');

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
                    const imageUrl = stream.type === 'showroom' ? stream.img_alt : stream.img;
                    const label = stream.type === 'idn' 
                        ? `<img src="https://res.cloudinary.com/doig4w6cm/image/fetch/f_auto,q_80/https://upload.wikimedia.org/wikipedia/commons/b/ba/IDN_Live.svg" alt="LIVE" style="width: 100px; height: auto; margin-left: -80px;">` 
                        : `<img src="https://files.catbox.moe/kf217f.png" alt="SHOWROOM" style="width: 100px; height: auto; margin-left: -80px; border-radius: 5px;">`;

                    const premiumLabel = stream.is_premium 
                        ? '<div class="golden-badge" style="color: gold; font-weight: bold; font-size: 16px;">Premium Live</div>' 
                        : '';

                    // Set up button URL with query parameters for stream_url and name
                    const streamUrl = stream.streaming_url_list[0]?.url || '#';
                    const encodedName = encodeURIComponent(stream.name);

                    // Each live stream is assigned a unique ID for updating its time
                    return `
                        <div class="fuzzy-item">
                            <img src="${imageUrl}" alt="${stream.name}">
                            <div class="squiggle-info">
                                <h3>${stream.name}</h3>
                                <p id="timeAgo-${index}"></p> <!-- Dynamic time element -->
                            </div>
                            <button class="beep-button" onclick="window.location.href='/idn.html?stream_url=${encodeURIComponent(streamUrl)}&name=${encodedName}'">
                                <i class="fas fa-video"></i> Watch
                            </button>
                        </div>
                        <div class="twiddle-divider"></div>
                    `;
                }).join('');

                // Update elapsed time every minute
                setInterval(() => {
                    data.forEach((stream, index) => {
                        const startedAt = new Date(stream.started_at);
                        const now = new Date();
                        const timeDiff = now - startedAt;

                        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                        const timeAgo = `${hours > 0 ? hours + ' hours ' : ''}${minutes} minutes ago`;

                        document.getElementById(`timeAgo-${index}`).textContent = timeAgo;
                    });
                }, 1000); // Update every 60000 milliseconds (1 minute)

                // Initial call to set time on page load
                data.forEach((stream, index) => {
                    const startedAt = new Date(stream.started_at);
                    const now = new Date();
                    const timeDiff = now - startedAt;

                    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    const timeAgo = `${hours > 0 ? hours + ' hours ' : ''}${minutes} minutes ago`;

                    document.getElementById(`timeAgo-${index}`).textContent = timeAgo;
                });
            }
        } catch (error) {
            console.error('Error fetching stream data:', error);
        }
    }

    document.addEventListener("DOMContentLoaded", fetchStreamData);


        
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
                            <div class="quirky-title"><a href="${event.url}" style="color: #e0e0e0; text-decoration: none;">${event.title}</a></div>
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

        // Fetch the events when the page loads
        fetchOtherSchedule();
    
    
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


