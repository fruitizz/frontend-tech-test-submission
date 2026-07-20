import React from 'react';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import {
  Button,
  ColorPalette,
  ColorVariant,
  Emphasis,
  FlexBox,
  IconButton,
  Size,
  Text,
  Typography,
} from '@lumx/react';

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
      <FlexBox
        className={styles.controls}
        orientation="horizontal"
        vAlign="center"
        hAlign="center"
        gap={Size.regular}
        wrap
      >
        <IconButton
          className={styles.control}
          label="Previous page"
          icon={mdiChevronLeft}
          emphasis={Emphasis.medium}
          size={Size.m}
          hideTooltip
          isDisabled={isLoading || !hasPrevious}
          onClick={() => onPageChange(page - 1)}
        />

        {pageItems.map((item, index) =>
          item === 'ellipsis' ? (
            <Text
              key={`ellipsis-${index}`}
              as="span"
              className={styles.ellipsis}
              typography={Typography.body1}
              color={ColorPalette.dark}
              colorVariant={ColorVariant.L2}
              aria-hidden="true"
            >
              …
            </Text>
          ) : (
            <Button
              key={item}
              className={styles.control}
              emphasis={Emphasis.medium}
              size={Size.m}
              isSelected={item === page}
              isDisabled={isLoading}
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ),
        )}

        <IconButton
          className={styles.control}
          label="Next page"
          icon={mdiChevronRight}
          emphasis={Emphasis.medium}
          size={Size.m}
          hideTooltip
          isDisabled={isLoading || !hasNext}
          onClick={() => onPageChange(page + 1)}
        />
      </FlexBox>
    </nav>
  );
};
