import { syntaxTree } from "@codemirror/language";
import { RangeSet, StateField } from '@codemirror/state';
import {
  Decoration,
  EditorView
} from "@codemirror/view";
import { ReplacementWidget } from "./replacement-widget";

export const inlineLinks = () => {
  const linkRegex = /\[.*\]\((?<url>.*)\)/;

  const replacementDecoration = params => Decoration.replace({
    widget: new ReplacementWidget(params),
    side: -1,
    block: false,
  });

  const decorate = state => {
    const widgets = [];

    syntaxTree(state).iterate({
      enter: ({ type, from, to }) => {
        if (type.name === "Link") {
          const result = linkRegex.exec(state.doc.sliceString(from, to));

          if (result && result.groups && result.groups.url) {
            widgets.push(replacementDecoration({ url: result.groups.url }).range(from, to));
          }
        }
      }
    });

    return widgets.length > 0 ? RangeSet.of(widgets) : Decoration.none;
  };

  const linkField = StateField.define({
    create(state) {
      return decorate(state);
    },
    update(links, transaction) {
      if (transaction.docChanged) {
        return decorate(transaction.state);
      }

      return links.map(transaction.changes);
    },
    provide(field) {
      return EditorView.decorations.from(field);
    }
  });

  return [
    linkField,
  ]
};
