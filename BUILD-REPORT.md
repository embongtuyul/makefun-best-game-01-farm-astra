# Petalpost Farm — build report

## Zoom camera and element details — current release

Added `game/js/camera.js` as the only owner of the stage transform. It combines responsive fit scale, a 1×–3× eased zoom target and clamped pan offsets. `responsive.js` now supplies fit scale instead of writing a transform. HUD camera buttons provide +, − and reset. Wheel zooms toward its cursor; two-pointer touch distance uses the same path; double-click/double-tap resets. A background drag pans only when zoomed and leaves plot taps untouched. Releases under 8px and 450ms are taps; larger movement is pan-only. Camera state is visual and resets on new sessions and presentation scenes; it is not saved. The diagnostic snapshot exposes fit, zoom, pan and target zoom.

Added `game/js/details.js` and a Detail toggle. Inspect mode routes taps to live cards instead of game actions; normal mode is unchanged. Cards cover empty and active coin bays with logo/name, stage 1–4, progress, current seconds, powered state, sale and XP; GPU/ASIC/staking/LP producers with product, progress, seconds, value and level; Exchange HQ, Cold Wallet, Server tower, Token Market and Liquidity pool with roles and panel shortcuts; CZ with current action/target; and the BNB buddy. Cards are DOM elements outside the transformed stage, clamp to the visible viewport, and update without replacing the close button. Empty ground closes the card. The snapshot exposes `inspect` and `detail`.

The gameplay capture (`02-play.png`) opens the BTC detail card to make the feature visible to the judge. The cover keeps gameplay HUD hidden. The crypto canvas scene, CZ/BNB buddy, music/settings, difficulty, Market Day, Free Trade and responsive fit remain unchanged in behavior and balance.

**Zoom/detail full verification:** camera-detail tests passed with zero errors for button zoom, cursor wheel, reset, clamped background pan, no accidental mining during drag, mining after zoom/pan, live BTC stats, normal power after closing inspect, GPU/Hash detail, HQ→Trades shortcut, CZ and BNB buddy cards, empty-ground close, and simulated two-contact pinch. The existing full Normal playtest **WON** in **51.3333 game seconds**, with **270 coins**, **231 XP**, **12 harvests**, score **2570**, and **zero console errors**. It also passed the earlier music, difficulty, Market Day, Free Trade, CZ movement/celebration, save/restart, duplicate reward and 390×844/844×390 checks. Rules and edge tests passed.

Final screenshot bytes at 1280×720: title **236252**, gameplay/detail **197534**, trades **147712**, win **154833**. All are below 256 KiB. Packaging ran twice outside the repository at `/tmp/opencode/coinfield-zoom-out` and `/tmp/opencode/coinfield-zoom-out-second`; dossiers are byte-identical. Game bytes: **98648**. Dossier bytes: **1085064**.

**Zoom release dossier SHA-256:** `61e426f188c1212a41f67cd3655a43949a48bf31e2a94ff5934d18e011e8f342`

The visual limitation remains: this session cannot view the supplied reference image directly, so the review is based on the written style contract and browser assertions. No submission, bundle or GitHub operation was performed.

## CZ farmer and BNB buddy — current release

Added `game/js/farmer.js`, a canvas-only presentation layer. CZ has short side-parted black hair, rectangular black glasses, light warm skin, a slight smile, black zip hoodie with yellow diamond chest mark, dark pants and boots. The small yellow diamond buddy smiles, carries a BNB coin, and follows with exponential smoothing and gentle bobbing. No image/reference file is embedded; the written identity markers govern the drawing because the supplied reference cannot be viewed in this session.

Successful plot actions route CZ from his current location to the bay in 0.4–0.7 seconds using a smooth tween. New actions replace the destination immediately without queuing. Mine and harvest actions bend/scoop with a coin, dust and sparkle; power actions hold a small power-cell/can and pour droplets. Idle has a gentle bob and gaze in the last movement direction. Win mode moves CZ beside the results panel with raised arms, hopping, sparkles and a looping coin shower. The title says “Mine with CZ & the BNB buddy”; the Guide explains his role. Position, targetPlot, action and companion positions appear in a deep-copied diagnostic `farmer` snapshot. The visual state is independent of game saves and resets on restart. Pointer and keyboard plot actions share the same dispatch path; no input hit-testing changes were needed.

