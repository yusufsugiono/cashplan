/**
 * PeriodSelector — Komponen untuk memilih periode statistik.
 * Menggunakan pola PillButtonGroup + PillButton yang sudah ada.
 *
 * Props:
 * - selected: string, nilai periode yang aktif ('current' | 'previous' | 'last3')
 * - onChange: (period: string) => void, callback ketika periode berubah
 */
import PillButtonGroup from '../../components/ui/PillButtonGroup';
import PillButton from '../../components/ui/PillButton';

const OPTIONS = [
  { value: 'current', label: 'Periode Ini' },
  { value: 'previous', label: 'Periode Lalu' },
  { value: 'last3', label: '3 Periode' },
];

export default function PeriodSelector({ selected, onChange }) {
  return (
    <PillButtonGroup>
      {OPTIONS.map((opt) => (
        <PillButton
          key={opt.value}
          isActive={selected === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </PillButton>
      ))}
    </PillButtonGroup>
  );
}
