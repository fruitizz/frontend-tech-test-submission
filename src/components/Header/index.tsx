import React, { useState } from 'react';

import { mdiCloseCircle, mdiMagnify } from '@lumx/icons';
import { Emphasis, FlexBox, IconButton, Size, TextField, Theme, Thumbnail } from '@lumx/react';

import styles from './Header.module.scss';
import logo from '../../assets/logo.png';

interface HeaderProps {
  onSearch: (name: string) => void;
  onClearSearch: () => void;
  hasActiveSearch: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onClearSearch,
  hasActiveSearch,
}) => {
  const [draftQuery, setDraftQuery] = useState('');

  const submitSearch = () => {
    const name = draftQuery.trim();
    if (!name) {
      return;
    }
    onSearch(name);
  };

  const handleClear = () => {
    setDraftQuery('');
    onClearSearch();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch();
    }
  };

  const hasDraft = draftQuery.length > 0;
  // TextField's built-in clear only renders when the value is non-empty.
  // Keep a focusable clear control when a submitted search is still active.
  const showActiveSearchClear = !hasDraft && hasActiveSearch;

  return (
    <header className={styles.header}>
      <FlexBox className={styles.logo} orientation="horizontal" vAlign="space-between" hAlign="center">
        <Thumbnail
          image={logo}
          className={styles.logo}
          alt="My Static App Logo"
        />

        <TextField
          className={styles.search}
          theme={Theme.light}
          icon={mdiMagnify}
          label="Search"
          value={draftQuery}
          onChange={setDraftQuery}
          onKeyDown={handleKeyDown}
          clearButtonProps={hasDraft ? { label: 'Clear search' } : undefined}
          onClear={handleClear}
          afterElement={
            showActiveSearchClear ? (
              <IconButton
                label="Clear search"
                icon={mdiCloseCircle}
                emphasis={Emphasis.low}
                size={Size.s}
                theme={Theme.light}
                type="button"
                onClick={handleClear}
              />
            ) : undefined
          }
        />
      </FlexBox>
    </header>
  );
};
