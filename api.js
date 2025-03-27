/**
 * BOTV-CLIENT Authentication API
 * 
 * File ini berisi daftar ID Telegram terenkripsi yang diizinkan mengakses BOTV-CLIENT
 * Format: { "id": "encrypted_telegram_id", "name": "user_description", "access": "client/admin", "expiry": "YYYY-MM-DD" }
 * 
 * Enkripsi menggunakan AES-256 dengan kunci tersembunyi di bot
 */

const authorizedUsers = [
  {
    "id": "5746031448", // Contoh ID terenkripsi
    "name": "aldys",
    "access": "ADMIN",
    "expiry": "2025-04-21"
  },
  {
    "id": "U2FsdGVkX19r5FyL2T6AkvCnStYJ3txToHGBFYVrWz5Y=", // Contoh ID terenkripsi
    "name": "Client 2", 
    "access": "client",
    "expiry": "2024-12-31"
  },
  {
    "id": "U2FsdGVkX184FzCMSoqnLKJ23KiUNZXwvCX4jH2KbP8Q=", // Contoh ID terenkripsi
    "name": "Administrator",
    "access": "admin",
    "expiry": "2025-12-31"
  }
];

// Fungsi untuk menambahkan pengguna baru (digunakan oleh admin)
function addUser(encryptedId, name, access, expiry) {
  authorizedUsers.push({
    "id": encryptedId,
    "name": name,
    "access": access,
    "expiry": expiry
  });
}

// Fungsi untuk menghapus pengguna (digunakan oleh admin)
function removeUser(encryptedId) {
  const index = authorizedUsers.findIndex(user => user.id === encryptedId);
  if (index !== -1) {
    authorizedUsers.splice(index, 1);
    return true;
  }
  return false;
}

// Export daftar pengguna untuk diakses oleh bot
module.exports = {
  authorizedUsers,
  addUser,
  removeUser
}; 
