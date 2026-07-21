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

import { buildPageItems } from '../../utils/pagination';
import styles from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (nextPage: number) => void;
}

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
          type="button"
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
              type="button"
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
          type="button"
          hideTooltip
          isDisabled={isLoading || !hasNext}
          onClick={() => onPageChange(page + 1)}
        />
      </FlexBox>
    </nav>
  );
};
