import { CheckCircle, Clock, XCircle } from 'lucide-react';

export const getBadgeColor = (level) => {
  if (level >= 700) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (level >= 600) return 'bg-pink-50 text-pink-700 border-pink-200';
  if (level >= 500) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (level >= 400) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (level >= 300) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (level >= 200) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  return 'bg-gray-50 text-gray-700 border-gray-200';
};

export const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return 'bg-green-50 text-green-700 border-green-200';
  if (percentage >= 75) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (percentage >= 50) return 'bg-orange-50 text-orange-700 border-orange-200';
  return 'bg-red-50 text-red-700 border-red-200';
};

export const getProgressBarColor = (percentage) => {
  if (percentage >= 90) return 'bg-green-500';
  if (percentage >= 75) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-orange-500';
  return 'bg-red-500';
};

export const getStatusBadge = (status) => {
  const statusConfig = {
    Present: {
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800',
      label: 'Present',
    },
    Absent: {
      icon: XCircle,
      className: 'bg-red-100 text-red-800',
      label: 'Absent',
    },
    default: {
      icon: Clock,
      className: 'bg-gray-100 text-gray-800',
      label: 'Not Yet Taken',
    },
  };
  return statusConfig[status] || statusConfig.default;
};
