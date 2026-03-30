## What changed

<!-- Describe the changes in this PR. What was added, modified, or removed? -->

## Why

<!-- Explain the motivation. What problem does this solve or what feature does it add? -->

## How to test

<!-- Step-by-step instructions for testing these changes locally. -->

1.
2.
3.

## Screenshots (if UI changes)

<!-- Include before/after screenshots or a screen recording if this touches the UI. -->

---

## ✅ Engineer Checklist

- [ ] Tests pass (`npm run test:ci`)
- [ ] Lint passes (`npm run lint`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)
- [ ] No new `npm audit` high/critical vulnerabilities
- [ ] PR targets `develop` (or `main` for hotfixes)
- [ ] New business logic has unit test coverage
- [ ] Inline comments added for non-obvious logic

---

## 🔍 QA Manual Checklist

> Complete this section for any PR that touches gameplay, UI, or ad rendering.

### Game Creation
- [ ] Game creation flow works end-to-end (home → create → view game)
- [ ] AI prompt generates a valid, playable HTML game
- [ ] Loading/progress state displays during game generation
- [ ] Error state displays gracefully if generation fails

### Game Play Loop
- [ ] Game page renders the game iframe/canvas correctly
- [ ] Play count increments on game visit
- [ ] Back navigation returns to gallery without errors
- [ ] Tweaked/remixed game shows "Remix" badge in gallery

### Ad Slots
- [ ] Ad slots render correctly when AdSense is configured
- [ ] Ad slots degrade gracefully (render nothing) when AdSense is not configured
- [ ] Ads are labeled age-appropriate (no adult content categories)
- [ ] Ad layout does not break page on mobile (Chrome, Safari)

### Mobile & Cross-Device
- [ ] No broken layouts on mobile — Chrome (Android)
- [ ] No broken layouts on mobile — Safari (iOS)
- [ ] No horizontal overflow / scroll on 390px viewport
- [ ] Touch targets are large enough (≥ 44×44px) for kids

### Accessibility
- [ ] Keyboard navigation works (Tab through interactive elements)
- [ ] Basic screen reader pass: headings, links, and buttons have accessible names
- [ ] No color contrast failures (WCAG AA)
- [ ] Focus indicators are visible

### Content Safety (Kids Platform — Ages 8-17)
- [ ] No adult or inappropriate content is surfaced in generated games
- [ ] No external links to unvetted third-party sites in game content
- [ ] Error messages are friendly and age-appropriate

---

## 🚦 CI Gates (auto-checked)

All must be green before merge:

| Check | Status |
|-------|--------|
| ESLint / Prettier | CI |
| TypeScript type check | CI |
| Unit tests (≥ 90% coverage target) | CI |
| Build check | CI |
| npm audit (high/critical) | CI |
| E2E smoke tests (@smoke) | CI — PRs only |
| E2E regression (@regression) | CI — `release/*` only |
