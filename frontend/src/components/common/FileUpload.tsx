import React, { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaEye } from 'react-icons/fa';
import { colors, borderRadius, typography, commonStyles } from '../../styles/constants';

interface UploadedFile {
  id?: string;
  file?: File;
  filename: string;
  content_type?: string;
  byte_size?: number;
  url?: string;
  preview?: string;
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  existingFiles?: UploadedFile[];
  onRemoveExistingFile?: (fileId: string) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  theme?: 'light' | 'dark'; // for popup contexts
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  existingFiles = [],
  onRemoveExistingFile,
  multiple = true,
  accept = "*/*",
  maxSize = 10, // 10MB default
  disabled = false,
  label = "Upload Files",
  placeholder = "Drag and drop files here, or click to select",
  theme = 'light'
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileSelection(files);
    }
  };

  const handleFileSelection = (files: File[]) => {
    // Validate file sizes
    const validFiles = files.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });

    if (!multiple && validFiles.length > 1) {
      alert("Only one file can be selected.");
      return;
    }

    setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    onFilesChange(multiple ? [...selectedFiles, ...validFiles] : validFiles);
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (contentType: string = '') => {
    if (contentType.startsWith('image/')) return '🖼️';
    if (contentType.startsWith('video/')) return '🎥';
    if (contentType.startsWith('audio/')) return '🎵';
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('word') || contentType.includes('document')) return '📝';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📊';
    if (contentType.includes('powerpoint') || contentType.includes('presentation')) return '📊';
    if (contentType.includes('zip') || contentType.includes('rar')) return '🗜️';
    return '📁';
  };

  const dropZoneStyle: React.CSSProperties = {
    border: `2px dashed ${dragOver ? colors.primary.light : (theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : colors.neutral.gray300)}`,
    borderRadius: borderRadius.large,
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: dragOver ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : colors.secondary.lightBlue) : (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : colors.neutral.white),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.6 : 1,
  };

  const fileListStyle: React.CSSProperties = {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const fileItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : colors.neutral.lightGray,
    borderRadius: borderRadius.medium,
    border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : colors.neutral.gray200}`,
  };

  return (
    <div>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.semibold,
          color: theme === 'dark' ? colors.text.white : colors.text.primary,
        }}>
          {label}
        </label>
      )}
      
      <div
        style={dropZoneStyle}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        <FaCloudUploadAlt style={{
          fontSize: '3rem',
          color: colors.primary.light,
          marginBottom: '16px'
        }} />
        
        <div style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : colors.text.primary,
          marginBottom: '8px'
        }}>
          {placeholder}
        </div>
        
        <div style={{
          fontSize: typography.fontSize.sm,
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : colors.text.secondary
        }}>
          Maximum file size: {maxSize}MB {multiple ? '• Multiple files allowed' : '• Single file only'}
        </div>
      </div>

      {/* Display existing files */}
      {existingFiles.length > 0 && (
        <div style={fileListStyle}>
          <h4 style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: theme === 'dark' ? colors.text.white : colors.text.primary,
            margin: '0 0 8px 0'
          }}>
            Existing Files:
          </h4>
          {existingFiles.map((file, index) => (
            <div key={file.id || index} style={fileItemStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{getFileIcon(file.content_type)}</span>
                <div>
                  <div style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : colors.text.primary
                  }}>
                    {file.filename}
                  </div>
                  {file.byte_size && (
                    <div style={{
                      fontSize: typography.fontSize.xs,
                      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : colors.text.secondary
                    }}>
                      {formatFileSize(file.byte_size)}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {file.url && (
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    style={{
                      ...commonStyles.button.primary,
                      padding: '6px 12px',
                      fontSize: typography.fontSize.xs,
                    }}
                    title="View/Download"
                  >
                    <FaEye />
                  </button>
                )}
                {onRemoveExistingFile && file.id && (
                  <button
                    onClick={() => onRemoveExistingFile(file.id!)}
                    style={{
                      ...commonStyles.button.danger,
                      padding: '6px 12px',
                      fontSize: typography.fontSize.xs,
                    }}
                    title="Remove"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display selected files */}
      {selectedFiles.length > 0 && (
        <div style={fileListStyle}>
          <h4 style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: theme === 'dark' ? colors.text.white : colors.text.primary,
            margin: '0 0 8px 0'
          }}>
            Selected Files:
          </h4>
          {selectedFiles.map((file, index) => (
            <div key={index} style={fileItemStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{getFileIcon(file.type)}</span>
                <div>
                  <div style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : colors.text.primary
                  }}>
                    {file.name}
                  </div>
                  <div style={{
                    fontSize: typography.fontSize.xs,
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : colors.text.secondary
                  }}>
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeSelectedFile(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.status.error,
                  padding: '4px',
                  borderRadius: borderRadius.small,
                }}
                title="Remove"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
