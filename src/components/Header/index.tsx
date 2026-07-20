import React, { useState } from 'react';

import { FlexBox, Thumbnail, TextField, Theme } from '@lumx/react';
import { mdiMagnify } from '@lumx/icons';

import styles from './Header.module.scss';
import logo from '../../assets/logo.png';

interface HeaderProps {
  onSearch: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [draftQuery, setDraftQuery] = useState('');

  const submitSearch = () => {
    const name = draftQuery.trim();
    if (!name) {
      return;
    }
    onSearch(name);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch();
    }
  };

  return (
    <header className={styles.header}>
      <FlexBox className={styles.logo} orientation="horizontal" vAlign="space-between" hAlign="center">
        <Thumbnail
          image={logo}
          className={styles.logo}
          alt="My Static App Logo"
        />

        <TextField
          theme={Theme.light}
          icon={mdiMagnify}
          label="Search"
          value={draftQuery}
          onChange={setDraftQuery}
          onKeyDown={handleKeyDown}
        />
      </FlexBox>
    </header>
  );
};
