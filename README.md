# Coinfield Exchange

[![make.fun](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01)
[![Rank](https://make.fun/badge/best-game-01/embongtuyul/makefun-best-game-01-farm-astra/rank.svg)](https://make.fun/bounty/best-game-01)
[![Reward](https://make.fun/badge/best-game-01/embongtuyul/makefun-best-game-01-farm-astra/reward.svg)](https://make.fun/bounty/best-game-01)

A cozy crypto mining and trading game. Mine BTC, ETH, SOL, BNB, XRP, ADA, AVAX, LINK, DOT and the meme trio DOGE/PEPE/SHIB. Install GPU rigs, ASIC miners, staking nodes and liquidity pools. Settle five trades before market close to launch your exchange.

Mine with CZ and the BNB buddy: an original canvas-drawn avatar in a black hoodie and glasses walks to your selected bay, powers it, and scoops up tokens while his diamond companion follows. Actions still resolve immediately; the character is visual only. He celebrates when your listing goes live.

Zoom the exchange from 1× to 3× with +/−, wheel, pinch, or a background drag. Use 🔍 Detail to inspect any bay, producer, building, CZ, or BNB buddy; cards stay readable and show live stats. Double-click or ⤢ resets the camera.

All coin logos are drawn in canvas with discs, symbols and simple geometry. No image downloads, runtime network access, build step or installed game dependencies. Music and effects are synthesized with WebAudio.

```sh
python3 -m http.server 8080 --directory game
```

Open `http://localhost:8080`. Tap an empty diamond bay to mine the selected token; tap again to power it; harvest its checkmark into the Vault. Sell surplus or reserve assets for Trades. Install a GPU rig to collect Hash for the OTC trade. Altseason supplies power and accelerates mining; low-volume hours slow output. DOGE, PEPE and SHIB mining boosts liquidity-pool output.

Choose Relaxed (12 minutes, score ×0.8), Normal (8 minutes, ×1), or Rush (5 minutes, ×1.5). Market Day offers one of three daily bonuses. Free Trade keeps your exchange after victory and refreshes completed trade boards without a deadline. First-session hints and the Guide explain the loop. Settings provides persistent master/music/SFX sliders and mute. The full stage fits phones and desktop proportionally.

Arrows select bays; Space mines/powers/harvests; brackets cycle tokens; A collects ready hardware output. S/B/O/H open Shop/Vault/Trades/Guide. P pauses, M mutes, Escape closes a panel or pauses, Enter starts/restarts. Tab/Enter navigate menu buttons. Current sessions, best scores and settings persist locally.

Generate the deterministic competition output using Node 22.18+:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/coinfield-output node main.ts
```

Screenshots use the game's own `?shot=title/play/orders/win` presentation scenes. The normal game has no mutable debug API. Historical simulation identifiers remain stable for save compatibility; public names, canvas marks, and verification assertions identify the crypto theme. See `BUILD-REPORT.md` and `verification/` for evidence and limitations.

Created for [make.fun best-game-01](https://make.fun/bounty/best-game-01). MIT licensed.
