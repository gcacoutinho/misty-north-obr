import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import "./App.css";
import ListEntry from "./components/ListEntry";
import type { ListItem } from "./types";

const defaultSkills: string[] = [];

const defaultInventory: string[] = [];

const defaultSpells: string[] = [];

const MAX_LIST_ITEMS = 10;

type InventoryListProps = {
  items: ListItem[];
  strings: {
    title: string;
    add: string;
    empty: string;
    limit: string;
    placeholder: string;
    itemLabel: string;
    toggleLabel: string;
    removeLabel: string;
  };
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
  helpLabel: string;
  editLabel: string;
  previewLabel: string;
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
  helpLabel,
  editLabel,
  previewLabel,
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
          {isEditing ? previewLabel : editLabel}
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
  strings,
  onChange,
  onAdd,
  onRemove,
  onToggle,
}: InventoryListProps) {
  const isAtLimit = items.length >= MAX_LIST_ITEMS;

  return (
    <div className="list">
      <div className="list__header">
        <h2>{strings.title}</h2>
        <button
          className="list__add"
          type="button"
          onClick={onAdd}
          disabled={isAtLimit}
        >
          {strings.add}
        </button>
      </div>
      {isAtLimit ? (
        <p className="list__limit">{strings.limit}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="list__empty">{strings.empty}</p>
      ) : (
        <ul className="list__list">
          {items.map((item, index) => (
            <ListEntry
              key={item.id}
              item={item}
              index={index}
              placeholder={strings.placeholder}
              toggleLabel={strings.toggleLabel}
              removeLabel={strings.removeLabel}
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
  const { t } = useTranslation();
  const [notes, setNotes] = useState(() => t("notes.defaultContent"));
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

  const equipmentStrings = {
    title: t("lists.equipment.title"),
    add: t("lists.equipment.add"),
    empty: t("lists.equipment.empty"),
    limit: t("lists.equipment.limit"),
    placeholder: t("lists.equipment.placeholder"),
    itemLabel: t("lists.equipment.itemLabel"),
    toggleLabel: t("listEntry.toggleLabel", {
      itemLabel: t("lists.equipment.itemLabel"),
    }),
    removeLabel: t("listEntry.removeLabel", {
      itemLabel: t("lists.equipment.itemLabel"),
    }),
  };
  const skillsStrings = {
    title: t("lists.skills.title"),
    add: t("lists.skills.add"),
    empty: t("lists.skills.empty"),
    limit: t("lists.skills.limit"),
    placeholder: t("lists.skills.placeholder"),
    itemLabel: t("lists.skills.itemLabel"),
    toggleLabel: t("listEntry.toggleLabel", {
      itemLabel: t("lists.skills.itemLabel"),
    }),
    removeLabel: t("listEntry.removeLabel", {
      itemLabel: t("lists.skills.itemLabel"),
    }),
  };
  const spellsStrings = {
    title: t("lists.spells.title"),
    add: t("lists.spells.add"),
    empty: t("lists.spells.empty"),
    limit: t("lists.spells.limit"),
    placeholder: t("lists.spells.placeholder"),
    itemLabel: t("lists.spells.itemLabel"),
    toggleLabel: t("listEntry.toggleLabel", {
      itemLabel: t("lists.spells.itemLabel"),
    }),
    removeLabel: t("listEntry.removeLabel", {
      itemLabel: t("lists.spells.itemLabel"),
    }),
  };

  return (
    <div className="app">
      <div className="sheet-frame">
        <MarkdownPanel
          className="panel--plain"
          title={t("notes.title")}
          value={notes}
          onChange={handleNotesChange}
          textareaRef={notesInputRef}
          helpLink="https://commonmark.org/help/"
          helpLabel={t("markdown.helpLabel")}
          editLabel={t("markdown.editLabel")}
          previewLabel={t("markdown.previewLabel")}
        />
        <section className="list">
          <div className="list__header">
            <h2>{skillsStrings.title}</h2>
            <button
              className="list__add"
              type="button"
              onClick={addSkill}
              disabled={skills.length >= MAX_LIST_ITEMS}
            >
              {skillsStrings.add}
            </button>
          </div>
          {skills.length >= MAX_LIST_ITEMS ? (
            <p className="list__limit">{skillsStrings.limit}</p>
          ) : null}
          {skills.length === 0 ? (
            <p className="list__empty">{skillsStrings.empty}</p>
          ) : (
            <ul className="list__list">
              {skills.map((skill, index) => (
                <ListEntry
                  key={skill.id}
                  item={skill}
                  index={index}
                  placeholder={skillsStrings.placeholder}
                  toggleLabel={skillsStrings.toggleLabel}
                  removeLabel={skillsStrings.removeLabel}
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
          strings={equipmentStrings}
          onChange={updateInventoryItem}
          onAdd={addInventoryItem}
          onRemove={removeInventoryItem}
          onToggle={toggleInventoryItem}
        />
        <section className="list">
          <div className="list__header">
            <h2>{spellsStrings.title}</h2>
            <button
              className="list__add"
              type="button"
              onClick={addSpell}
              disabled={spells.length >= MAX_LIST_ITEMS}
            >
              {spellsStrings.add}
            </button>
          </div>
          {spells.length >= MAX_LIST_ITEMS ? (
            <p className="list__limit">{spellsStrings.limit}</p>
          ) : null}
          {spells.length === 0 ? (
            <p className="list__empty">{spellsStrings.empty}</p>
          ) : (
            <ul className="list__list">
              {spells.map((spell, index) => (
                <ListEntry
                  key={spell.id}
                  item={spell}
                  index={index}
                  placeholder={spellsStrings.placeholder}
                  toggleLabel={spellsStrings.toggleLabel}
                  removeLabel={spellsStrings.removeLabel}
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
