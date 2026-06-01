/**
 * Utility functions untuk format angka ke format mata uang.
 */

/**
 * Format angka ke format Rupiah Indonesia.
 * Contoh: 10000000 → "Rp10.000.000"
 *
 * @param {number} amount - Nominal yang akan diformat
 * @returns {string} Nominal dalam format Rupiah
 */
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format string angka dengan pemisah ribuan (titik).
 * Hanya menyisakan digit, lalu menambahkan titik setiap 3 digit dari kanan.
 * Contoh: "10000000" → "10.000.000", "1500" → "1.500"
 *
 * @param {string} value - String input (bisa mengandung titik sebelumnya)
 * @returns {string} String dengan format pemisah ribuan
 */
export function formatThousand(value) {
  // Hapus semua karakter non-digit
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  // Tambahkan titik pemisah ribuan
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parse string berformat ribuan menjadi angka murni (number).
 * Contoh: "10.000.000" → 10000000, "" → 0
 *
 * @param {string} value - String dengan format pemisah ribuan
 * @returns {number} Nilai numerik
 */
export function parseThousand(value) {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}
