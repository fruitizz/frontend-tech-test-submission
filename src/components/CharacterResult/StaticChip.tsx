import React from 'react';

import { Chip, ColorPalette, Size } from '@lumx/react';

type StaticChipSize = Extract<Size, 's' | 'm'>;

interface StaticChipProps {
  children: React.ReactNode;
  color: ColorPalette;
  size?: StaticChipSize;
}

/**
 * Non-interactive chip look-alike.
 * LumX `Chip` always renders an `<a>`; when unused as a control that is a
 * faux interactive element. Prefer a span so cards stay keyboard-clean.
 */
export const StaticChip: React.FC<StaticChipProps> = ({
  children,
  color,
  size = Size.s,
}) => {
  const root = Chip.className;

  return (
    <span
      className={[
        root,
        `${root}--color-${color}`,
        `${root}--size-${size}`,
        `${root}--is-unselected`,
      ].join(' ')}
    >
      <span className={`${root}__label`}>{children}</span>
    </span>
  );
};
