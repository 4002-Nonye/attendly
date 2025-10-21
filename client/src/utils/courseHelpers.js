export const getBadgeColor = (level) => {
  if (level >= 700) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (level >= 600) return 'bg-pink-50 text-pink-700 border-pink-200';
  if (level >= 500) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (level >= 400) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (level >= 300) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (level >= 200) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  return 'bg-gray-50 text-gray-700 border-gray-200';
};