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
