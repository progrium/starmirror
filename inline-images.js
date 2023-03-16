import { syntaxTree } from "@codemirror/language";
import { RangeSet, StateField } from '@codemirror/state';
import {
  Decoration,
  EditorView,
  WidgetType
} from "@codemirror/view";
import { ReplacementWidget } from "./replacement-widget";

class ImageWidget extends WidgetType {
  constructor({ url }) {
    super();
    this.url = url;
  }

  eq(imageWidget) {
    return imageWidget.url === this.url;
  }

  toDOM() {
    const container = document.createElement("div");
    const figure = container.appendChild(document.createElement("figure"));
    const image = figure.appendChild(document.createElement("img"));

    container.setAttribute("aria-hidden", "true");
    container.className = "cm-image-container";
    figure.className = "cm-image-figure";
    image.className = "cm-image-img";
    image.src = this.url;

    container.style.backgroundColor = "var(--hybrid-mde-images-bg-color, rgba(0, 0, 0, 0.3))";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.padding = "1rem";
    container.style.marginBottom = "0.5rem";
    container.style.marginTop = "0.5rem";
    container.style.maxWidth = "100%";

    figure.style.margin = "0";

    image.style.display = "block";
    image.style.maxHeight = "var(--hybrid-mde-images-max-height, 20rem)";
    image.style.maxWidth = "100%";
    image.style.width = "100%";

    return container;
  }
}

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
    const widgets = [];

    syntaxTree(state).iterate({
      enter: ({ type, from, to }) => {
        if (type.name === "Image") {
          const result = imageRegex.exec(state.doc.sliceString(from, to));

          if (result && result.groups && result.groups.url) {
            widgets.push(imageDecoration({ url: result.groups.url }).range(state.doc.lineAt(from).from));

            // Comment out this next line to remove the link emoji replacement.
            widgets.push(replacementDecoration({ url: result.groups.url }).range(from, to));
          }
        }
      }
    });

    return widgets.length > 0 ? RangeSet.of(widgets) : Decoration.none;
  };

  const imagesField = StateField.define({
    create(state) {
      return decorate(state);
    },
    update(images, transaction) {
      if (transaction.docChanged) {
        return decorate(transaction.state);
      }

      // I'm trying to write something here to determine where the cursor is
      // at this point to dynamically show/hide widgets.

      return images.map(transaction.changes);
    },
    provide(field) {
      // Maybe using EditorView.decorations.computeN would be helpful here
      // but so far I haven't been able tog get it to work.
      return EditorView.decorations.from(field);
    }
  });

  return [
    imagesField,
  ]
};