All simulation effects still resolve instantly through the original functions. No costs, timers, XP, score rules, growth rates, trade requirements, difficulty values, Market Day behavior or win condition changed. Rendering occurs on the canvas and cannot intercept clicks. CZ's destination clamps keep his full body and buddy within the stage. Presentation-only trade-panel captures position him on the right margin rather than behind the panel; this does not affect normal gameplay.

**Full Normal Playwright run: WON**, all five trades, **55.6667 simulation seconds**, **270 coins left**, **231 XP**, **12 harvests**, score **2562**, **zero console errors**. New assertions verify the title farmer exists, clicking a bay changes his target and position, power selects the matching animation, rapid subsequent actions replace the target, and victory selects the celebration at x=945. The full existing checks passed: normal mining/power/harvest/sales/purchases, music gesture gate, persisted settings, difficulties, Market Day, Free Trade, save reload, duplicate reward rejection, pause/mute, restart, keyboard input and both phone viewports. Rules and browser edge checks also passed. The combined command timed out during captures after these tests completed; capture was rerun successfully separately.

All four final PNGs were recaptured at **1280×720**: title **236252 bytes**, gameplay **204542**, trades **147712**, win **154954**. The cover has an empty gameplay HUD. Title/play farmer is at (875,555), trade presentation at (1100,430), and winning celebration at (945,555), all outside their respective overlay cards. Capture assertions check bounds and celebration state. Visual likeness is not certified by an image-capable review; the existing model image-input limitation remains, and the playable result is ready for the user's judgment.

Two external packaging runs at `/tmp/opencode/coinfield-cz-out` and `/tmp/opencode/coinfield-cz-out-second` produced byte-identical dossiers. PNG limits, ordinary game files and the unchanged kit library passed integrity checks. Game bytes: **86994**. Dossier bytes: **1082567**.

**CZ release dossier SHA-256:** `25e7bddef389e90dbf2a4650b05f34b0572ed2caed85609b950b8887ce958d4a`

No submission, bundle or GitHub operation was performed. The CZ DONE marker is created after the master commit. Earlier release records remain below as history.

## Crypto reskin — Coinfield Exchange

This section is the current release record; earlier farm build and revision sections remain below as history. The existing game was revised in place. Base costs, sale values, growth/production timers, XP, gates, inventory behavior, weather multipliers, difficulty timers, score rules, Market Day gifts and the five-order win condition remain unchanged. Internal IDs, actions and local-storage keys deliberately remain stable for save compatibility, while verification now asserts crypto names and identities.

The twelve assets map in their original order to BTC, ETH, SOL, BNB, XRP, ADA, AVAX, LINK, DOT, DOGE, PEPE and SHIB. GPU rigs produce Hash; ASIC miners produce Block reward; staking nodes produce Stake yield; liquidity pools produce LP fees. DOGE/PEPE/SHIB retain the former flower synergy. The five trade desks are Spot sell, Futures position, OTC block deal, Whale order and Community airdrop, with identical requirements and rewards. Weather is Bull market / Altseason / Bear market, with Opening / Active / Closing / Low volume phases. Free Farm is now Free Trade.

Art uses the new `logos.js` module: authored canvas discs, Unicode glyphs and outlines, with no images or network requests. BNB is a yellow diamond mark; BTC, ETH and SOL use ₿, Ξ and ◎. Small charts, growing discs and full shiny tokens preserve visible progression. Producers are illustrated hardware, trees become candlestick pillars, the windmill becomes a server tower, the pond is a liquidity basin with floating tokens, the buildings identify Exchange HQ and Cold Wallet, and the courier/cart carry the exchange theme. Diamond bay positions and hit-testing are unchanged. Market washes use green/red tones; ambient motion, splashes/rainbow, synthesized music and responsive stage fitting remain.

Normal full-input playthrough: **WON**, five trades settled in **52.4333 game seconds**, **270 coins left**, **231 XP**, **12 harvests**, score **2568**, **zero console errors**. The test checks title/Free Trade text, BTC/ETH controls, GPU hardware and Spot sell trade identity in addition to the original input loop. It also verifies gesture-only music startup, persisted settings/difficulty, all three difficulty choices, Market Day growth boost, Free Trade after winning, save/reload, pause/mute, duplicate collection rejection, restart, keyboard input and 390×844/844×390 fit. `verification/playtest-result.json` records the actual input trace. Rules pass for all assets/producers, market rates, gates, duplicate rewards and endless board refresh; edge checks pass for loss/restart, blur/resume, corrupt saves and layout boundaries. No IDs/actions were renamed, so tests retain stable selectors while asserting crypto presentation. All four verification scripts were updated to identify the reskin.

