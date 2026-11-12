# QuestForge local feedback smoke test

This is a **developer-only** feedback service, not a production submission endpoint. It binds to `127.0.0.1` on an automatically chosen port. It does not serve the feedback HTML form or accept submissions from remote devices.

## Run locally

Requires a recent Node.js version with built-in `fetch` (Node 20+ recommended).

1. Create a dedicated, private directory outside the website/repository, such as `mkdir -m 700 /tmp/questforge-private-feedback` on a Unix-like system. Do not store actual participant information in `/tmp`; that path is only for disposable synthetic testing.
2. Start: `QUESTFORGE_FEEDBACK_DIR=/tmp/questforge-private-feedback node feedback/local-server.mjs`
3. Copy the loopback URL and port printed by the process.
4. In another terminal, submit synthetic data:

```sh
curl -i -X POST 'http://127.0.0.1:PORT/' \\
  -H 'Content-Type: application/json' \\
  --data '{"kind":"player","adventureId":"voynich-playtest","version":"1.0"}'
```

Replace `PORT` with the printed port. A successful request returns HTTP 201 with a receipt. Records are appended to `feedback.jsonl` in the configured private directory. Stop the process with Ctrl+C and securely discard disposable test data.

## Safety and limits

- Do not publish this port, proxy it, tunnel it, or add a public DNS name.
- Do not print QR codes to this server or claim the offline preview form submits to it.
- The storage prototype is single-process JSONL, not a production database; it lacks backup, retention/deletion controls, distributed rate limiting, authentication, operational monitoring, and a reviewed privacy policy.
- Use only synthetic data until a production-grade consent, security, and retention design is implemented.
- Run automated checks with `node --test feedback/*.test.mjs`.
