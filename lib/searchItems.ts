interface Params<T> {
  items: T[];
  query: string;
  getText: (item: T) => string;
}

export default function searchItems<T>({
  items,
  query,
  getText,
}: Params<T>): T[] {
  const queryLower = query.trim().toLowerCase();
  if (!queryLower) {
    return items;
  }

  const scored = items.map((item) => {
    const lowerText = getText(item).toLowerCase();
    const textTokens = lowerText.split(/[^a-z0-9]+/).filter(Boolean);

    let queryIndex = 0;
    let numTokensMatched = 0;
    for (const token of textTokens) {
      let hasMatched = false;
      for (const char of token) {
        if (char === queryLower[queryIndex]) {
          queryIndex++;
          hasMatched = true;

          if (queryIndex >= queryLower.length) {
            break;
          }
        } else {
          break;
        }
      }

      if (hasMatched) {
        numTokensMatched++;
      }

      if (queryIndex >= queryLower.length) {
        return { item, numTokensMatched };
      }
    }

    return { item, numTokensMatched: 0 };
  });

  console.log(scored);

  return scored
    .filter(({ numTokensMatched }) => numTokensMatched > 0)
    .sort((a, b) => a.numTokensMatched - b.numTokensMatched)
    .map(({ item }) => item);
}