All four final screenshots are unedited browser renders at 1280×720. Title: **233027 bytes**; play: **200350**; trades: **143675**; win: **147297**. The cover hides the gameplay HUD. The previous image-input limitation still applies: visual assessment here is based on source and browser layout checks rather than a claimed image-based review. Further cosmetic refinements after the successful playthrough changed labels and decorative floating tokens only; captures loaded those final sources without page errors.

Packaging ran twice outside the repository, at `/tmp/opencode/coinfield-out` and `/tmp/opencode/coinfield-out-second`. Dossiers are byte-identical, all PNGs are below 256 KiB, and the required library remains unchanged. Game source totals **80894 bytes**; dossier **1050784 bytes**.

**Crypto dossier SHA-256:** `5e080ed37827a1c36100722fc009fa3edbfbaebf0acd90503ba3936225cf64a2`

No submission, bundle, GitHub operation or remote repository creation was performed. The crypto DONE marker is created after the local master commit.

## Revision — music and a living farm

This section supersedes the original build's feature list, screenshot sizes and dossier hash below. The original record is retained as build history.

Added a generative 76-BPM pentatonic melody and gentle bass/fifth pads in `music.js`, scheduled on the WebAudio clock. Audio starts on the first pointer/key gesture, continues across title/play/results, and uses independent master/music/SFX gain buses. The title and HUD Settings panels expose three persisted 0–1 sliders and mute. Defaults are master 0.75, music 0.4, SFX 0.7. Existing action cues remain. Browser checks verify a running audio context and scheduled notes; listening quality was not independently assessed in this environment.

`ambient.js` adds a walking postie with swinging limbs, bobbing, stops and waves along the bench/stall route; a produce cart on a 40-second cycle; drifting clouds; periodic flying birds; animated tree canopies and a swimming duck. Chickens peck, cow tails swish, sheep bounce, and three bees orbit each hive. Crops sway more in wet weather. Harvests emit sparkles and value popups alongside their chime; animal collections emit hearts. Rain has puddles and expanding splash rings, followed by a short rainbow in sunshine. A smooth color wash transitions through dusk/night/dawn on the farm only. The title scene has a small slow pan/zoom behind a stationary title card. Static scenery is cached while inexpensive overlays animate.

Base crop/animal prices, growth times and five-basket win condition are unchanged. New balance:

- Relaxed: 720 seconds, score ×0.8; Normal: 480 seconds, ×1; Rush: 300 seconds, ×1.5. Last choice persists.
- Free Farm is available on title and after victory. After victory it preserves coins, crops, animals and XP. No deadline; completing each set of five orders refreshes the board forever. Score includes cumulative deliveries.
- Market Day appears as a gift card/button in the quest panel after 18 seconds, then once each 160-second day. Opening it offers three deterministic choices from seven gifts: crop speed +25%, three oats, order coins +30% (rounded), animal speed +25%, immediate watering, three daisies, or 18 coins. Only one gift per day; rate bonuses expire at the next day, permanent gifts remain. Daisy planting still requires level 2. The card does not interrupt another panel or steal the player's input.
- First-session coaching advances from planting to watering to growth to harvest/sale/order; it is dismissible and persists its seen flag. The Guide remains.
- The submitted game uses a fixed 1280×720 stage transformed proportionally to fit any viewport, with letterboxing. Tested at 390×844 and 844×390; HUD regions do not overlap and the stage remains in bounds. Phone text is necessarily small in portrait because the requested entire landscape scene is preserved.

Revision verification: the extended real-input Normal playthrough **WON in 53.6 simulation seconds**, with **270 coins**, **231 XP**, **12 harvests**, score **2566**, and **zero console errors**. It chose the crop-speed gift and exercised planting, watering, harvesting, sales, seed/animal/land purchases, all five deliveries, reload, duplicate collection, pause/mute, restart and keyboard planting. New assertions verify audio is absent before gesture and scheduled afterward, slider persistence, persisted difficulty choice, selecting all three difficulties, Market Day choice application, Free Farm after winning with coins preserved, and both requested phone viewports. `verification/playtest-result.json` contains the input trace.

