export type PageItem = number | 'ellipsis';

/** Derive total page count from API total + page size. */
export const getTotalPages = (total: number, limit: number): number =>
  Math.max(1, Math.ceil(total / limit));

export const buildPageItems = (
  current: number,
  totalPages: number,
): PageItem[] => {
  if (totalPages <= 0) {
    return [];
  }

  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, current]);
  if (current - 1 > 1) {
    pages.add(current - 1);
  }
  if (current + 1 < totalPages) {
    pages.add(current + 1);
  }
  if (current === 1) {
    pages.add(2);
  }
  if (current === totalPages) {
    pages.add(totalPages - 1);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    if (index > 0 && sorted[index] - sorted[index - 1] > 1) {
      items.push('ellipsis');
    }
    items.push(sorted[index]);
  }

  return items;
};
