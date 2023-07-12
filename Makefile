
bundle: dist
	npm install && esbuild starmirror.mjs --bundle --outfile=./dist/starmirror.min.js --format=esm --minify

dist:
	mkdir -p dist