Rules pass for all twelve crops/four animals, difficulty timers, Market Day rate/once-only/expiry, two endless order refresh cycles and 30% payouts. Edge tests pass for loss/restart, blur/resume, corrupt save and panel bounds. A rare negative first RAF delta exposed by an edge test was clamped to zero, and the villager route defensively clamps its time; edge tests passed after the fix. Settings ignore gameplay keyboard shortcuts while open. Existing local pre-revision playtest evidence was preserved in `/tmp/opencode/petalpost-prior-*` before recapture.

All four screenshots were recaptured from the final game's presentation scenes at 1280×720: title 239,487 bytes; play 204,199; orders 159,153; win 162,640. The daytime play capture shows the villager at approximately (522,582), cart at (150,650), and post-rain rainbow. An initial rainy gameplay capture exceeded 256 KiB, so the gameplay fixture was moved to the post-rain phase and recaptured from the browser; no screenshot pixels were edited. The cover hides gameplay HUD. The prior image-input/reference-access limitation remains: these are description-based style and source/layout checks, not a claimed visual side-by-side assessment. The largest prior documented difference—static scenery and absent inhabitants—is addressed by the animated overlay layer. The palette, thick outlines, rounded forms and fixed angled beds remain consistent.

Packaging ran twice with output roots `/tmp/opencode/petalpost-revision-out` and `/tmp/opencode/petalpost-revision-out-second`. Dossiers are byte-identical; the kit library remains unchanged. Game source totals 76,999 bytes; dossier 1,101,524 bytes. Both stale entry-local `out/` and `out-second/` directories are removed. No submission, bundle or GitHub operation was performed.

**Revision dossier SHA-256:** `bb46e48da4e61ae4e618ba99f9d071d84bf85e37ff474eb202066b66d77f005a`

## Style contract (locked before implementation)

The supplied reference notes govern visual genre and direct object interaction; all geometry, names, economy and rules are authored here. The reference's longer idle pacing is deliberately replaced with a short festival session.

- Palette roles: sage meadow #acd695 (about 45%); cream paper #fff5d9 (15%); terracotta soil #b87957 (10%); teal ink #314e46; coral roof #ed8d8b; blossom pink #f7bbd0; water #8cd4d9. Colors are authored, not sampled.
- Materials: flat illustrated sticker shapes, rounded corners, 3–5px dark colored outlines, small warm highlights; no photographic textures.
- Lighting: upper-left warm highlights and soft contact shadows. Dusk and night use a restrained blue overlay on the scene, leaving UI readable.
- Camera: one fixed orthographic angled scene; diamond beds at the center, buildings around them, pond and pasture on opposite sides. No scrolling camera or walking avatar.
- UI: cream rounded cards, dark green bold system type, small uppercase labels, pill counters; direct plot interaction and four large bottom controls.
- Motion: plants bob gently, collection pops float upward, trees sway, butterflies roam, raindrops travel diagonally. Actions answer immediately with synthesized notes.
- Nonnegotiables: bright pastel field, chunky silhouettes, visible growth stages, a readable farm even with overlays, and an uncluttered title cover.

## Concept and systems

Petalpost Farm is an original fixed-scene illustrated farm about preparing the village picnic. Fill five neighbors' baskets within an eight-minute season. A practiced player can finish quickly; the generous deadline leaves a new player time to explore, expand, and learn. Score rewards coins, XP, deliveries and time remaining.

All game code, shapes, names, sounds and economy were authored in this session through file patches. The only imported code is the required unchanged kit dossier library. Neither the starter game nor the other builder's entry was read. The permitted Glowgarden packaging file was consulted only for the dossier interface. The kit contains no README (checked by filename); RULES.txt was read. No submission, bundle, GitHub operation or remote repository was created.

Six connected systems work: crops and watering; animal production; weather and day cycle; orders; inventory and shopping; XP and unlocks. Nine food crops and three flowers have four visible stages. A harvest enters the barn, never silently auto-sells. Each harvest floats its quantity and coin value; sales float actual earned coins. Animals collect into the same inventory. Hives gain 15% production speed per growing flower. Expanding opens up to twelve beds, with eight animal slots.

