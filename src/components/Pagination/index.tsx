import React from 'react';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import { Icon, Size } from '@lumx/react';

import styles from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (nextPage: number) => void;
}

type PageItem = number | 'ellipsis';

const buildPageItems = (current: number, totalPages: number): PageItem[] => {
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

export const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  limit,
  isLoading,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageItems = buildPageItems(page, totalPages);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="Search results pagination">
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          aria-label="Previous page"
          disabled={isLoading || !hasPrevious}
          onClick={() => onPageChange(page - 1)}
        >
          <Icon icon={mdiChevronLeft} size={Size.xs} />
        </button>

        {pageItems.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className={styles.ellipsis}
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={
                item === page
                  ? `${styles.control} ${styles.controlActive}`
                  : styles.control
              }
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
              disabled={isLoading || item === page}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.control}
          aria-label="Next page"
          disabled={isLoading || !hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          <Icon icon={mdiChevronRight} size={Size.xs} />
        </button>
      </div>
    </nav>
  );
};
