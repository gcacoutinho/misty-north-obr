import { useState } from "react";
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

const defaultSkills = [];

const defaultInventory = [];

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

function InventoryList({ items, onChange, onAdd, onRemove }) {
  return (
    <div className="inventory">
      <div className="inventory__header">
        <h2>Equipment</h2>
        <button className="inventory__add" type="button" onClick={onAdd}>
          Add item
        </button>
      </div>
      {items.length === 0 ? (
        <p className="inventory__empty">No equipment yet. Add an item.</p>
      ) : (
        <ul>
          {items.map((item, index) => {
            return (
              <li key={`${item}-${index}`} className="inventory__item">
                <span className="inventory__number">{index + 1}.</span>
                <input
                  className="inventory__input"
                  type="text"
                  value={item}
                  onChange={(event) => onChange(index, event.target.value)}
                />
                <button
                  className="inventory__remove"
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label="Remove item"
                >
                  <span aria-hidden="true">🗑️</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("equipment");
  const [notes, setNotes] = useState(defaultNotes);
  const [skills, setSkills] = useState(defaultSkills);
  const [inventoryItems, setInventoryItems] = useState(defaultInventory);

  const updateInventoryItem = (index, value) => {
    setInventoryItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addInventoryItem = () => {
    setInventoryItems((prev) => [...prev, ""]);
  };

  const removeInventoryItem = (index) => {
    setInventoryItems((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const addSkill = () => {
    setSkills((prev) => [...prev, ""]);
  };

  const updateSkill = (index, value) => {
    setSkills((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const removeSkill = (index) => {
    setSkills((prev) => prev.filter((_, skillIndex) => skillIndex !== index));
  };

  return (
    <div className="app">
      <div className="sheet-controls">
        <select
          className="view-select"
          value={view}
          onChange={(event) => setView(event.target.value)}
          aria-label="Select view"
        >
          <option value="equipment">Skills & Equipment</option>
          <option value="character">Character View</option>
        </select>
      </div>

      <div className="sheet-frame">
        {view === "character" ? (
          <main className="sheet">
            <section className="center">
              <MarkdownPanel
                title="Character Notes"
                value={notes}
                onChange={setNotes}
              />
            </section>
          </main>
        ) : (
          <main className="inventory-view">
            <section className="skills">
              <div className="skills__header">
                <h2>Skills</h2>
                <button
                  className="skills__add"
                  type="button"
                  onClick={addSkill}
                >
                  Add skill
                </button>
              </div>
              {skills.length === 0 ? (
                <p className="skills__empty">No skills yet. Add one.</p>
              ) : (
                <ul className="skills__list">
                  {skills.map((skill, index) => (
                    <li key={`${skill}-${index}`} className="skills__item">
                      <input
                        className="skills__input"
                        type="text"
                        value={skill}
                        onChange={(event) =>
                          updateSkill(index, event.target.value)
                        }
                        placeholder="New skill"
                      />
                      <button
                        className="skills__remove"
                        type="button"
                        onClick={() => removeSkill(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <InventoryList
              items={inventoryItems}
              onChange={updateInventoryItem}
              onAdd={addInventoryItem}
              onRemove={removeInventoryItem}
            />
          </main>
        )}
      </div>
    </div>
  );
}
