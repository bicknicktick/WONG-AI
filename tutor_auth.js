/**
 * tutor_auth.js
 * Kode untuk manajemen autentikasi tutorial WONG-AI Trading Bot
 * Script ini berinteraksi dengan auth_api.js untuk memverifikasi akses
 */

// Inisialisasi saat dokumen diload
document.addEventListener('DOMContentLoaded', async () => {
    // Area tutorial
    const tutorialContent = document.querySelector('.slides-container');
    
    // Buat elemen untuk form login dan pesan error
    const authContainer = document.createElement('div');
    authContainer.className = 'auth-container';
    
    // Tambahkan authContainer ke body sebelum tutorial content
    document.body.insertBefore(authContainer, tutorialContent);
    
    // Sembunyikan tutorial content dulu
    tutorialContent.style.display = 'none';
    
    // Tampilkan UI loading
    showLoadingUI();
    
    // Inisialisasi API autentikasi
    try {
        await authAPI.initialize();
        
        // Cek apakah sesi sudah terotentikasi
        if (authAPI.checkSession()) {
            // Jika sudah login, tampilkan tutorial
            showTutorial();
        } else {
            // Jika belum login, tampilkan form login
            showLoginForm();
        }
    } catch (error) {
        // Jika terjadi error, tampilkan pesan error
        showError('Gagal mengakses server autentikasi. Silakan coba lagi nanti.');
        console.error('Error inisialisasi Auth:', error);
    }
});

/**
 * Tampilkan UI loading saat memuat data
 */
function showLoadingUI() {
    const authContainer = document.querySelector('.auth-container');
    authContainer.innerHTML = `
        <div class="auth-loading">
            <div class="spinner"></div>
            <p>Memuat sistem autentikasi WONG-AI Trading Bot...</p>
        </div>
    `;
}

/**
 * Tampilkan formulir login untuk memasukkan ID Telegram
 */
function showLoginForm() {
    const authContainer = document.querySelector('.auth-container');
    
    authContainer.innerHTML = `
        <div class="auth-form">
            <div class="auth-logo">🤖 WONG-AI</div>
            <h2>Verifikasi Akses Tutorial</h2>
            <p>Masukkan ID Telegram Anda untuk mengakses tutorial WONG-AI Trading Bot.</p>
            
            <div class="form-group">
                <label for="telegram-id">ID Telegram:</label>
                <input type="text" id="telegram-id" placeholder="Contoh: 123456789">
                <small>Untuk mendapatkan ID Telegram, kirim pesan ke @userinfobot di Telegram</small>
            </div>
            
            <button id="btn-verify" class="btn-verify">Verifikasi Akses</button>
            
            <div class="auth-note">
                <p><strong>Catatan:</strong> Tutorial ini hanya dapat diakses oleh pengguna yang terdaftar.</p>
                <p>Untuk informasi lebih lanjut, kunjungi <a href="https://github.com/bicknicktick/WONG-AI" target="_blank">GitHub WONG-AI</a></p>
            </div>
            
            <div id="auth-error" class="auth-error" style="display: none;"></div>
        </div>
    `;
    
    // Event listener untuk tombol verifikasi
    document.getElementById('btn-verify').addEventListener('click', handleVerification);
    
    // Event listener untuk input (enter key)
    document.getElementById('telegram-id').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleVerification();
        }
    });
}

/**
 * Tangani proses verifikasi ID Telegram
 */
