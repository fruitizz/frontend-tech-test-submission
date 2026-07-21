import React from 'react';

import { mdiAlertCircleOutline } from '@lumx/icons';
import {
  Button,
  ColorPalette,
  ColorVariant,
  Emphasis,
  FlexBox,
  Icon,
  Size,
  Text,
  Typography,
} from '@lumx/react';

import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <FlexBox
    className={styles.state}
    orientation="vertical"
    vAlign="center"
    hAlign="center"
    gap={Size.regular}
    role="alert"
  >
    <Icon
      icon={mdiAlertCircleOutline}
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
      Something went wrong
    </Text>
    <Text
      as="p"
      typography={Typography.body1}
      color={ColorPalette.dark}
      colorVariant={ColorVariant.L1}
      className={styles.stateMessage}
    >
      {error}
    </Text>
    <Button emphasis={Emphasis.high} type="button" onClick={onRetry}>
      Retry
    </Button>
  </FlexBox>
);
