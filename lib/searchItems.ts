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
  if (!query.trim()) return items;

  const lowerQuery = query.trim().toLowerCase();
  return items.filter((item) => {
    const lowerText = getText(item).toLowerCase();

    if (lowerText.includes(lowerQuery)) {
      return true;
    }

    let targetIndex = 0;
    for (const char of lowerQuery) {
      targetIndex = lowerText.indexOf(char, targetIndex);
      if (targetIndex === -1) {
        return false;
      }
      targetIndex++;
    }
    return true;
  });
}
