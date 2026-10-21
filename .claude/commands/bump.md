---
description: Bump della versione (package.json, package-lock.json, hudVersion in config.js)
argument-hint: "[patch|minor|major|X.Y.Z] (default: minor)"
allowed-tools: Bash(npm version:*), Bash(git add:*), Bash(git commit:*), Bash(git status:*), Bash(git diff:*), Read, Edit
---

Esegui il bump di versione del progetto.

Argomento: `$ARGUMENTS` — `patch`, `minor`, `major` oppure una versione esplicita `X.Y.Z`. Se vuoto usa `minor`.

Passi:

1. Esegui `npm version <arg> --no-git-tag-version` per aggiornare `package.json` e `package-lock.json`.
2. Leggi la nuova versione da `package.json` e aggiorna `hudVersion` in `app/config.js` a `vMAJOR.MINOR`. Aggiungi `.PATCH` solo se diverso da 0, ad esempio `0.7.0` → `v0.7` e `0.7.1` → `v0.7.1`.
3. Aggiorna la riga `**Versione corrente:**` in `CLAUDE.md` con lo stesso valore.
4. Mostra `git diff --stat` e committa solo questi file con messaggio `chore: bump version to X.Y.Z`.
5. Non fare push: lo decide l'utente.
