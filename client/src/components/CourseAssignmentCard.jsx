import { Check, X } from 'lucide-react';
import { getBadgeColor } from '../utils/courseHelpers';
import Button from './Button';
import ClipLoader from 'react-spinners/ClipLoader';

function CourseAssignmentCard({
  course,
  onAssign,
  onUnassign,
  isLoading,
  showCheckbox = false,
  isSelected = false,
  onToggleSelect,
}) {
  const badgeColor = getBadgeColor(course.level);
  const isAssigned = course.status;

  return (
    <div className="relative">
      {/* Checkbox for bulk selection */}
      {showCheckbox && (
        <div className="absolute left-2 top-4">
          <input
            type="checkbox"
            checked={isSelected}
            disabled={isAssigned}
            onChange={() => onToggleSelect(course._id)}
            className={`w-4 h-4 rounded border-gray-300 focus:ring-0 transition-colors ${
              isAssigned
                ? 'text-green-600 cursor-not-allowed opacity-60'
                : 'text-blue-600 cursor-pointer hover:border-blue-400'
            }`}
          />
        </div>
      )}

      {/* Card container */}
      <div
        className={`group rounded-lg border px-7 py-4 shadow-sm transition-all flex h-full flex-col ${
          isSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
        }`}
      >
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm text-gray-900 leading-tight">
              {course.courseTitle}
            </h3>
            <span
              className={`text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded border ${badgeColor}`}
            >
              {course.courseCode}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {course.department?.name || 'No department info'}
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-4 pb-4 border-b border-gray-100 text-gray-500">
          <span>
            <span className="font-semibold text-gray-900">{course.level}</span> Level
          </span>
          <span>•</span>
          <span>
            <span className="font-semibold text-gray-900">{course.unit}</span> Unit
          </span>
          <span>•</span>
          <span>
            Status:{' '}
            <span
              className={`font-semibold ${
                isAssigned ? 'text-green-700' : 'text-gray-600'
              }`}
            >
              {isAssigned ? 'Assigned' : 'Unassigned'}
            </span>
          </span>
        </div>

        {/* Action Button */}
        {isAssigned ? (
          <Button
            onClick={() => onUnassign(course._id)}
            variant="danger"
            className="gap-1  mt-auto text-sm"
            size="md"
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader size={20} color="white" />
            ) : (
              <>
                <X size={18} /> Unassign
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => onAssign(course._id)}
            variant="primary"
            className="gap-1  mt-auto text-sm"
            size="md"
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader size={20} color="white" />
            ) : (
              <>
                <Check size={18} /> Assign
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default CourseAssignmentCard;
