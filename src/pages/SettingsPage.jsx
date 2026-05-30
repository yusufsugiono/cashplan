import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import Swal from 'sweetalert2';

import AppBar from '../layouts/AppBar';
import BottomNav from '../layouts/BottomNav';
import SettingsMenu from '../features/settings/SettingsMenu';
import ProfileModal from '../features/settings/ProfileModal';
import CycleModal from '../features/settings/CycleModal';
import { loadSettings, saveSettings, STORAGE_KEYS } from '../lib/storage';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Terapkan tema ke document berdasarkan pilihan user */
function applyTheme(theme) {
  const html = document.documentElement;

  if (theme === 'light') {
    html.setAttribute('data-theme', 'light');
  } else if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
  } else {
    // 'system' — hapus attribute agar CSS media query yang berlaku
    html.removeAttribute('data-theme');
  }
}

/** Cycle tema: light → dark → light */
function getNextTheme(current) {
  const cycle = ['light', 'dark'];
  const currentIndex = cycle.indexOf(current);
  return cycle[(currentIndex + 1) % cycle.length];
}

/** Label tema untuk ditampilkan ke user */
function getThemeLabel(theme) {
  const labels = { light: 'Terang', dark: 'Gelap' };
  return labels[theme] || 'Terang';
}

/** Export semua data localStorage sebagai file JSON */
function handleExport() {
  const data = {
    [STORAGE_KEYS.TRANSACTIONS]: JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]',
    ),
    [STORAGE_KEYS.BUDGETS]: JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || '[]'),
    [STORAGE_KEYS.SETTINGS]: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}'),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `cashplan-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);

  Swal.fire({
    icon: 'success',
    title: 'Export Berhasil',
    text: 'File backup telah diunduh.',
    confirmButtonColor: '#00ADB5',
  });
}

/** Import data dari file JSON yang dipilih user */
function handleImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (data[STORAGE_KEYS.TRANSACTIONS]) {
          localStorage.setItem(
            STORAGE_KEYS.TRANSACTIONS,
            JSON.stringify(data[STORAGE_KEYS.TRANSACTIONS]),
          );
        }
        if (data[STORAGE_KEYS.BUDGETS]) {
          localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(data[STORAGE_KEYS.BUDGETS]));
        }
        if (data[STORAGE_KEYS.SETTINGS]) {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data[STORAGE_KEYS.SETTINGS]));
        }

        Swal.fire({
          icon: 'success',
          title: 'Import Berhasil',
          text: 'Data berhasil diimport. Halaman akan dimuat ulang.',
          confirmButtonColor: '#00ADB5',
        }).then(() => {
          window.location.reload();
        });
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Import Gagal',
          text: 'Gagal membaca file. Pastikan file berformat JSON yang valid.',
          confirmButtonColor: '#00ADB5',
        });
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

/** Reset semua data di localStorage */
async function handleReset() {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Reset Data',
    text: 'Yakin ingin menghapus semua data? Tindakan ini tidak bisa dibatalkan.',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
  });

  if (!result.isConfirmed) return;

  localStorage.clear();

  Swal.fire({
    icon: 'success',
    title: 'Data Dihapus',
    text: 'Semua data telah dihapus. Halaman akan dimuat ulang.',
    confirmButtonColor: '#00ADB5',
  }).then(() => {
    window.location.reload();
  });
}

/** Tampilkan info tentang aplikasi */
function handleAbout() {
  Swal.fire({
    title: 'CashPlan',
    html: `
      <p style="margin-bottom: 8px;">Versi 0.1.0</p>
      <p style="margin-bottom: 8px;">Dibuat oleh Yusuf Sugiono</p>
      <p style="color: #6b7280; font-size: 14px;">Alur Uang Terjaga, Masa Depan Terencana.</p>
    `,
    confirmButtonColor: '#00ADB5',
  });
}

/** Bagikan aplikasi via Web Share API atau fallback copy */
async function handleShare() {
  const shareData = {
    title: 'CashPlan',
    text: 'Alur Uang Terjaga, Masa Depan Terencana.',
    url: window.location.origin,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // User membatalkan share — tidak perlu error handling
    }
  } else {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      Swal.fire({
        icon: 'success',
        title: 'Link Disalin',
        text: 'Link berhasil disalin ke clipboard!',
        confirmButtonColor: '#00ADB5',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyalin',
        text: 'Gagal menyalin link. Silakan salin manual: ' + window.location.origin,
        confirmButtonColor: '#00ADB5',
      });
    }
  }
}

// ─── Komponen ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(() => loadSettings());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCycleModal, setShowCycleModal] = useState(false);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleSaveProfile(newName) {
    const updated = { ...settings, userName: newName };
    setSettings(updated);
    saveSettings(updated);
    setShowProfileModal(false);
  }

  function handleToggleTheme() {
    const nextTheme = getNextTheme(settings.theme);
    const updated = { ...settings, theme: nextTheme };
    setSettings(updated);
    saveSettings(updated);
    applyTheme(nextTheme);
  }

  function handleSaveCycle(newDay) {
    const updated = { ...settings, cycleStartDay: newDay };
    setSettings(updated);
    saveSettings(updated);
    setShowCycleModal(false);
  }

  // ─── Menu items ────────────────────────────────────────────────────────────

  const menuItems = [
    { label: 'Ubah Nama', onClick: () => setShowProfileModal(true) },
    { label: `Ubah Tema (${getThemeLabel(settings.theme)})`, onClick: handleToggleTheme },
    { label: 'Ubah Siklus Penghitungan', onClick: () => setShowCycleModal(true) },
    { label: 'Export Data', onClick: handleExport },
    { label: 'Import Data', onClick: handleImport },
    { label: 'Reset Data', onClick: handleReset },
    { label: 'Tentang', onClick: handleAbout },
    { label: 'Bagikan', onClick: handleShare },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="pb-16">
      <AppBar icon={FaArrowLeft} onBack={() => navigate(-1)}>
        Pengaturan
      </AppBar>

      <SettingsMenu items={menuItems} />

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal
          currentName={settings.userName}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showCycleModal && (
        <CycleModal
          currentDay={settings.cycleStartDay}
          onSave={handleSaveCycle}
          onClose={() => setShowCycleModal(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}