Controls: click/tap beds to plant, water and harvest; click animal produce bubbles to collect. Choose seeds along the bottom. Barn, Orders, Shop and Guide have buttons; buildings and mailbox are shortcuts. Arrows select beds, Space interacts, brackets cycle seeds, A collects ready animal produce, S/B/O/H open panels, P pauses, M mutes, Escape closes/pauses, Enter starts/restarts. Tab and Enter operate menu buttons. Pause freezes the season; menus leave it running. Blur pauses automatically. Current sessions and winning best scores persist in localStorage, with corrupt-save fallback.

## Economy and balance

Start: 85 coins, six oat seeds, four carrot seeds, six beds. Seeds sell in packs of three. Level is 1 + floor(XP / 45), capped at five. Dry crops grow at 18% speed. Rain auto-waters; sunshine is crop ×1 and animal ×1.15, rain crop ×1.45 and animal ×0.8, storm crop ×1.2 and animal ×0.55. Night multiplies both by 0.65. Weather changes every 40 seconds; a full day lasts 160 seconds.

| Crop | Seed cost | Sale | Growth seconds | XP | Level |
|---|---:|---:|---:|---:|---:|
| Golden oats | 4 | 9 | 9 | 5 | 1 |
| Peach carrot | 7 | 15 | 13 | 7 | 1 |
| Blush tomato | 11 | 24 | 18 | 10 | 2 |
| Sweet peas | 14 | 30 | 21 | 12 | 2 |
| Heartberry | 19 | 41 | 25 | 15 | 3 |
| Butter corn | 23 | 49 | 29 | 18 | 3 |
| Velvet aubergine | 29 | 62 | 34 | 21 | 4 |
| Moon pumpkin | 36 | 77 | 40 | 25 | 4 |
| Mint melon | 44 | 94 | 46 | 29 | 5 |
| Honey daisy | 10 | 22 | 17 | 9 | 2 |
| Coral poppy | 21 | 45 | 28 | 16 | 3 |
| Twilight aster | 33 | 71 | 38 | 23 | 4 |

| Animal | Cost | Product | Seconds | Sale | Level |
|---|---:|---|---:|---:|---:|
| Cloud hen | 48 | Egg | 16 | 13 | 1 |
| Clover cow | 115 | Milk | 24 | 27 | 2 |
| Mallow sheep | 165 | Wool | 31 | 38 | 3 |
| Honey hive | 210 | Honey | 36 | 47 | 4 |

Orders: 3 oats → 46c/20XP; 2 carrots → 47c/22XP; 2 eggs → 55c/25XP; 2 tomatoes + 1 carrot → 93c/28XP; 2 daisies + 1 oat → 81c/30XP. Beds cost 35c then increase by 15c each. An emergency gift of three oat seeds is available only when no coins sufficient for a pack, seeds, growing crops, inventory, or animals remain. No spoilage or animal feeding tax.

## Style comparison and refinement

Evidence authority: supplied REVERSE-ENGINEERING.md visual observations (bright pastel stickers, thick outlines, rounded shapes, angled fixed farm, pink trees, red/cream buildings, pond, fences, weather and ambient life). Attempting the live reference URL failed with ERR_TUNNEL_CONNECTION_FAILED. The image-read tool returned a PNG attachment, but this model's image-input interface explicitly reported that it cannot view images. Therefore this is a **description-based comparison and source/layout review, not a verified visual side-by-side verdict**. The screenshots are real browser renders, unedited.

Before captures are preserved as verification/before-*.png. The composition review identified tree silhouette prominence as an area to improve against the written pink-canopy reference: the two framing blossom trees were enlarged, then all four scenes were captured again in screenshots/. Farm beds use an approximately 2:1 diamond projection; cream panels have rounded edges, colored outlines, and warm shadows. The title fixture hides the entire gameplay HUD, and browser bounds checks confirmed all major title/HUD/panel rectangles fit 1280×720.

