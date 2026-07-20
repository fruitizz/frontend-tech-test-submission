import React, { useEffect, useId, useRef, useState } from 'react';

import { mdiClose, mdiMagnify } from '@lumx/icons';
import {
  Button,
  Dialog,
  Emphasis,
  Heading,
  IconButton,
  Size,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from '@lumx/react';

import styles from './SearchModal.module.scss';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (name: string) => void;
  /** Element that had focus when the modal opened; receives focus again on close. */
  parentElement: React.RefObject<HTMLElement | null>;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  parentElement,
}) => {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftQuery, setDraftQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setDraftQuery('');
    }
  }, [isOpen]);

  const submitSearch = () => {
    const name = draftQuery.trim();
    if (!name) {
      return;
    }
    onSearch(name);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size={Size.tiny}
      parentElement={parentElement as React.RefObject<HTMLElement>}
      focusElement={inputRef as React.RefObject<HTMLElement>}
      dialogProps={{ 'aria-labelledby': titleId }}
      className={styles.dialog}
    >
      <header>
        <Toolbar
          label={
            <Heading id={titleId} typography={Typography.title}>
              Search characters
            </Heading>
          }
          after={
            <IconButton
              label="Close search"
              icon={mdiClose}
              emphasis={Emphasis.low}
              type="button"
              onClick={onClose}
            />
          }
        />
      </header>

      <div className={styles.body}>
        <TextField
          className={styles.field}
          theme={Theme.light}
          icon={mdiMagnify}
          label="Search"
          value={draftQuery}
          onChange={setDraftQuery}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
          clearButtonProps={
            draftQuery.length > 0 ? { label: 'Clear search' } : undefined
          }
          onClear={() => setDraftQuery('')}
        />
      </div>

      <footer>
        <Toolbar
          after={
            <Button
              emphasis={Emphasis.high}
              type="button"
              onClick={submitSearch}
              isDisabled={!draftQuery.trim()}
            >
              Search
            </Button>
          }
        />
      </footer>
    </Dialog>
  );
};
