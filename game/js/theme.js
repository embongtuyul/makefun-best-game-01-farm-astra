// Compatibility vocabulary for historical guide/help copy. State IDs stay stable.
export function cryptoText(text) {
  const replacements = [
    [/Free Farm/g,'Free Trade'],[/Petalpost Farm/g,'Coinfield Exchange'],
    [/Cloud hen/g,'GPU rig'],[/Golden oats/g,'BTC'],[/Peach carrot/g,'ETH'],
    [/Blush tomato/g,'SOL'],[/Honey daisy/g,'DOGE'],
    [/picnic/g,'market close'],[/baskets/g,'trades'],[/basket/g,'trade'],
    [/villagers/g,'traders'],[/neighbors/g,'brokers'],[/pasture/g,'hardware floor'],
    [/animals/g,'hardware'],[/animal/g,'producer'],[/\bhen\b/g,'GPU rig'],[/eggs/g,'Hash'],
    [/tomatoes/g,'SOL'],[/daisies/g,'DOGE'],[/flowers/g,'meme tokens'],[/Flowers/g,'Meme tokens'],
    [/bees/g,'liquidity pools'],[/Barn/g,'Vault'],[/barn/g,'vault'],
    [/garden/g,'exchange'],[/farm/g,'exchange'],[/Farm/g,'Exchange'],
    [/seeds/g,'launches'],[/seed/g,'launch'],[/Seed/g,'Token'],
    [/bed/g,'bay'],[/crops/g,'tokens'],[/crop/g,'token'],
    [/Plant/g,'Mine'],[/plant/g,'mine'],[/water/g,'power'],[/Water/g,'Power'],
    [/Rain/g,'Altseason'],[/Night/g,'Low volume'],[/growth/g,'mining'],
  ];
  for (const [pattern,replacement] of replacements) text=text.replace(pattern,replacement);
  return text;
}

export function themeVisibleText(root) {
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) walker.currentNode.textContent=cryptoText(walker.currentNode.textContent);
}
