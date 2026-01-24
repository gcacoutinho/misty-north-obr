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

const defaultSkills = [
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
  );
}

function SkillsList({ skills, disabledSkills, onToggle }) {
  return (
    <div className="skills">
      <h3>Skills & Equipment</h3>
      <ul>
        {skills.map((skill, index) => {
          const isDisabled = disabledSkills.has(index);
          return (
            <li key={`${skill}-${index}`}>
              <label className={`skill ${isDisabled ? "skill--disabled" : ""}`}>
                <input
                  type="checkbox"
                  checked={isDisabled}
                  onChange={() => onToggle(index)}
                />
                <span>{skill}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function InventoryList({ items, unavailable, onToggle }) {
  return (
    <div className="inventory">
      <h2>Inventory</h2>
      <ul>
        {items.map((item, index) => {
          const isUnavailable = unavailable.has(index);
          return (
            <li key={`${item}-${index}`} className="inventory__item">
              <span className="inventory__number">{index + 1}.</span>
              <span
                className={`inventory__text ${
                  isUnavailable ? "inventory__text--disabled" : ""
                }`}
              >
                {item}
              </span>
              <label className="inventory__toggle">
                <input
                  type="checkbox"
                  checked={isUnavailable}
                  onChange={() => onToggle(index)}
                />
                <span>Unavailable</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("character");
  const [leftNotes, setLeftNotes] = useState(defaultNotes);
  const [rightNotes, setRightNotes] = useState(defaultNotes);
  const [activePhase, setActivePhase] = useState(1);
  const [disabledSkills, setDisabledSkills] = useState(new Set());
  const [unavailableItems, setUnavailableItems] = useState(new Set());

  const phases = useMemo(() => [1, 2, 3, 4, 5], []);

  const toggleSkill = (index) => {
    setDisabledSkills((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

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

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Character Sheet</h1>
          <p>Switch between character notes and inventory tracking.</p>
        </div>
        <label className="view-select">
          <span>View</span>
          <select value={view} onChange={(event) => setView(event.target.value)}>
            <option value="character">Character</option>
            <option value="inventory">Inventory</option>
          </select>
        </label>
      </header>

      {view === "character" ? (
        <main className="sheet">
          <MarkdownPanel
            title="Left Notes"
            value={leftNotes}
            onChange={setLeftNotes}
          />
          <section className="center">
            <PhaseTracker
              phases={phases}
              activePhase={activePhase}
              onPhaseChange={setActivePhase}
            />
            <div className="portrait">
              <span>Portrait</span>
            </div>
            <SkillsList
              skills={defaultSkills}
              disabledSkills={disabledSkills}
              onToggle={toggleSkill}
            />
          </section>
          <MarkdownPanel
            title="Right Notes"
            value={rightNotes}
            onChange={setRightNotes}
          />
        </main>
      ) : (
        <main className="inventory-view">
          <InventoryList
            items={defaultInventory}
            unavailable={unavailableItems}
            onToggle={toggleInventory}
          />
        </main>
      )}
    </div>
  );
}
