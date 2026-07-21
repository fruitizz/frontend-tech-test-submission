import React from 'react';

import {
  ColorPalette,
  ColorVariant,
  FlexBox,
  Progress,
  ProgressVariant,
  Size,
  Text,
  Typography,
} from '@lumx/react';

import styles from './CharacterCardSkeleton.module.scss';

interface CharacterCardSkeletonProps {
  query: string;
}

export const CharacterCardSkeleton: React.FC<CharacterCardSkeletonProps> = ({
  query,
}) => (
  <FlexBox
    className={styles.state}
    orientation="vertical"
    vAlign="center"
    hAlign="center"
    gap={Size.regular}
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <Progress variant={ProgressVariant.circular} />
    <Text
      as="p"
      typography={Typography.body1}
      color={ColorPalette.dark}
      colorVariant={ColorVariant.N}
    >
      Searching for “{query}”…
    </Text>
  </FlexBox>
);
