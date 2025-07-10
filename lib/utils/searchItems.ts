interface Params<T> {
  items: T[];
  query: string;
  getText: (item: T) => string;
}

type Match = { queryIndex: number; numTokensMatched: number };

export default function searchItems<T>({
  items,
  query,
  getText,
}: Params<T>): T[] {
  const sortedItems = items
    .slice()
    .sort((a, b) => getText(a).localeCompare(getText(b)));

  const queryLower = query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  if (!queryLower) {
    return sortedItems;
  }
  const scored = sortedItems.map((item) => {
    const lowerText = getText(item).toLowerCase();
    const textTokens = lowerText.split(/[^a-z0-9]+/).filter(Boolean);

    const matches: Match[] = [{ queryIndex: 0, numTokensMatched: 0 }];
    for (const token of textTokens) {
      const newMatches: Match[] = [];
      for (const match of matches) {
        let queryIndex = match.queryIndex;
        if (queryIndex >= queryLower.length) {
          continue;
        }

        for (const char of token) {
          if (char === queryLower[queryIndex]) {
            queryIndex++;

            newMatches.push({
              queryIndex: queryIndex,
              numTokensMatched: match.numTokensMatched + 1,
            });

            if (queryIndex >= queryLower.length) {
              break;
            }
          } else {
            break;
          }
        }
      }
      matches.push(...newMatches);
    }
    let minTokensMatched = Infinity;
    for (const match of matches) {
      if (match.queryIndex >= queryLower.length) {
        minTokensMatched = Math.min(minTokensMatched, match.numTokensMatched);
      }
    }
    if (minTokensMatched === Infinity) {
      minTokensMatched = 0;
    }

    return { item, numTokensMatched: minTokensMatched };
  });

  return scored
    .filter(({ numTokensMatched }) => numTokensMatched > 0)
    .sort((a, b) => a.numTokensMatched - b.numTokensMatched)
    .map(({ item }) => item);
}
