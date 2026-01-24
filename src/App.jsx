import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const defaultNotes = `### Lineage
- Human

### Traits
- Determined
- Curious

### Flaws
- Impulsive
`;

const defaultInventory = [
  "Athletics",
  "Arcana",
  "Stealth",
  "Medicine",
  "Persuasion",
  "Investigation",
  "Perception",
  "Survival",
  "Deception",
  "History",
  "Traveler's pack",
  "Iron dagger",
  "Map case",
  "Healing draft",
  "Rope (50ft)",
  "Lantern",
  "Flint & steel",
  "Bandages",
  "Coin pouch",
  "Spare cloak",
];

function MarkdownPanel({ title, value, onChange }) {
  const [isEditing, setIsEditing] = useState(true);

  return (
    <section className="panel">
      <div className="panel__header">
        <h2>{title}</h2>
        <button
          className="panel__toggle"
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "Preview" : "Edit"}
        </button>
      </div>
      {isEditing ? (
        <textarea
          className="panel__input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <div className="panel__preview">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}

function PhaseTracker({ phases, activePhase, onPhaseChange }) {
  return (
    <section className="phases-block">
      <div className="phases-block__header">
        <h2>Phases</h2>
        <span className="phases-block__label">Check the active phase</span>
      </div>
      <div className="phases">
        {phases.map((phase) => (
          <button
            key={phase}
            type="button"
            className={`phase ${activePhase === phase ? "phase--active" : ""}`}
            onClick={() => onPhaseChange(phase)}
          >
            {phase}
          </button>
        ))}
      </div>
    </section>
  );
}

function InventoryList({ items, unavailable, onToggle, onChange }) {
  return (
    <div className="inventory">
      <h2>Inventory</h2>
      <ul>
        {items.map((item, index) => {
          const isUnavailable = unavailable.has(index);
          return (
            <li key={`${item}-${index}`} className="inventory__item">
              <span className="inventory__number">{index + 1}.</span>
              <input
                className={`inventory__input ${
                  isUnavailable ? "inventory__input--disabled" : ""
                }`}
                type="text"
                value={item}
                onChange={(event) => onChange(index, event.target.value)}
              />
              <label className="inventory__toggle">
                <input
                  type="checkbox"
                  checked={isUnavailable}
                  onChange={() => onToggle(index)}
                />
                <span>Used</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("equipment");
  const [notes, setNotes] = useState(defaultNotes);
  const [activePhase, setActivePhase] = useState(1);
  const [inventoryItems, setInventoryItems] = useState(defaultInventory);
  const [unavailableItems, setUnavailableItems] = useState(new Set());

  const phases = useMemo(() => [1, 2, 3, 4, 5], []);

  const toggleInventory = (index) => {
    setUnavailableItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const updateInventoryItem = (index, value) => {
    setInventoryItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Character Sheet</h1>
          <p>Switch between character details and gear.</p>
        </div>
        <label className="view-select">
          <span>View</span>
          <select value={view} onChange={(event) => setView(event.target.value)}>
            <option value="equipment">Skills & Equipment</option>
            <option value="character">Character View</option>
          </select>
        </label>
      </header>

      <div className="sheet-frame">
        {view === "character" ? (
          <main className="sheet">
            <section className="center">
              <PhaseTracker
                phases={phases}
                activePhase={activePhase}
                onPhaseChange={setActivePhase}
              />
              <MarkdownPanel
                title="Character Notes"
                value={notes}
                onChange={setNotes}
              />
            </section>
          </main>
        ) : (
          <main className="inventory-view">
            <InventoryList
              items={inventoryItems}
              unavailable={unavailableItems}
              onToggle={toggleInventory}
              onChange={updateInventoryItem}
            />
          </main>
        )}
      </div>
    </div>
  );
}
