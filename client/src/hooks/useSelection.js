import { useState, useCallback } from 'react';

export function useSelection(initial = []) {
  const [selected, setSelected] = useState(initial);

  // toggle a single item
  const toggle = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  // check if an item is selected
  const isSelected = useCallback(
    (id) => selected.includes(id),
    [selected]
  );


  // clear all selections
  const clear = useCallback(() => {
    setSelected([]);
  }, []);

  return {
    selected,   // current array of selected IDs
    toggle,     // add/remove a single ID
    isSelected, // check if an ID is selected
    clear,      // clear all selections
  };
}
