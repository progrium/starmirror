import { WidgetType } from "@codemirror/view";

export class ReplacementWidget extends WidgetType {
  constructor({ url }) {
    super();
    this.url = url;
  }

  eq(replacementWidget) {
    return replacementWidget.url === this.url;
  }

  toDOM() {
    const span = document.createElement("span");
    span.innerHTML = "🔗";
    return span;
  }
}
