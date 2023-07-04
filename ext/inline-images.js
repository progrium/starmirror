import { syntaxTree } from "@codemirror/language";
import { RangeSet } from '@codemirror/state';
import { Decoration } from "@codemirror/view";

import { newCollapsibleStateField } from "./collapsible-state-field";
import { ImageWidget } from "./image-widget";
import { ReplacementWidget } from "./replacement-widget";

export const inlineImages = () => {
  const imageRegex = /!\[.*\]\((?<url>.*)\)/;

  const imageDecoration = imageWidgetParams => Decoration.widget({
    widget: new ImageWidget(imageWidgetParams),
    side: -1,
    block: true
  });

  const replacementDecoration = imageWidgetParams => Decoration.replace({
    widget: new ReplacementWidget(imageWidgetParams),
    side: -1,
    block: false,
  });

  const decorate = state => {
    const decorations = [];

    syntaxTree(state).iterate({
      enter: ({ type, from, to }) => {
        if (type.name === "Image") {
          const result = imageRegex.exec(state.doc.sliceString(from, to));

          if (result && result.groups && result.groups.url) {
            decorations.push(imageDecoration({ url: result.groups.url }).range(state.doc.lineAt(from).from));
            decorations.push(replacementDecoration({ url: result.groups.url }).range(from, to));
          }
        }
      }
    });

    return decorations.length > 0 ? RangeSet.of(decorations) : Decoration.none;
  };

  const stateField = newCollapsibleStateField(decorate);

  return [
    stateField,
  ]
};
