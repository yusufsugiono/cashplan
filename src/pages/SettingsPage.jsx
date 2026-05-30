import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

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

/** Cycle tema: system → light → dark → system */
function getNextTheme(current) {
  const cycle = ['light', 'dark'];
  const currentIndex = cycle.indexOf(current);
  return cycle[(currentIndex + 1) % cycle.length];
}

/** Label tema untuk ditampilkan ke user */
function getThemeLabel(theme) {
  const labels = { light: 'Terang', dark: 'Gelap' };
  return labels[theme] || 'Sistem';
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

  // Buat link download sementara
  const link = document.createElement('a');
  link.href = url;
  link.download = `finance-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
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

        // Tulis setiap key ke localStorage
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

        alert('Data berhasil diimport. Halaman akan dimuat ulang.');
        window.location.reload();
      } catch {
        alert('Gagal membaca file. Pastikan file berformat JSON yang valid.');
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

/** Reset semua data di localStorage */
function handleReset() {
  const confirmed = window.confirm(
    'Yakin ingin menghapus semua data? Tindakan ini tidak bisa dibatalkan.',
  );
  if (!confirmed) return;

  localStorage.clear();
  alert('Semua data telah dihapus. Halaman akan dimuat ulang.');
  window.location.reload();
}

/** Tampilkan info tentang aplikasi */
function handleAbout() {
  alert('Finance Tracker v0.1.0\nDibuat oleh Yusuf Sugiono\nAplikasi pencatat keuangan pribadi.');
}

/** Bagikan aplikasi via Web Share API atau fallback copy */
async function handleShare() {
  const shareData = {
    title: 'Finance Tracker',
    text: 'Aplikasi pencatat keuangan pribadi',
    url: window.location.origin,
  };

  // Cek apakah Web Share API tersedia
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // User membatalkan share — tidak perlu error handling
    }
  } else {
    // Fallback: copy link ke clipboard
    try {
      await navigator.clipboard.writeText(window.location.origin);
      alert('Link berhasil disalin ke clipboard!');
    } catch {
      alert('Gagal menyalin link. Silakan salin manual: ' + window.location.origin);
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
