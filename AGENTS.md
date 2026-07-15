<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## package-lock.json — ne jamais régénérer sous Windows/npm 11

Régénérer `package-lock.json` localement sous Windows avec npm 11 introduit un
bug (entrées optionnelles `@emnapi/*`/wasm32-wasi manquantes ou mal formées)
qui casse le `npm ci` strict de Cloudflare (image Linux/npm 10). Toute
régénération du lockfile doit se faire via Claude Cowork (environnement
Linux) ou être immédiatement vérifiée par un build Cloudflare avant merge.
