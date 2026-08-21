import type { BaseSyntheticEvent } from 'react';
import React from 'react';

export type UseSearchInputProps = {
  onChange: Function;
};

const DEBOUNCE_TIMEOUT = 700;

const useSearchInput = ({ onChange }: UseSearchInputProps) => {
  const [keyword, setKeyword] = React.useState('');

  const handleOnChange = (e: BaseSyntheticEvent) => setKeyword(e.target.value);

  const handleResetKeyword = () => setKeyword('');

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      onChange(keyword);
    }, DEBOUNCE_TIMEOUT);

    return () => clearTimeout(debounce);
  }, [keyword, onChange]);

  return { keyword, handleOnChange, handleResetKeyword };
};

export default useSearchInput;
