import React from 'react';

import { mdiImageBroken } from '@lumx/icons';
import {
  AspectRatio,
  Chip,
  ColorPalette,
  ColorVariant,
  FlexBox,
  Icon,
  Size,
  Text,
  Thumbnail,
  ThumbnailObjectFit,
  Typography,
} from '@lumx/react';

import { Character, Reaction } from '../../types';
import styles from './CharacterResult.module.scss';

interface CharacterResultProps {
  character: Character;
  reactions: Reaction[];
}

const hasDisplayValue = (value: string | undefined | null): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const CharacterResult: React.FC<CharacterResultProps> = ({
  character,
  reactions,
}) => {
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
          <Icon
            icon={mdiImageBroken}
            size={Size.m}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.L3}
          />
        </div>
      )}

      <FlexBox className={styles.body} orientation="vertical" gap={Size.medium}>
        <div className={styles.header}>
          <Text
            as="h2"
            typography={Typography.title}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.N}
            className={styles.name}
          >
            {character.name}
          </Text>
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
          <Text
            as="p"
            typography={Typography.body1}
            color={ColorPalette.dark}
            colorVariant={ColorVariant.L1}
            className={styles.description}
          >
            {character.description}
          </Text>
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

        {reactions.length > 0 && (
          <ul className={styles.reactions} aria-label={`Reactions for ${character.name}`}>
            {reactions.map((reaction, index) => (
              <li
                key={`${reaction.id}-${index}`}
                className={styles.reaction}
              >
                <Text as="span" typography={Typography.body1} aria-hidden="true">
                  {reaction.content}
                </Text>
              </li>
            ))}
          </ul>
        )}
      </FlexBox>
    </article>
  );
};