Remaining differences/limitations: visual similarity cannot be honestly certified without an image-capable reviewer. There is no passing car or walking villager. Buildings are deliberately simpler geometric illustrations. Performance refinement caches the landscape, so trees, windmill and pond duck are static; crops, livestock, bees, butterflies, rain, and reward popups remain animated. Day/night and weather tint apply only to the farm, leaving HUD contrast intact. The game is designed for desktop landscape; 960×540 was checked for page overflow, not exhaustive phone layouts. Audio was exercised through runtime calls, but not assessed by listening.

## Playtest and validation

End-to-end Playwright run used the normal game URL, pointer and keyboard input only, real elapsed time, no seeded inventory or mutated game state. The diagnostic API returns a deep copy and cannot mutate simulation state.

**Result: WON.** Five of five orders; 72.1667 simulation seconds; 270 coins left; 231 XP; 12 harvests; best score 2529; **zero console errors**. The successful run planted and explicitly watered six beds, adopted a hen, harvested, delivered two orders, sold surplus oats, bought tomato/daisy seeds and a seventh bed, planted a second cycle, collected two real egg production cycles, and sent all remaining baskets. It saved and reloaded midway. The clock excludes the pause/reload; wall time was not separately measured. This demonstrates ample room within the 480-second deadline, not a claim about first-time player completion speed.

Also passed in the full run: pause freezes time; mute toggles; immediate repeated animal collection awards nothing twice; autosave coins/order state survives reload; restart clears animals/coins/progress; keyboard planting works; no horizontal overflow at 960×540. Input trace and result: verification/playtest-result.json. Actual winning screenshot: verification/actual-win.png. Playwright recordings are in verification/video/; this folder also retains recordings of the earlier failed/timeout attempts, so use the JSON trace as the authoritative successful-run record.

Initial tests exposed slow-headless-render timing: clamping every frame to 0.1 seconds stretched growth. Fixed by caching static landscape drawing and allowing up to one second of bounded fixed-step catch-up. The successful run followed that fix. No FPS claim is made; the test environment is Linux with software-rendered Chromium 1255.

Separate rule tests exercised all twelve crops and all four animals, dry slowdown, rain auto-water, night/storm modifiers, locked purchases, duplicate sales/deliveries/collections, and bankruptcy rescue eligibility. Separate browser edge tests used a clearly labelled save at 479 seconds to test the loss boundary and restart (not a normal-play loss claim), plus blur/resume, corrupt-save fallback and all major panels staying in viewport. Results: verification/edge-result.json. The final small save-integrity changes prevent presentation fixtures from overwriting normal autosaves and reject duplicate/unknown saved order IDs; edge tests passed on these final sources.

Commands run: `node verification/playtest.mjs`, `node verification/rules.mjs`, `node verification/edge-cases.mjs`, `node verification/capture.mjs`, two `node main.ts` packaging runs with different MAKEFUN_OUTPUT_DIR values, and `node verification/integrity.mjs`. Verification tools depend on this machine's preinstalled playwright-core and Chromium paths; the shipped game and packaging have no dependency installation.

## Artifacts and deterministic dossier

Fourteen readable browser JavaScript modules separate simulation, content, input, drawing primitives, world rendering, UI, audio, effects, persistence and presentation fixtures. Game files total 57,723 bytes. Dossier size: 957,258 bytes. Both runs produced byte-identical dossier.json. The required vendor file matches the kit byte-for-byte. Game files are ordinary files with no symlinks.

Browser recordings are retained locally and excluded from git to keep the review repository compact. The successful full recording is `verification/video/page@5a0e009526f2ec9be8118d2a6817acf5.webm`; screenshots, input trace, and test results are committed.

| Screenshot | Pixels | Bytes |
|---|---|---:|
| 01-title.png (cover) | 1280×720 | 173645 |
| 02-play.png | 1280×720 | 189949 |
| 03-orders.png | 1280×720 | 155452 |
| 04-win.png | 1280×720 | 153319 |

All four PNGs are below 256 KiB. They use explicit presentation fixtures (`?shot=title/play/orders/win`) rendered by the actual game. The win fixture is illustrative; actual completion evidence is separately preserved.

**Dossier SHA-256:** `0e950ee95ffef4a339df0cd465f073c1e0aea903cee0c503a8b335ee44a50893`

Kit anchor: `0622cd4b92b2ae7e49305b8ed82a22904de85751`, round `33997467`. The CLI noted this downloaded kit is level 14 while the site is level 17; the requested local kit was retained. This was local verification, not a server grading or submission.
