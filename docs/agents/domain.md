# Domain Docs

How the engineering skills should consume domain documentation when exploring ocra-site.

## Before exploring, read these

ocra-site has no glossary or ADR set of its own: it shares the engine's domain.

- **The engine's `GLOSSARY.md`**: `../ocra/GLOSSARY.md` in the sibling checkout (workspace layout: ocra-internal README), else https://github.com/jma49/Open-CR-Agent/blob/main/GLOSSARY.md.
- **The engine's ADRs**: `../ocra/docs/adr/`, else https://github.com/jma49/Open-CR-Agent/tree/main/docs/adr. Read the ones that touch the area you're about to work in.
- **`DESIGN.md`** in this repository is the vocabulary for visual and motion work.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill creates them lazily, in the engine, when terms or decisions actually get resolved.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the glossary. Don't drift to synonyms the glossary explicitly avoids. If the concept isn't in the glossary yet, either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0024 (ocra Cloud), but worth reopening because…_
