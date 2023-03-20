import { WidgetType } from "@codemirror/view";

export class ImageWidget extends WidgetType {
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
