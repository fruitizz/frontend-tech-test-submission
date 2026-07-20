import React, { useEffect, useRef, useState } from 'react';

import { mdiCloseCircle, mdiMagnify } from '@lumx/icons';
import { Emphasis, FlexBox, IconButton, Size, TextField, Theme, Thumbnail } from '@lumx/react';

import styles from './Header.module.scss';
import logo from '../../assets/logo.png';

interface HeaderProps {
  onSearch: (name: string) => void;
  onClearSearch: () => void;
  hasActiveSearch: boolean;
}

const isEditableControl = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;
  return (
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT' ||
    target.isContentEditable
  );
};

const SEARCH_SHORTCUT_PLACEHOLDER =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    ? 'Search (⌘K)'
    : 'Search (Ctrl+K)';

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onClearSearch,
  hasActiveSearch,
}) => {
  const [draftQuery, setDraftQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') {
        return;
      }

      // Do not hijack typing in other editable controls.
      // If focus is already in the search input, still prevent the browser default.
      if (isEditableControl(event.target) && event.target !== searchInputRef.current) {
        return;
      }

      event.preventDefault();
      searchInputRef.current?.focus();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

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
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      if (draftQuery.length > 0 || hasActiveSearch) {
        handleClear();
        return;
      }
      // Nothing to clear: remove focus from the search input.
      searchInputRef.current?.blur();
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
          placeholder={SEARCH_SHORTCUT_PLACEHOLDER}
          value={draftQuery}
          onChange={setDraftQuery}
          onKeyDown={handleKeyDown}
          inputRef={searchInputRef}
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
