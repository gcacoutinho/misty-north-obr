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

const MAX_LIST_ITEMS = 10;

const createListItem = (value = "") => ({
  id: crypto.randomUUID(),
  value,
});

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
  const isAtLimit = items.length >= MAX_LIST_ITEMS;

  return (
    <div className="inventory">
      <div className="inventory__header">
        <h2>Equipment</h2>
        <button
          className="inventory__add"
          type="button"
          onClick={onAdd}
          disabled={isAtLimit}
        >
          Add item
        </button>
      </div>
      {isAtLimit ? (
        <p className="inventory__limit">Maximum of 10 items reached.</p>
      ) : null}
      {items.length === 0 ? (
        <p className="inventory__empty">No equipment yet. Add an item.</p>
      ) : (
        <ul>
          {items.map((item, index) => {
            return (
              <li key={item.id} className="inventory__item">
                <span className="inventory__number">{index + 1}.</span>
                <input
                  className="inventory__input"
                  type="text"
                  value={item.value}
                  onChange={(event) => onChange(item.id, event.target.value)}
                />
                <button
                  className="inventory__remove"
                  type="button"
                  onClick={() => onRemove(item.id)}
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
  const [skills, setSkills] = useState(
    defaultSkills.map((skill) => createListItem(skill)),
  );
  const [inventoryItems, setInventoryItems] = useState(
    defaultInventory.map((item) => createListItem(item)),
  );

  const updateInventoryItem = (id, value) => {
    setInventoryItems((prev) => {
      return prev.map((item) => (item.id === id ? { ...item, value } : item));
    });
  };

  const addInventoryItem = () => {
    setInventoryItems((prev) => {
      if (prev.length >= MAX_LIST_ITEMS) {
        return prev;
      }

      return [...prev, createListItem()];
    });
  };

  const removeInventoryItem = (id) => {
    setInventoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addSkill = () => {
    setSkills((prev) => {
      if (prev.length >= MAX_LIST_ITEMS) {
        return prev;
      }

      return [...prev, createListItem()];
    });
  };

  const updateSkill = (id, value) => {
    setSkills((prev) => {
      return prev.map((skill) =>
        skill.id === id ? { ...skill, value } : skill,
      );
    });
  };

  const removeSkill = (id) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
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
                  disabled={skills.length >= MAX_LIST_ITEMS}
                >
                  Add skill
                </button>
              </div>
              {skills.length >= MAX_LIST_ITEMS ? (
                <p className="skills__limit">Maximum of 10 skills reached.</p>
              ) : null}
              {skills.length === 0 ? (
                <p className="skills__empty">No skills yet. Add one.</p>
              ) : (
                <ul className="skills__list">
                  {skills.map((skill) => (
                    <li key={skill.id} className="skills__item">
                      <input
                        className="skills__input"
                        type="text"
                        value={skill.value}
                        onChange={(event) =>
                          updateSkill(skill.id, event.target.value)
                        }
                        placeholder="New skill"
                      />
                      <button
                        className="skills__remove"
                        type="button"
                        onClick={() => removeSkill(skill.id)}
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
