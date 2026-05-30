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

// ─── Settings ────────────────────────────────────────────────────────────────

/** Nilai default untuk settings aplikasi */
const DEFAULT_SETTINGS = {
  userName: 'Yusuf Sugiono',
  theme: 'system', // 'light' | 'dark' | 'system'
  cycleStartDay: 1, // tanggal mulai siklus (1-28)
};

/**
 * Membaca settings dari localStorage.
 * Mengembalikan object settings yang sudah di-merge dengan default values,
 * sehingga key yang belum ada tetap punya nilai.
 *
 * @returns {object} Settings aplikasi
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const saved = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    console.error('Gagal membaca settings dari localStorage');
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Menyimpan settings ke localStorage.
 *
 * @param {object} settings - Object settings yang akan disimpan
 */
export function saveSettings(settings) {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

// Key constants untuk localStorage — semua key dikumpulkan di sini
// agar tidak ada typo saat dipakai di berbagai tempat
export const STORAGE_KEYS = {
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  SETTINGS: 'settings',
};
