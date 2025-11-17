export const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatYear = (dateStr,monthOpt='long') => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {

    year: 'numeric',
    month:monthOpt,
    day: 'numeric',
   
  });
};
