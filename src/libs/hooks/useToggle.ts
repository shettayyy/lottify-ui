import { useCallback, useState } from 'react';

type Result = [boolean, VoidFunction];

export default function useToggle(defaultValue?: boolean): Result {
  const [state, setState] = useState(defaultValue ?? false);

  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);

  return [state, toggle];
}
