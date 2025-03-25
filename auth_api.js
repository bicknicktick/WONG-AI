/**
 * auth_api.js
 * API untuk otentikasi akses ke tutorial WONG-AI Trading Bot
 * Mengambil daftar ID Telegram dari GitHub repo dan memverifikasi akses
 */

class AuthAPI {
    constructor() {
        this.allowedIDs = [];
        this.loaded = false;
        this.error = null;
        this.githubRepo = 'https://raw.githubusercontent.com/bicknicktick/WONG-AI/main/allowed_ids.json';
        this.localStorageKey = 'wong_ai_tutorial_auth';
    }

    /**
     * Inisialisasi API dan muat daftar ID yang diizinkan
     */
    async initialize() {
        try {
            await this.loadAllowedIDs();
            return true;
        } catch (error) {
            console.error('Gagal menginisialisasi AuthAPI:', error);
            this.error = 'Gagal memuat daftar ID yang diizinkan';
            return false;
        }
    }

    /**
     * Memuat daftar ID Telegram yang diizinkan dari GitHub
     */
    async loadAllowedIDs() {
        try {
            // Coba load dari cache terlebih dahulu
            const cachedData = localStorage.getItem(this.localStorageKey);
            if (cachedData) {
                const { ids, timestamp } = JSON.parse(cachedData);
                const cacheAge = Date.now() - timestamp;
                
                // Gunakan cache jika belum 1 jam
                if (cacheAge < 3600000) {
                    this.allowedIDs = ids;
                    this.loaded = true;
                    console.log('Menggunakan data ID dari cache');
                    return;
                }
            }

            // Jika tidak ada cache atau cache expired, ambil dari GitHub
            const response = await fetch(this.githubRepo);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();
            if (data && Array.isArray(data.allowed_ids)) {
                this.allowedIDs = data.allowed_ids;
                this.loaded = true;
                
                // Simpan ke cache
                localStorage.setItem(this.localStorageKey, JSON.stringify({
                    ids: this.allowedIDs,
                    timestamp: Date.now()
                }));
                
                console.log('Berhasil memuat daftar ID yang diizinkan');
            } else {
                throw new Error('Format data tidak valid');
            }
        } catch (error) {
            console.error('Gagal memuat daftar ID:', error);
            this.error = 'Gagal mengambil daftar ID dari GitHub';
            throw error;
        }
    }

    /**
     * Cek apakah ID Telegram memiliki akses
     * @param {string} telegramID - ID Telegram user
     * @returns {boolean} - true jika diizinkan, false jika tidak
     */
    isAuthorized(telegramID) {
        if (!this.loaded) {
            console.error('AuthAPI belum diinisialisasi');
            return false;
        }

        // Periksa jika ID ada dalam daftar yang diizinkan
        return this.allowedIDs.includes(telegramID);
    }

    /**
     * Simpan ID Telegram di localStorage untuk sesi
     * @param {string} telegramID - ID Telegram yang akan disimpan
     */
    saveSession(telegramID) {
        sessionStorage.setItem('wong_ai_telegram_id', telegramID);
    }

    /**
     * Ambil ID Telegram dari sesi
     * @returns {string|null} - ID Telegram atau null jika tidak ada
     */
    getSessionID() {
        return sessionStorage.getItem('wong_ai_telegram_id');
    }

    /**
     * Periksa apakah sesi saat ini diotorisasi
     * @returns {boolean} - true jika diotorisasi, false jika tidak
     */
    checkSession() {
        const sessionID = this.getSessionID();
        if (!sessionID) return false;
        return this.isAuthorized(sessionID);
    }

    /**
     * Hapus sesi
     */
    clearSession() {
        sessionStorage.removeItem('wong_ai_telegram_id');
    }
}

// Buat instance global API yang bisa diakses
const authAPI = new AuthAPI(); 