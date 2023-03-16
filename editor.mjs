import { EditorView } from "codemirror"
import { EditorState } from "@codemirror/state"

import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { javascript } from "@codemirror/lang-javascript"

import { keymap, highlightSpecialChars } from "@codemirror/view"
import { indentOnInput, defaultHighlightStyle, syntaxHighlighting, foldKeymap } from "@codemirror/language"
import { defaultKeymap, historyKeymap } from "@codemirror/commands"
import { searchKeymap } from "@codemirror/search"
import { autocompletion, completionKeymap, closeBracketsKeymap } from "@codemirror/autocomplete"
import { classHighlighter } from "@lezer/highlight"
import { lintKeymap } from "@codemirror/lint"

import { inlineImages } from './inline-images.js'
import { inlineLinks } from './inline-links.js'

// https://esm.sh/{{npm_package}}@{{version}}

const minHeightEditor = EditorView.theme({
  ".cm-content, .cm-gutter": { minHeight: "1024px" },
  ".cm-gutters": { backgroundColor: "white", borderRight: "0" },
  ".cm-foldGutter span": { marginTop: "-2px !important", display: "block" },
})

const editor = new EditorView({
  parent: document.body,
  state: EditorState.create({
    doc: initialDoc.value,
    extensions: [
      minHeightEditor,
      highlightSpecialChars(),
      
      
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle),
      syntaxHighlighting(classHighlighter),
      
      autocompletion(),

      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap
      ]), 
      markdown({
        defaultCodeLanguage: javascript(),
        base: markdownLanguage
      }),
      inlineImages(),
      inlineLinks()
    ]
  })
})
