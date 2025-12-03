import QRScanErrorScreen from "../../../components/QRScanErrorScreen";
import QRScanLoadingScreen from "../../../components/QRScanLoadingScreen";
import QRScanSuccessScreen from "../../../components/QRScanSuccessScreen";
import QRScanWarningScreen from "../../../components/QRScanWarningScreen";
import { useQRAttendance } from "../../../hooks/useQRAttendance";

export default function AttendanceQRScan() {
  const { status, isCheckingAuth, isMarking, error } = useQRAttendance();

  // loading states
  if (isCheckingAuth) {
    return <QRScanLoadingScreen message="Checking authentication..." />;
  }

  if (isMarking) {
    return <QRScanLoadingScreen message="Marking attendance..." />;
  }

  // status screens
  if (status === 'success') {
    return (
      <QRScanSuccessScreen
        title="✅ Attendance Marked!"
        message="Your attendance has been recorded successfully."
      />
    );
  }

  if (status === 'error') {
    return (
      <QRScanErrorScreen
        title="❌ Failed"
        message={error}
      />
    );
  }

  if (status === 'invalid') {
    return (
      <QRScanWarningScreen
        title="⚠️ Invalid QR Code"
        message="This QR code is invalid or has expired."
      />
    );
  }

  return null;
}