async function handleVerification() {
    // Ambil ID dari input
    const telegramIDInput = document.getElementById('telegram-id');
    const telegramID = telegramIDInput.value.trim();
    
    // Validasi input
    if (!telegramID) {
        showErrorMessage('ID Telegram tidak boleh kosong');
        return;
    }
    
    // Validasi format ID (hanya angka)
    if (!/^\d+$/.test(telegramID)) {
        showErrorMessage('ID Telegram hanya boleh berisi angka');
        return;
    }
    
    // Tampilkan loader pada tombol
    const verifyButton = document.getElementById('btn-verify');
    verifyButton.innerHTML = 'Verifikasi <span class="btn-spinner"></span>';
    verifyButton.disabled = true;
    
    try {
        // Verifikasi akses
        const isAuthorized = authAPI.isAuthorized(telegramID);
        
        if (isAuthorized) {
            // Simpan ID di session
            authAPI.saveSession(telegramID);
            
            // Tampilkan pesan sukses sebelum menampilkan tutorial
            showSuccessMessage('Verifikasi berhasil! Mengalihkan ke tutorial...');
            
            // Tunggu 1.5 detik sebelum menampilkan tutorial
            setTimeout(() => {
                showTutorial();
            }, 1500);
        } else {
            // Tampilkan pesan error jika akses ditolak
            showErrorMessage('ID Telegram tidak terdaftar dalam sistem. Akses ditolak.');
            resetButton(verifyButton);
        }
    } catch (error) {
        showErrorMessage('Terjadi kesalahan saat verifikasi. Silakan coba lagi.');
        console.error('Error verifikasi:', error);
        resetButton(verifyButton);
    }
}

/**
 * Reset tombol ke kondisi awal
 */
function resetButton(button) {
    button.innerHTML = 'Verifikasi Akses';
    button.disabled = false;
}

/**
 * Tampilkan pesan error pada form
 */
function showErrorMessage(message) {
    const errorElement = document.getElementById('auth-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

/**
 * Tampilkan pesan sukses pada form
 */
function showSuccessMessage(message) {
    const errorElement = document.getElementById('auth-error');
    errorElement.textContent = message;
    errorElement.className = 'auth-success';
    errorElement.style.display = 'block';
}

/**
 * Tampilkan pesan error utama
 */
function showError(message) {
    const authContainer = document.querySelector('.auth-container');
    
    authContainer.innerHTML = `
        <div class="auth-error-container">
            <div class="auth-logo">🤖 WONG-AI</div>
            <h2>Terjadi Kesalahan</h2>
            <p>${message}</p>
            <button id="btn-retry" class="btn-retry">Coba Lagi</button>
        </div>
    `;
    
    // Event listener untuk tombol coba lagi
    document.getElementById('btn-retry').addEventListener('click', () => {
        location.reload();
    });
}

/**
 * Tampilkan konten tutorial
 */
function showTutorial() {
    // Tambahkan UI logout di pojok kanan atas
    addLogoutButton();
    
    // Tampilkan konten tutorial
    const tutorialContent = document.querySelector('.slides-container');
    const authContainer = document.querySelector('.auth-container');
    
    // Sembunyikan container autentikasi
    authContainer.style.display = 'none';
    
    // Tampilkan tutorial
    tutorialContent.style.display = 'block';
}

/**
 * Tambahkan tombol logout di pojok kanan atas
 */
function addLogoutButton() {
    const logoutBtn = document.createElement('div');
    logoutBtn.className = 'logout-button';
    logoutBtn.innerHTML = `
        <span>Logout</span>
        <i class="logout-icon">↩️</i>
    `;
    
    // Styling untuk tombol logout
    logoutBtn.style.position = 'fixed';
    logoutBtn.style.top = '15px';
    logoutBtn.style.right = '15px';
    logoutBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    logoutBtn.style.color = 'white';
    logoutBtn.style.padding = '8px 15px';
    logoutBtn.style.borderRadius = '4px';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.style.zIndex = '1000';
    logoutBtn.style.fontSize = '14px';
    logoutBtn.style.display = 'flex';
    logoutBtn.style.alignItems = 'center';
    logoutBtn.style.gap = '5px';
    
    // Event listener untuk tombol logout
    logoutBtn.addEventListener('click', () => {
        // Hapus session ID
        authAPI.clearSession();
        // Reload halaman
        location.reload();
    });
    
    document.body.appendChild(logoutBtn);
} 