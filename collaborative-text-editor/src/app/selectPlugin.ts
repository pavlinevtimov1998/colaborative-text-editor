import { Decoration, DecorationSet } from 'prosemirror-view';

import { Plugin } from 'prosemirror-state';

const SelectPlugin = new Plugin({
  state: {
    init() {
      return { decoration: DecorationSet.empty };
    },
    apply(transaction, state, _, editorState) {
      const { from, to } = transaction.selection;

      if (from && to) {
        const decorations = [
          Decoration.inline(from, to, { class: 'selection' }),
        ];

        const decoration = DecorationSet.create(editorState.doc, decorations);
        return { decoration };
      }

      return state;
    },
  },
  props: {
    decorations(state) {
      if (state && this.getState(state)) {
        return this.getState(state)!.decoration;
      }
      return null;
    },
  },
});

export default SelectPlugin;
