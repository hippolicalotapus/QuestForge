# QuestForge playtest feedback acceptance gates

Status: development specification only. No live endpoint, QR code, or public recruitment is implied by this document.

## Separate experiences

- **Player form:** adventure identifier/version, session date (optional), clarity, pacing, challenge, enjoyment, confusing passages, accessibility concerns, free-text suggestions, optional contact address, and explicit consent to be contacted.
- **Dungeon Master (DM) form:** adventure identifier/version, party size and level, session duration, encounter balance, rules ambiguities, preparation effort, map/handout usability, safety concerns, free-text fixes, optional contact address, and explicit consent to be contacted.
- Both forms allow anonymous submissions without a login or contact address. Never require a real name.

## Submission contract

- Submit directly to a verified QuestForge-owned HTTPS endpoint; never to a placeholder, personal inbox, or third-party form without approval.
- Server validates form type, adventure ID, field lengths, consent, and request size; rejects malformed or oversized requests without saving partial submissions.
- Escape stored text when rendered; prevent executable HTML, script injection, and unsafe outbound links.
- Apply abuse protection and rate limits without publishing or exposing respondents' personal data.
- Provide an accessible success message only after the server confirms persistence. On failure, retain the user's unsent answers and provide a retry option.
- Store optional contact details separately from anonymous feedback where practical; define access and deletion policy before collecting data.

## QR and print release gates

1. Deploy and verify the actual Player and DM destinations separately on a phone.
2. Submit one anonymous and one opt-in test response to each endpoint; confirm server-side receipt and correct classification.
3. Test airplane-mode/offline and server-error handling, keyboard navigation, screen-reader labels, and mobile viewport layout.
4. Generate separate QR codes only from verified final HTTPS URLs, scan each QR from a printed proof, and verify no redirects to placeholder pages.
5. Include the adventure/version in the destination or form context to prevent feedback being mixed across editions.
6. Only then place the QR codes into the printable adventure PDFs. No public recruitment before end-to-end verification.

## Release evidence

Record the tested endpoint URLs, deployment revision, test date, response receipt evidence (with test personal data removed), QR scan results, and PDF version in a release checklist. Do not mark these gates complete until observed.
