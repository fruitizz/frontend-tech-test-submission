import React from 'react';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';
import { Button, Emphasis, FlexBox, Size } from '@lumx/react';

import styles from './Pagination.module.scss';

interface PaginationProps {
  hasPrevious: boolean;
  hasNext: boolean;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  hasPrevious,
  hasNext,
  isLoading,
  onPrevious,
  onNext,
}) => {
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
        <Button
          emphasis={Emphasis.medium}
          size={Size.m}
          leftIcon={mdiChevronLeft}
          isDisabled={isLoading || !hasPrevious}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          emphasis={Emphasis.medium}
          size={Size.m}
          rightIcon={mdiChevronRight}
          isDisabled={isLoading || !hasNext}
          onClick={onNext}
        >
          Next
        </Button>
      </FlexBox>
    </nav>
  );
};
