/**
 * Utility functions untuk kalkulasi periode siklus keuangan.
 */
import { formatDateID } from './date';

/**
 * Mengubah Date object ke format string YYYY-MM-DD local time.
 *
 * @param {Date} date - Date object
 * @returns {string} Tanggal dalam format YYYY-MM-DD
 */
export function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Menghitung periode berdasarkan cycleStartDay dan offset.
 * Contoh: jika cycleStartDay = 1, offset = 0, maka periode = 1 bulan ini s/d 1 bulan depan.
 *
 * @param {number} cycleStartDay - Tanggal mulai siklus (1-28)
 * @param {number} [offset=0] - Offset periode:
 *   0 = periode aktif saat ini
 *  -1 = satu periode sebelumnya
 *  -2 = dua periode sebelumnya
 * @returns {{ start: string, end: string, startRaw: string, endRaw: string }}
 */
export function calculatePeriod(cycleStartDay, offset = 0) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + offset;

  let startDate;
  let endDate;

  if (today.getDate() >= cycleStartDay) {
    startDate = new Date(year, month, cycleStartDay);
    endDate = new Date(year, month + 1, cycleStartDay);
  } else {
    startDate = new Date(year, month - 1, cycleStartDay);
    endDate = new Date(year, month, cycleStartDay);
  }

  return {
    start: formatDateID(startDate.toISOString()),
    end: formatDateID(endDate.toISOString()),
    startRaw: toDateString(startDate),
    endRaw: toDateString(endDate),
  };
}

/**
 * Mendapatkan rentang tanggal untuk mode periode yang dipilih.
 *
 * @param {number} cycleStartDay - Tanggal mulai siklus (1-28)
 * @param {'current'|'previous'|'last3'} mode - Mode periode
 * @returns {{ startRaw: string, endRaw: string }} Rentang tanggal (YYYY-MM-DD)
 */
export function getPeriodRange(cycleStartDay, mode) {
  switch (mode) {
    case 'previous':
      return calculatePeriod(cycleStartDay, -1);
    case 'last3': {
      const p0 = calculatePeriod(cycleStartDay, 0);
      const p2 = calculatePeriod(cycleStartDay, -2);
      return { startRaw: p2.startRaw, endRaw: p0.endRaw };
    }
    case 'current':
    default:
      return calculatePeriod(cycleStartDay, 0);
  }
}
