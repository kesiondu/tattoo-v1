# Third-party licenses

## Potrace (via `esm-potrace-wasm`)

- Upstream: https://potrace.sourceforge.net/
- Package: `esm-potrace-wasm` (https://github.com/tomayac/esm-potrace-wasm)
- License: GNU General Public License, version 2.0 or later (`COPYING`)

`src/lib/trace-stencil.ts` uses this library in the browser to convert
generated raster line art into SVG outlines.

### What this means when you deploy

Potrace is GPL-2.0, and the Wasm build is distributed to every visitor's
browser. If you ship this site, the GPL requires you to make the corresponding
source code of the combined work available to those users, and to keep the
GPL notice with the distribution.

The ShipAny template license (`LICENSE`) still covers the template code you
started from. Adding a GPL-2.0 dependency to a commercially licensed codebase
is a licensing decision that only the project owner can make: either publish
the app source (and confirm the template terms allow that), replace Potrace
with a permissive alternative (`vtracer` is MIT, `imagetracerjs` is public
domain), or obtain a non-GPL Potrace license. Do not rely on this note as legal
advice.

The Wasm build also ships its own license text at
`node_modules/esm-potrace-wasm/LICENSE`.
