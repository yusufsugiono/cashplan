import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';

export default function CashflowForm({ mode }) {
  const inputConfig = [
    {
      id: 'amount',
      type: 'text',
      label: mode === 'EXPENSE' ? 'Expense Amount' : 'Income Amount',
      inputMode: 'tel',
    },
    {
      id: 'description',
      type: 'text',
      label: 'Description',
    },
    {
      id: 'date',
      type: 'date',
      label: 'Date',
    },
  ];

  const categoryOptions = mode === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <form className="mt-5 mx-3 border border-solid border-[var(--color-ring)] rounded-md p-2">
      {inputConfig.map((item) => {
        const { id, type, label } = item;
        return (
          <Input
            key={id}
            id={id}
            type={type}
            label={label}
            {...(item.inputMode && { inputMode: item.inputMode })}
          />
        );
      })}

      <Select
        id="category"
        label={mode === 'EXPENSE' ? 'Expense Category' : 'Income Category'}
        options={categoryOptions}
      />

      <div className="p-2 bg-[var(--color-bg)] border-t border-[var(--color-border)] z-10">
        <button
          type="submit"
          className="block w-full bg-[var(--color-btn-submit-bg)] text-[var(--color-btn-submit-text)] h-[40px] rounded-md font-medium"
        >
          Save
        </button>
      </div>
    </form>
  );
}
