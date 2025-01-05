self.addEventListener('install', event => {
  console.log('Service Worker terinstal');
  self.skipWaiting();  // Memastikan service worker segera aktif
});

self.addEventListener('activate', event => {
  console.log('Service Worker diaktifkan');
  event.waitUntil(clients.claim());  // Mengambil alih kontrol dari halaman yang sudah terbuka
});

async function sendNotification(member) {
  const title = `${member.name} sedang Live!`;
  const options = {
    body: `Ayo gabung dengan ${member.name} di siaran langsungnya.`,
    icon: member.img,
    actions: [
      {
        action: 'open',
        title: `Buka Live Stream ${member.name}`,
        url: member.jkt48connect,
      },
    ],
  };

  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(client => {
    client.postMessage('new-notification');  // Menyampaikan pesan ke halaman
  });

  self.registration.showNotification(title, options);
}

// Fungsi untuk memeriksa member yang sedang live
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

// Menjadwalkan pengecekan member live setiap 5 menit
setInterval(checkLiveMembers, 5 * 60 * 1000);  // Setiap 5 menit
