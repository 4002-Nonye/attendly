import { Download, Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

import Button from './Button';

function DownloadReportButton({ 
  onDownload, 
  isDownloading, 
  disabled,
  className = '',
  size = 'sm',
  variant = 'primary',
  showText = true,
  children 
}) {
  return (
    <Button
      variant={variant}
      className={`gap-2 ${className}`}
      size={size}
      onClick={onDownload}
      disabled={disabled || isDownloading}
    >
      {isDownloading ? (
        <>
          <Loader2 className='w-4 h-4 animate-spin' />
          {showText && (
            <span className='hidden sm:inline'>Generating PDF...</span>
          )}
        </>
      ) : (
        <>
          <Download className='w-4 h-4' />
          {showText && (
            <span className='hidden sm:inline'>
              {children || 'Download Report'}
            </span>
          )}
        </>
      )}
    </Button>
  );
}

DownloadReportButton.propTypes = {
  onDownload: PropTypes.func.isRequired,
  isDownloading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline','pill', 'danger']),
  showText: PropTypes.bool,
  children: PropTypes.node,
};

export default DownloadReportButton;