import { useMutation } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { downloadAttendanceReport as downloadAttendanceReportApi } from '../../../apis/attendance/apiAttendance';

export function useDownloadReport() {
  const mutation = useMutation({
    mutationFn: downloadAttendanceReportApi,
    onSuccess: (blob, courseId) => {
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance-report-${courseId}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!');
    },
    onError: (err) => toast.error(err.error),
  });

  return {
    downloadAttendanceReport: mutation.mutate,
    isPending: mutation.isPending,
  };
}
