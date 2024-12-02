function loadUserData() {
    const nama = localStorage.getItem('nama');
    const oshi = localStorage.getItem('oshi');
    const oshi2 = localStorage.getItem('oshi');
    const avatar = localStorage.getItem('avatar');

    if (nama && oshi && avatar) {
        document.getElementById('name').textContent = `Halo, ${nama}`;
        document.getElementById('oshi').textContent = `Oshi Kamu ${oshi} Ya? 🤔 Berikut ini motivasi spesial untuk kamu:`;
        document.getElementById('oshi2').textContent = `Terus beri semangat kepada ${oshi} dan JKT48!`;
        document.getElementById('avatar').src = avatar;
    } else {
        alert("No user data found. Redirecting to the home page.");
        window.location.href = "index.html";
    }
}

function resetForm() {
    localStorage.removeItem('nama');
    localStorage.removeItem('oshi');
    localStorage.removeItem('avatar');
    alert("Data reset successful.");
    window.location.href = "index.html?reset=true";
}

document.addEventListener('DOMContentLoaded', loadUserData);
