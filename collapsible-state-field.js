import { StateField } from '@codemirror/state';
import { Decoration, EditorView } from "@codemirror/view";
import { ReplacementWidget } from "./replacement-widget";

// Creates a new StateField with internal "hiddenDecorations" RangeSet state.
// Accepts a "decorate" function that creates the decorations RangeSet.
//
// CollapsibleStateField probably isn't the best name. The decorations themselves
// are "collapsible", not the StateField itself.
export function newCollapsibleStateField(decorate) {
  let hiddenDecorations;

  return StateField.define({
    create(state) {
      return decorate(state);
    },
    update(value, transaction) {
      let hideDecorations = false;

      // Get the decorations that may or may not be shown based on the current doc.
      const decorations = transaction.docChanged ? decorate(transaction.state) : value.map(transaction.changes);
      const selection = transaction.state.selection.main;

      // All decorations should be hidden if the cursor is inside the
      // ReplacementWidget decoration.
      decorations.between(selection.from, selection.to, (_from, _to, value) => {
        if (value.widget instanceof ReplacementWidget) {
          hideDecorations = true;
        }
      });

      // Even if there are currently hidden decorations, still set the hidden
      // state to true if the cursor is inside the ReplacementWidget decoration.
      if (hiddenDecorations) {
        hiddenDecorations.between(selection.from, selection.to, (_from, _to, value) => {
          if (value.widget instanceof ReplacementWidget) {
            hideDecorations = true;
          }
        });
      }

      if (hideDecorations) {
        // If the decorations should be hidden and there are decorations currently being shown,
        // store them in the "hiddenDecorations" state and return 0 decorations
        if (decorations.length) hiddenDecorations = decorations;
        return Decoration.none;
      } else if (hiddenDecorations) {
        // If the decorations should NOT be hidden, but there are
        // some currently being stored, return those.
        return hiddenDecorations;
      }

      // If the decorations should NOT be hidden, and there are none stored in state, just return them.
      return decorations;
    },
    provide(field) {
      return EditorView.decorations.from(field);
    }
  });
}
