import { useState } from 'react';

type Result = [boolean, VoidFunction];

export default function useToggle(defaultValue?: boolean) {
  const [state, setState] = useState(defaultValue ?? false);

  function toggle() {
    setState(prevState => !prevState);
  }

  const result: Result = [state, toggle];

  return result;
}
