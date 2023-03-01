node_modules:
	npm install

build: node_modules
	node_modules/.bin/rollup editor.mjs -f iife -o editor.bundle.js -p @rollup/plugin-node-resolve