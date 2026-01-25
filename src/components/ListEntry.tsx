import type { ListItem } from "../types";

type ListEntryProps = {
  item: ListItem;
  index: number;
  placeholder: string;
  itemLabel: string;
  onChange: (id: string, value: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function ListEntry({
  item,
  index,
  placeholder,
  itemLabel,
  onChange,
  onToggle,
  onRemove,
}: ListEntryProps) {
  return (
    <li className="list-entry">
      <span className="list-entry__number">{index + 1}.</span>
      <input
        className={`list-entry__input${
          item.checked ? " list-entry__input--checked" : ""
        }`}
        type="text"
        value={item.value}
        onChange={(event) => onChange(item.id, event.target.value)}
        placeholder={placeholder}
      />
      <div className="list-entry__actions">
        <label className="list-entry__toggle">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => onToggle(item.id)}
            aria-label={`Mark ${itemLabel} complete`}
          />
        </label>
        <button
          className="list-entry__remove"
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${itemLabel}`}
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>
    </li>
  );
}
