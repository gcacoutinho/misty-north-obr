import { useEffect, useRef, useState } from "react";
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

const defaultSpells: string[] = [];

const MAX_LIST_ITEMS = 10;

type InventoryListProps = {
  items: ListItem[];
  onChange: (id: string, value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
};

type MarkdownPanelProps = {
  title: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  helpLink?: string;
  helpLabel?: string;
};

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
  textareaRef,
  helpLink,
  helpLabel = "Markdown help",
}: MarkdownPanelProps) {
  const [isEditing, setIsEditing] = useState(true);

  return (
    <section className={["panel", className].filter(Boolean).join(" ")}>
      <div className="panel__header">
        <div className="panel__title">
          <h2>{title}</h2>
          {helpLink ? (
            <a
              className="panel__help"
              href={helpLink}
              target="_blank"
              rel="noreferrer"
              title={helpLabel}
              aria-label={helpLabel}
            >
              <span className="panel__help-icon" aria-hidden="true">
                {"\u{1F6C8}"}
              </span>
            </a>
          ) : null}
        </div>
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
          ref={textareaRef}
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
    <div className="list">
      <div className="list__header">
        <h2>Equipment</h2>
        <button
          className="list__add"
          type="button"
          onClick={onAdd}
          disabled={isAtLimit}
        >
          Add item
        </button>
      </div>
      {isAtLimit ? (
        <p className="list__limit">Maximum of 10 items reached.</p>
      ) : null}
      {items.length === 0 ? (
        <p className="list__empty">No equipment yet. Add an item.</p>
      ) : (
        <ul className="list__list">
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
  const [notes, setNotes] = useState(defaultNotes);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);
  const [skills, setSkills] = useState<ListItem[]>(
    defaultSkills.map((skill) => createListItem(skill)),
  );
  const [inventoryItems, setInventoryItems] = useState<ListItem[]>(
    defaultInventory.map((item) => createListItem(item)),
  );
  const [spells, setSpells] = useState<ListItem[]>(
    defaultSpells.map((spell) => createListItem(spell)),
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

  const addSpell = () => {
    setSpells((prev) => {
      if (prev.length >= MAX_LIST_ITEMS) {
        return prev;
      }

      return [...prev, createListItem()];
    });
  };

  const updateSpell = (id: string, value: string) => {
    setSpells((prev) => {
      return prev.map((spell) =>
        spell.id === id ? { ...spell, value } : spell,
      );
    });
  };

  const toggleSpell = (id: string) => {
    setSpells((prev) =>
      prev.map((spell) =>
        spell.id === id ? { ...spell, checked: !spell.checked } : spell,
      ),
    );
  };

  const removeSpell = (id: string) => {
    setSpells((prev) => prev.filter((spell) => spell.id !== id));
  };

  useEffect(() => {
    if (!notesInputRef.current) {
      return;
    }

    notesInputRef.current.style.height = "auto";
    notesInputRef.current.style.height = `${notesInputRef.current.scrollHeight}px`;
  }, [notes]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  return (
    <div className="app">
      <div className="sheet-frame">
        <MarkdownPanel
          className="panel--plain"
          title="Notes"
          value={notes}
          onChange={handleNotesChange}
          textareaRef={notesInputRef}
          helpLink="https://commonmark.org/help/"
          helpLabel="Markdown help guide"
        />
        <section className="list">
          <div className="list__header">
            <h2>Skills</h2>
            <button
              className="list__add"
              type="button"
              onClick={addSkill}
              disabled={skills.length >= MAX_LIST_ITEMS}
            >
              Add skill
            </button>
          </div>
          {skills.length >= MAX_LIST_ITEMS ? (
            <p className="list__limit">Maximum of 10 skills reached.</p>
          ) : null}
          {skills.length === 0 ? (
            <p className="list__empty">No skills yet. Add one.</p>
          ) : (
            <ul className="list__list">
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
        <section className="list">
          <div className="list__header">
            <h2>Spells</h2>
            <button
              className="list__add"
              type="button"
              onClick={addSpell}
              disabled={spells.length >= MAX_LIST_ITEMS}
            >
              Add spell
            </button>
          </div>
          {spells.length >= MAX_LIST_ITEMS ? (
            <p className="list__limit">Maximum of 10 spells reached.</p>
          ) : null}
          {spells.length === 0 ? (
            <p className="list__empty">No spells yet. Add one.</p>
          ) : (
            <ul className="list__list">
              {spells.map((spell, index) => (
                <ListEntry
                  key={spell.id}
                  item={spell}
                  index={index}
                  placeholder="New spell"
                  itemLabel="spell"
                  onChange={updateSpell}
                  onToggle={toggleSpell}
                  onRemove={removeSpell}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
