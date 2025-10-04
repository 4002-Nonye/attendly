import { useState } from 'react';

export const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((prev) => !prev);

  return {toggle,visible}
};
