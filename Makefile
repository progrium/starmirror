build: node_modules
	node_modules/.bin/rollup starmirror.mjs -f es -o dist/starmirror.bundle.js -p @rollup/plugin-node-resolve

node_modules:
	npm install

