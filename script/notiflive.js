async function registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('notifications.js');
          console.log('Service Worker terdaftar:', registration);
        } catch (error) {
          console.error('Gagal mendaftar Service Worker:', error);
        }
      } else {
        alert('Browser kamu tidak mendukung Service Worker!');
      }
    }

    async function requestNotificationPermission() {
      if (!('Notification' in window)) {
        alert('Browser kamu tidak mendukung notifikasi!');
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Izin notifikasi diberikan!');
      } else {
        console.log('Izin notifikasi ditolak!');
      }
    }

    async function sendNotification(member) {
      if (Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(`${member.name} is Live Now!`, {
          body: `Join ${member.name} in their live stream.`,
          icon: member.img,
          actions: [
            {
              action: 'open',
              title: `Tonton di JKT48Connect`,
              url: member.jkt48connect,
            },
          ],
        });
      } else {
        alert('Kamu harus memberikan izin untuk notifikasi.');
      }
    }

    async function checkLiveMembers() {
      try {
        const response = await fetch('https://api.crstlnz.my.id/api/now_live?group=jkt48');
        const data = await response.json();

        if (data && Array.isArray(data)) {
          data.forEach(member => {
            if (member.started_at) {
              sendNotification(member);
            }
          });
        } else {
          console.log('Tidak ada member yang live.');
        }
      } catch (error) {
        console.error('Gagal mengambil data live member:', error);
      }
    }

    window.onload = async () => {
      await registerServiceWorker();
      await requestNotificationPermission();
      await checkLiveMembers();
    };
