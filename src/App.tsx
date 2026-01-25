import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import ListEntry from "./components/ListEntry";
import type { ListItem } from "./types";

const defaultNotes = `### Lineage
- Human

### Traits
- Determined
- Curious

### Flaws
- Impulsive
`;

const defaultSkills: string[] = [];

const defaultInventory: string[] = [];

const MAX_LIST_ITEMS = 10;

type MarkdownPanelProps = {
  title: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

type InventoryListProps = {
  items: ListItem[];
  onChange: (id: string, value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
};

type ViewMode = "equipment" | "character";

const createListItem = (value = "", checked = false): ListItem => ({
  id: crypto.randomUUID(),
  value,
  checked,
});

function MarkdownPanel({
  title,
  value,
  onChange,
  className,
}: MarkdownPanelProps) {
  const [isEditing, setIsEditing] = useState(true);

  return (
    <section className={["panel", className].filter(Boolean).join(" ")}>
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

function InventoryList({
  items,
  onChange,
  onAdd,
  onRemove,
  onToggle,
}: InventoryListProps) {
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
  const [view, setView] = useState<ViewMode>("equipment");
  const [notes, setNotes] = useState(defaultNotes);
  const [skills, setSkills] = useState<ListItem[]>(
    defaultSkills.map((skill) => createListItem(skill)),
  );
  const [inventoryItems, setInventoryItems] = useState<ListItem[]>(
    defaultInventory.map((item) => createListItem(item)),
  );

  const updateInventoryItem = (id: string, value: string) => {
    setInventoryItems((prev) => {
      return prev.map((item) => (item.id === id ? { ...item, value } : item));
    });
  };

  const toggleInventoryItem = (id: string) => {
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

  const removeInventoryItem = (id: string) => {
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

  const updateSkill = (id: string, value: string) => {
    setSkills((prev) => {
      return prev.map((skill) =>
        skill.id === id ? { ...skill, value } : skill,
      );
    });
  };

  const toggleSkill = (id: string) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, checked: !skill.checked } : skill,
      ),
    );
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
  };

  return (
    <div className="app">
      <div className="sheet-controls">
        <select
          className="view-select"
          value={view}
          onChange={(event) => setView(event.target.value as ViewMode)}
          aria-label="Select view"
        >
          <option value="equipment">Skills & Equipment</option>
          <option value="character">Character View</option>
        </select>
      </div>

      <div className="sheet-frame">
        {view === "character" ? (
          <main className="inventory-view">
            <MarkdownPanel
              className="panel--plain"
              title="Character Notes"
              value={notes}
              onChange={setNotes}
            />
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
