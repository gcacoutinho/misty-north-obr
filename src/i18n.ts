import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "pt-BR"],
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          errors: {
            rootNotFound: "Root element not found",
          },
          markdown: {
            editLabel: "Edit",
            previewLabel: "Preview",
            helpLabel: "Markdown help",
          },
          notes: {
            title: "Notes",
            defaultContent: `### Lineage
- Human

### Traits
- Determined
- Curious

### Flaws
- Impulsive
`,
          },
          lists: {
            equipment: {
              title: "Equipment",
              add: "Add item",
              empty: "No equipment yet. Add an item.",
              limit: "Maximum of 10 items reached.",
              placeholder: "New item",
              itemLabel: "item",
            },
            skills: {
              title: "Skills",
              add: "Add skill",
              empty: "No skills yet. Add one.",
              limit: "Maximum of 10 skills reached.",
              placeholder: "New skill",
              itemLabel: "skill",
            },
            spells: {
              title: "Spells",
              add: "Add spell",
              empty: "No spells yet. Add one.",
              limit: "Maximum of 10 spells reached.",
              placeholder: "New spell",
              itemLabel: "spell",
            },
          },
          listEntry: {
            toggleLabel: "Mark {{itemLabel}} complete",
            removeLabel: "Remove {{itemLabel}}",
          },
        },
      },
      "pt-BR": {
        translation: {
          errors: {
            rootNotFound: "Elemento raiz não encontrado",
          },
          markdown: {
            editLabel: "Editar",
            previewLabel: "Visualizar",
            helpLabel: "Ajuda do Markdown",
          },
          notes: {
            title: "Anotações",
            defaultContent: `### Linhagem
- Humano

### Traços
- Determinado
- Curioso

### Defeitos
- Impulsivo
`,
          },
          lists: {
            equipment: {
              title: "Equipamento",
              add: "Adicionar item",
              empty: "Nenhum equipamento ainda. Adicione um item.",
              limit: "Máximo de 10 itens atingido.",
              placeholder: "Novo item",
              itemLabel: "item",
            },
            skills: {
              title: "Perícias",
              add: "Adicionar perícia",
              empty: "Nenhuma perícia ainda. Adicione uma.",
              limit: "Máximo de 10 perícias atingido.",
              placeholder: "Nova perícia",
              itemLabel: "perícia",
            },
            spells: {
              title: "Magias",
              add: "Adicionar magia",
              empty: "Nenhuma magia ainda. Adicione uma.",
              limit: "Máximo de 10 magias atingido.",
              placeholder: "Nova magia",
              itemLabel: "magia",
            },
          },
          listEntry: {
            toggleLabel: "Marcar {{itemLabel}} como concluído",
            removeLabel: "Remover {{itemLabel}}",
          },
        },
      },
    },
  });
