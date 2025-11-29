import { useMutation } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { downloadAttendanceReport as downloadAttendanceReportApi } from '../../../apis/attendance/apiAttendance';

export function useDownloadReport() {
  const mutation = useMutation({
    mutationFn: downloadAttendanceReportApi,
    onSuccess: (data) => {
     
      const { blob, filename } = data;

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename; // Use the filename from backend
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!');
    },
    onError: (err) => {
      const errorMessage =  err?.message || 'Failed to download report';
      toast.error(errorMessage);
    },
  });

  return {
    downloadAttendanceReport: mutation.mutate,
    isPending: mutation.isPending,
  };
}

