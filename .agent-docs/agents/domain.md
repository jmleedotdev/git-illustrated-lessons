# Domain docs

## Before exploring

- Read root `GLOSSARY.md` when present.
- Read relevant ADRs under `.agent-docs/adr/`.

If these do not exist, proceed silently. Create domain documents lazily
through domain modeling when terms or decisions are actually resolved.

## Layout

Single-context repository:

```text
/
├── GLOSSARY.md
├── .agent-docs/
│   └── adr/
│       └── NNNN-decision-title.md
└── src/
```

## Vocabulary

Use the glossary's canonical terms in issues, proposals, tests, and code.
When a needed concept is missing, reconsider the terminology or surface
the gap for domain modeling.

## Decisions

Explicitly flag proposals that conflict with an existing ADR rather than
silently overriding it.
