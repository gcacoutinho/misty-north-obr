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

const createListItem = (value = "", checked = false) => ({
  id: crypto.randomUUID(),
  value,
  checked,
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

function ListEntry({
  item,
  index,
  placeholder,
  itemLabel,
  onChange,
  onToggle,
  onRemove,
}) {
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

function InventoryList({ items, onChange, onAdd, onRemove, onToggle }) {
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
        <ul className="inventory__list">
          {items.map((item, index) => (
            <ListEntry
              key={item.id}
              item={item}
              index={index}
              placeholder="New item"
              itemLabel="item"
              onChange={onChange}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          ))}
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

  const toggleInventoryItem = (id) => {
    setInventoryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
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

  const toggleSkill = (id) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, checked: !skill.checked } : skill,
      ),
    );
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
                  {skills.map((skill, index) => (
                    <ListEntry
                      key={skill.id}
                      item={skill}
                      index={index}
                      placeholder="New skill"
                      itemLabel="skill"
                      onChange={updateSkill}
                      onToggle={toggleSkill}
                      onRemove={removeSkill}
                    />
                  ))}
                </ul>
              )}
            </section>
            <InventoryList
              items={inventoryItems}
              onChange={updateInventoryItem}
              onAdd={addInventoryItem}
              onRemove={removeInventoryItem}
              onToggle={toggleInventoryItem}
            />
          </main>
        )}
      </div>
    </div>
  );
}
