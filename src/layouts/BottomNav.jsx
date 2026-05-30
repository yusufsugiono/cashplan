import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaHouse,
  FaWallet,
  FaClockRotateLeft,
  FaGear,
  FaArrowRightArrowLeft,
} from 'react-icons/fa6';

import { ROUTES } from '../constants/routes';

/**
 * Konfigurasi menu bottom navigation.
 * Dipisah dari JSX agar mudah ditambah/diubah tanpa menyentuh struktur render.
 *
 * Posisi FAB (+) di tengah diatur dengan slot kosong (null) di index 2.
 */
const NAV_ITEMS = [
  { icon: FaHouse, label: 'Beranda', route: ROUTES.HOME },
  { icon: FaWallet, label: 'Anggaran', route: ROUTES.BUDGETING },
  null, // slot untuk FAB button di tengah
  { icon: FaClockRotateLeft, label: 'Riwayat', route: ROUTES.HISTORY },
  { icon: FaGear, label: 'Pengaturan', route: ROUTES.SETTINGS },
];

/**
 * BottomNav — navigasi bawah yang tampil di semua halaman utama.
 *
 * Terdiri dari 4 menu icon + 1 FAB button di tengah untuk tambah transaksi.
 * Menu yang aktif ditandai dengan warna berbeda berdasarkan current route.
 */
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)] border-t border-[var(--color-border)]">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item, index) => {
          // Render FAB button di posisi tengah (slot null)
          if (item === null) {
            return (
              <button
                key="fab"
                onClick={() => navigate(ROUTES.ADD_TRANSACTION)}
                aria-label="Tambah transaksi baru"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-btn-submit-bg)] text-[var(--color-btn-submit-text)] shadow-md -mt-5"
              >
                <FaArrowRightArrowLeft className="text-lg" />
              </button>
            );
          }

          const isActive = location.pathname === item.route;
          const Icon = item.icon;

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              aria-label={item.label}
              className={`flex flex-col items-center gap-1 text-xs px-3 py-1 ${
                isActive ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)]'
              }`}
            >
              <Icon className="text-xl" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
