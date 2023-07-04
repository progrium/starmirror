import { syntaxTree } from "@codemirror/language";
import { RangeSet } from '@codemirror/state';
import { Decoration } from "@codemirror/view";
import { newCollapsibleStateField } from "./collapsible-state-field";
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

  const stateField = newCollapsibleStateField(decorate);

  return [
    stateField,
  ]
};
