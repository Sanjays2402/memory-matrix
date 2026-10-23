<div align="center">

# Memory Matrix

### A fast, polished memory game that rewards focus, speed, and streaks.

[![Play now](https://img.shields.io/badge/PLAY_NOW-d8ff4f?style=for-the-badge&labelColor=111409&logo=githubpages&logoColor=111409)](https://sanjays2402.github.io/memory-matrix/)
[![Source](https://img.shields.io/badge/SOURCE_CODE-181c1d?style=for-the-badge&logo=github)](https://github.com/Sanjays2402/memory-matrix)
[![Deploy](https://img.shields.io/github/actions/workflow/status/Sanjays2402/memory-matrix/deploy.yml?branch=master&style=for-the-badge&label=DEPLOY)](https://github.com/Sanjays2402/memory-matrix/actions/workflows/deploy.yml)

[Live game](https://sanjays2402.github.io/memory-matrix/) · [How to play](#how-to-play) · [Run locally](#run-locally) · [Report a bug](https://github.com/Sanjays2402/memory-matrix/issues/new)

</div>

## Screenshots

<p align="center">
  <a href="https://sanjays2402.github.io/memory-matrix/"><img src="docs/screenshots/01-game-setup.png" alt="Memory Matrix game setup with board size, card deck, and game mode controls" width="100%"></a>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/02-classic-gameplay.png" alt="Classic Memory Matrix gameplay with score and streak feedback"></td>
    <td width="50%"><img src="docs/screenshots/03-time-attack.png" alt="Time Attack gameplay with bonus seconds and a larger board"></td>
  </tr>
  <tr>
    <td align="center"><strong>Classic mode</strong><br><sub>Chain matches and protect your streak.</sub></td>
    <td align="center"><strong>Time Attack</strong><br><sub>Match quickly to earn bonus seconds.</sub></td>
  </tr>
</table>

<table>
  <tr>
    <td width="50%" align="center"><img src="docs/screenshots/04-mobile-gameplay.png" alt="Responsive Memory Matrix gameplay on mobile" width="390"></td>
    <td width="50%" align="center"><img src="docs/screenshots/05-results.png" alt="Memory Matrix final score and personal best results screen" width="390"></td>
  </tr>
  <tr>
    <td align="center"><strong>Responsive play</strong><br><sub>The full game fits touch screens without horizontal overflow.</sub></td>
    <td align="center"><strong>Personal-best results</strong><br><sub>Review score, speed, moves, and best streak.</sub></td>
  </tr>
</table>

<table>
  <tr>
    <td width="33%"><img src="docs/screenshots/06-programming-setup.png" alt="Programming deck setup with real technology logo previews"></td>
    <td width="33%"><img src="docs/screenshots/07-programming-gameplay.png" alt="Programming deck gameplay with technology logos in a terminal-inspired board"></td>
    <td width="33%"><img src="docs/screenshots/08-programming-mobile.png" alt="Programming deck with self-hosted technology logos on mobile"></td>
  </tr>
  <tr>
    <td align="center"><strong>Choose your stack</strong></td>
    <td align="center"><strong>Terminal-inspired play</strong></td>
    <td align="center"><strong>Real logos on mobile</strong></td>
  </tr>
</table>

---

## Why it is fun

Memory Matrix starts with familiar pair matching, then adds a light arcade layer:

- **Score every match** — clean matches earn points immediately.
- **Build streaks** — consecutive matches multiply the reward up to **1,250 points per pair**.
- **Race the clock** — Time Attack begins at 60 seconds and successful matches add **2–4 bonus seconds**, depending on board size.
- **Chase mastery** — improve your move count, finish time, star rating, and longest streak.
- **Choose your vibe** — play Emoji, Programming, Space, Animals, or Numbers decks.
- **Learn by sight** — the Programming deck uses 32 real, self-hosted technology logos instead of letter abbreviations.
- **Return every day** — everyone gets the same deterministic Daily Challenge, with a rotating deck and a persistent completion streak.
- **Use one Focus Peek** — reveal the board once when you are stuck; the trade-off is half points for the rest of that round.

## Game modes

| Mode | Goal | Twist |
|---|---|---|
| **Classic** | Clear the board efficiently | Earn up to three stars based on move count |
| **Time Attack** | Match as many pairs as possible before time expires | Every match adds bonus time |
| **Daily Challenge** | Complete the shared medium puzzle | A new deterministic board and rotating deck every UTC day |

## Boards and decks

| Difficulty | Grid | Pairs | Time bonus per match |
|---|---:|---:|---:|
| Easy | 4×4 | 8 | +2 seconds |
| Medium | 6×6 | 18 | +3 seconds |
| Hard | 8×8 | 32 | +4 seconds |

Five decks are included: **Emoji**, **Programming**, **Space**, **Animals**, and **Numbers**.

## How to play

1. Pick a board size, deck, and game mode.
2. Memorize the opening preview before the cards turn over.
3. Select two cards. A match stays revealed; a miss resets your streak.
4. Chain consecutive matches to increase your score multiplier.
5. Clear the board—or keep the Time Attack clock alive—to set a new personal best.

> **Tip:** The Focus Peek is powerful, but using it halves future point rewards for that round.

## Experience highlights

- Responsive 4×4, 6×6, and 8×8 boards
- Mouse, touch, and native keyboard controls
- Accessible labels, visible focus states, and reduced-motion support
- 3D card flips, match pulses, streak feedback, score popups, and confetti
- Synthesized Web Audio feedback with a one-tap mute control
- Local best scores with failure-safe `localStorage` access
- Near-black gameplay-first UI with a restrained acid-lime accent

## Built with

[![React](https://img.shields.io/badge/React_19-20232a?style=flat-square&logo=react&logoColor=61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-0f172a?style=flat-square&logo=tailwindcss&logoColor=38bdf8)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Motion_12-111111?style=flat-square&logo=framer&logoColor=white)](https://motion.dev/)
[![Vitest](https://img.shields.io/badge/Vitest_4-252529?style=flat-square&logo=vitest&logoColor=6e9f18)](https://vitest.dev/)

## Run locally

```bash
git clone git@github.com:Sanjays2402/memory-matrix.git
cd memory-matrix
npm install
npm run dev
```

### Quality checks

```bash
npm run lint
npm test
npm run build
```

## Project structure

```text
src/
├── App.jsx                    # Screen flow and composition
├── gameLogic.js               # Decks, scoring, rewards, shuffle, storage
├── useGame.js                 # Round state, timers, streaks, and interactions
├── sounds.js                  # Web Audio feedback
├── index.css                  # Design system, layout, motion, responsive rules
└── components/
    ├── BackgroundOrbs.jsx     # Ambient canvas
    ├── Card.jsx               # Accessible 3D card
    ├── GameBoard.jsx          # Responsive board
    ├── Header.jsx             # HUD, rewards, hint, and sound controls
    ├── Icons.jsx              # Shared SVG icon set
    ├── Menu.jsx               # Game setup and deck preview
    └── VictoryOverlay.jsx     # Results, score, and replay flow
```

## Links

- **Play:** https://sanjays2402.github.io/memory-matrix/
- **Repository:** https://github.com/Sanjays2402/memory-matrix
- **Issues:** https://github.com/Sanjays2402/memory-matrix/issues
- **Deployments:** https://github.com/Sanjays2402/memory-matrix/actions/workflows/deploy.yml
- **License:** [MIT](LICENSE)

## Contributing

Ideas and fixes are welcome. Open an [issue](https://github.com/Sanjays2402/memory-matrix/issues/new) or submit a pull request with a focused change and passing quality checks.

## Asset credits

Programming deck logos are provided by [Simple Icons](https://simpleicons.org/) under
[CC0 1.0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md) and
stored locally for reliable, privacy-friendly play. Individual marks remain subject
to their respective trademark guidelines. See the full
[asset attribution](public/programming-logos/ATTRIBUTION.md).

## License

Released under the [MIT License](LICENSE).

## Terms & Disclaimer

By using this project you agree to the following.

- **No warranty.** This software is provided "as is", without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
- **No liability.** To the maximum extent permitted by law, the author and contributors are not liable for any claim, loss, or damage (direct, indirect, incidental, or consequential, including lost data or profits) arising from its use.
- **Your responsibility.** You use it at your own risk and are responsible for complying with the laws that apply to you.
- **Game.** Provided for entertainment. Take breaks; it is not designed for people with photosensitive epilepsy, and flashing effects may occur.
- **Third parties.** Names, logos, APIs, and services of others belong to their owners and are used for identification only; no affiliation or endorsement is implied.
- **Your statutory rights.** Nothing here limits rights that cannot be waived by agreement, including under consumer-protection laws in the USA, Canada (including Quebec), and India (Consumer Protection Act, 2019).
- **License.** Use, copying, and distribution are governed by the [LICENSE](LICENSE) file; if anything here conflicts with it, the license controls.

## Content, Assets & Fair Use

- **Original work.** Unless noted otherwise (including below), the code, text, design, and images in this repository were created by the author.
- **Libraries, fonts, and icons.** Third-party libraries, fonts (for example Google Fonts), and icon sets belong to their creators and are used under their own licenses; see the dependency manifests and each source for terms.
- **Logos, brands, and screenshots.** Third-party names, logos, and screenshots appear only to identify or describe their products (nominative use). They remain the property of their owners and do not imply affiliation or endorsement.
- **Ideas and inspiration.** Where this project is inspired by another product, game, or idea, it is an independent implementation. It borrows only general ideas, mechanics, or styles, which are not anyone's exclusive property, and is meant to contain no third-party code or artwork used without permission.
- **Fair use and fair dealing.** Any third-party material is used in limited ways for purposes such as education, research, review, commentary, or identification, relying on fair use in the USA (17 U.S.C. § 107), fair dealing in Canada (Copyright Act, ss. 29–29.2), and fair dealing in India (Copyright Act, 1957, s. 52), where they apply.
- **Concerns and takedown requests.** If you own rights in something here and believe it is used improperly, [open an issue](https://github.com/Sanjays2402/memory-matrix/issues) or contact the author through their GitHub profile with a link to the material and your claim. It will be reviewed promptly and credited, changed, or removed as appropriate. You may also use GitHub's DMCA process.
- **Contributions.** By contributing, you confirm you have the right to submit your contribution and agree it is licensed under this repository's license.
- **Website.** The project site has its own [Terms](https://sanjays2402.github.io/memory-matrix/terms.html) and [Fair Use](https://sanjays2402.github.io/memory-matrix/fair-use.html) pages.
