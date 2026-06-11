import { useState } from 'react';

export default function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const onChange = ({ target }) => {
    setValue(target.value);
  };
  return [value, onChange, setValue];
}
