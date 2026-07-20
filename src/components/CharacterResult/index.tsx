import React from 'react';

import { mdiImageBroken } from '@lumx/icons';
import {
  AspectRatio,
  Chip,
  ColorPalette,
  FlexBox,
  Icon,
  Size,
  Thumbnail,
  ThumbnailObjectFit,
} from '@lumx/react';

import { Character } from '../../types';
import styles from './CharacterResult.module.scss';

interface CharacterResultProps {
  character: Character;
}

const hasDisplayValue = (value: string | undefined | null): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const CharacterResult: React.FC<CharacterResultProps> = ({ character }) => {
  const affiliations = character.affiliations.filter(hasDisplayValue);
  const imageUrl = hasDisplayValue(character.imageUrl) ? character.imageUrl : null;

  return (
    <article className={styles.card}>
      {imageUrl ? (
        <Thumbnail
          className={styles.thumbnail}
          image={imageUrl}
          alt={character.name}
          size={Size.xl}
          aspectRatio={AspectRatio.square}
          objectFit={ThumbnailObjectFit.cover}
        />
      ) : (
        <div
          className={`${styles.thumbnail} ${styles.thumbnailFallback}`}
          role="img"
          aria-label={character.name}
        >
          <Icon icon={mdiImageBroken} size={Size.m} />
        </div>
      )}

      <FlexBox className={styles.body} orientation="vertical">
        <div className={styles.header}>
          <h2 className={styles.name}>{character.name}</h2>
          {(hasDisplayValue(character.species) || hasDisplayValue(character.birthYear)) && (
            <div className={styles.meta}>
              {hasDisplayValue(character.species) && (
                <Chip size={Size.s} color={ColorPalette.blue}>
                  {character.species}
                </Chip>
              )}
              {hasDisplayValue(character.birthYear) && (
                <Chip size={Size.s} color={ColorPalette.green}>
                  {character.birthYear}
                </Chip>
              )}
            </div>
          )}
        </div>

        {hasDisplayValue(character.description) && (
          <p className={styles.description}>{character.description}</p>
        )}

        {affiliations.length > 0 && (
          <div className={styles.affiliations}>
            {affiliations.map((affiliation) => (
              <Chip key={affiliation} size={Size.s} color={ColorPalette.yellow}>
                {affiliation}
              </Chip>
            ))}
          </div>
        )}
      </FlexBox>
    </article>
  );
};
