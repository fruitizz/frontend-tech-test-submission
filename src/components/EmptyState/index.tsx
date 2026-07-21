import React from 'react';

import { mdiMagnify } from '@lumx/icons';
import {
  ColorPalette,
  ColorVariant,
  FlexBox,
  Icon,
  Size,
  Text,
  Typography,
} from '@lumx/react';

import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  variant: 'idle' | 'empty';
  query?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ variant, query }) => {
  if (variant === 'idle') {
    return (
      <FlexBox
        className={styles.state}
        orientation="vertical"
        vAlign="center"
        hAlign="center"
        gap={Size.regular}
        role="status"
        aria-live="polite"
      >
        <Icon
          icon={mdiMagnify}
          size={Size.l}
          color={ColorPalette.dark}
          colorVariant={ColorVariant.L2}
        />
        <Text
          as="h2"
          typography={Typography.custom.title3}
          color={ColorPalette.dark}
          colorVariant={ColorVariant.N}
          className={styles.stateTitle}
        >
          Search for a character to get started.
        </Text>
      </FlexBox>
    );
  }

  return (
    <FlexBox
      className={styles.state}
      orientation="vertical"
      vAlign="center"
      hAlign="center"
      gap={Size.regular}
      role="status"
      aria-live="polite"
    >
      <Icon
        icon={mdiMagnify}
        size={Size.l}
        color={ColorPalette.dark}
        colorVariant={ColorVariant.L2}
      />
      <Text
        as="h2"
        typography={Typography.custom.title3}
        color={ColorPalette.dark}
        colorVariant={ColorVariant.N}
        className={styles.stateTitle}
      >
        No results matched your search.
      </Text>
      <Text
        as="p"
        typography={Typography.body1}
        color={ColorPalette.dark}
        colorVariant={ColorVariant.L1}
        className={styles.stateMessage}
      >
        {`No characters matched “${query}”. Try a different search.`}
      </Text>
    </FlexBox>
  );
};
