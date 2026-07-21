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

import { hasDisplayValue } from '../../utils/display';
import { Character, Reaction } from '../../types';
import styles from './CharacterResult.module.scss';

interface CharacterResultProps {
  character: Character;
  reactions: Reaction[];
}

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
          alt=""
          size={Size.xl}
          aspectRatio={AspectRatio.square}
          objectFit={ThumbnailObjectFit.cover}
        />
      ) : (
        <div
          className={`${styles.thumbnail} ${styles.thumbnailFallback}`}
          aria-hidden="true"
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
            <ul className={styles.meta} aria-label="Character details">
              {hasDisplayValue(character.species) && (
                <li className={styles.metaItem}>
                  <Chip size={Size.s} color={ColorPalette.blue}>
                    {character.species}
                  </Chip>
                </li>
              )}
              {hasDisplayValue(character.birthYear) && (
                <li className={styles.metaItem}>
                  <Chip size={Size.s} color={ColorPalette.green}>
                    {character.birthYear}
                  </Chip>
                </li>
              )}
            </ul>
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
          <ul className={styles.affiliations} aria-label="Affiliations">
            {affiliations.map((affiliation) => (
              <li key={affiliation} className={styles.affiliationItem}>
                <Chip size={Size.s} color={ColorPalette.yellow}>
                  {affiliation}
                </Chip>
              </li>
            ))}
          </ul>
        )}

        {reactions.length > 0 && (
          <ul className={styles.reactions} aria-label={`Reactions for ${character.name}`}>
            {reactions.map((reaction, index) => (
              <li
                key={`${reaction.id}-${index}`}
                className={styles.reaction}
              >
                <Text as="span" typography={Typography.body1}>
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
