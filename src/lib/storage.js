/**
 * Utility functions untuk membaca dan menyimpan data ke localStorage.
 * Semua akses localStorage di-centralize di sini agar mudah diganti
 * dengan solusi lain (misalnya API) di masa depan.
 */

/**
 * Membaca data dari localStorage berdasarkan key.
 * Mengembalikan array kosong jika data tidak ditemukan atau parsing gagal.
 *
 * @param {string} key - Key localStorage
 * @returns {Array} Data yang tersimpan, atau array kosong
 */
export function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    console.error(`Gagal membaca data dari localStorage (key: ${key})`);
    return [];
  }
}

/**
 * Menyimpan data ke localStorage.
 *
 * @param {string} key - Key localStorage
 * @param {*} data - Data yang akan disimpan (akan di-serialize ke JSON)
 */
export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error(`Gagal menyimpan data ke localStorage (key: ${key})`);
  }
}

// Key constants untuk localStorage — semua key dikumpulkan di sini
// agar tidak ada typo saat dipakai di berbagai tempat
export const STORAGE_KEYS = {
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
};
