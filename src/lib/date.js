/**
 * Utility functions untuk format tanggal.
 */

/**
 * Format tanggal ke locale Indonesia.
 * Contoh: "2026-04-10" → "10 Apr 2026"
 *
 * @param {string} dateString - Tanggal dalam format ISO (YYYY-MM-DD)
 * @returns {string} Tanggal dalam format Indonesia
 */
export function formatDateID(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
