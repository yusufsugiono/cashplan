import SettingsMenuItem from './SettingsMenuItem';

/**
 * SettingsMenu — daftar menu pengaturan.
 *
 * Props:
 * - items: array of { label: string, onClick: function }
 */
export default function SettingsMenu({ items }) {
  return (
    <div className="mx-3 mt-4 border border-solid border-[var(--color-border)] rounded-md overflow-hidden">
      {items.map((item) => (
        <SettingsMenuItem key={item.label} label={item.label} onClick={item.onClick} />
      ))}
    </div>
  );
}
