# QuestForge local feedback smoke test

This is a **developer-only** feedback service, not a production submission endpoint. It binds to `127.0.0.1` on an automatically chosen port. It serves a local-only feedback HTML form and accepts submissions only from the same machine, not remote devices.

## Run locally

Requires a recent Node.js version with built-in `fetch` (Node 20+ recommended).

1. Create a dedicated, private directory outside the website/repository, such as `mkdir -m 700 /tmp/questforge-private-feedback` on a Unix-like system. Do not store actual participant information in `/tmp`; that path is only for disposable synthetic testing.
2. Start: `QUESTFORGE_FEEDBACK_DIR=/tmp/questforge-private-feedback node feedback/local-server.mjs`
3. Copy the loopback URL and port printed by the process. Open that URL in a browser **on the same machine** to try the Player or Dungeon Master form with synthetic data. A saved submission displays a receipt.
4. Alternatively, in another terminal, submit synthetic data directly to the API:

```sh
curl -i -X POST 'http://127.0.0.1:PORT/api/feedback' \\
  -H 'Content-Type: application/json' \\
  --data '{"kind":"player","adventureId":"voynich-playtest","version":"1.0"}'
```

Replace `PORT` with the printed port. A successful request returns HTTP 201 with a receipt. Records are appended to `feedback.jsonl` in the configured private directory. Stop the process with Ctrl+C and securely discard disposable test data.

## Safety and limits

- Do not publish this port, proxy it, tunnel it, or add a public DNS name.
- Do not print QR codes to this server. The repository's static `feedback/index.html` remains offline-only; only the loopback-served version submits to local storage.
- The storage prototype is single-process JSONL, not a production database; it lacks backup, retention/deletion controls, distributed rate limiting, authentication, operational monitoring, and a reviewed privacy policy.
- Use only synthetic data until a production-grade consent, security, and retention design is implemented.
- Run automated checks with `node --test feedback/*.test.mjs`.
