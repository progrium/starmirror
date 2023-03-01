import {EditorView, basicSetup} from "codemirror"
import {EditorState} from "@codemirror/state"

import {markdown, markdownLanguage} from "@codemirror/lang-markdown"
import {javascript} from "@codemirror/lang-javascript"

import {keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor} from "@codemirror/view"
import {history, historyKeymap} from "@codemirror/history"
import {foldGutter, foldKeymap} from "@codemirror/fold"
import {indentOnInput, defaultHighlightStyle, syntaxHighlighting} from "@codemirror/language"
// import {lineNumbers, highlightActiveLineGutter} from "@codemirror/gutter"
import {defaultKeymap} from "@codemirror/commands"
// import {bracketMatching} from "@codemirror/matchbrackets"
import {closeBrackets, closeBracketsKeymap} from "@codemirror/closebrackets"
import {searchKeymap, highlightSelectionMatches} from "@codemirror/search"
import {autocompletion, completionKeymap} from "@codemirror/autocomplete"
import {commentKeymap} from "@codemirror/comment"
import {rectangularSelection} from "@codemirror/rectangular-selection"
import {classHighlighter} from "@lezer/highlight"
import {lintKeymap} from "@codemirror/lint"

// https://esm.sh/{{npm_package}}@{{version}}

const minHeightEditor = EditorView.theme({
  ".cm-content, .cm-gutter": {minHeight: "1024px"},
  ".cm-gutters": {backgroundColor: "white", borderRight: "0"},
  ".cm-foldGutter span": {marginTop: "-2px !important", display:"block"},
})


      //lineNumbers(),
      //highlightActiveLineGutter(),
      //dropCursor(),
      //bracketMatching(),
      //closeBrackets(),
      //highlightActiveLine(),

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
      // rectangularSelection(),
      
      //highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        ...completionKeymap,
        ...lintKeymap
      ]), 
      markdown({
        defaultCodeLanguage: javascript(),
        base: markdownLanguage
      })
    ]
  })
})