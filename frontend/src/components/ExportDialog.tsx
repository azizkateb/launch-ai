import React, { useState } from 'react';
import { DownloadIcon, CheckCircle, AlertCircle, LoaderIcon } from 'lucide-react';

export default function ExportDialog({ generatedContent, isOpen, onClose }) {
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const frameworks = [
    { id: 'react', label: 'React', description: 'React + Vite + JSX' },
    { id: 'html', label: 'HTML / CSS / JS', description: 'Pure static site' },
    { id: 'angular', label: 'Angular', description: 'Angular 17 with standalone' },
  ];

  const handleExport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDownloadUrl(null);

      const response = await fetch('http://localhost:5000/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: generatedContent,
          framework: selectedFramework,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Export failed');
      }

      if (result.success && result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
        // Auto-download
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.fileName || `project-${selectedFramework}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to export project');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="export-dialog-overlay" onClick={onClose}>
      <div className="export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <h2>Export Your Landing Page</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="export-content">
          {!downloadUrl ? (
            <>
              <p>Choose your preferred framework:</p>

              <div className="frameworks-grid">
                {frameworks.map((fw) => (
                  <label key={fw.id} className={`framework-option ${selectedFramework === fw.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="framework"
                      value={fw.id}
                      checked={selectedFramework === fw.id}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="framework-info">
                      <div className="framework-label">{fw.label}</div>
                      <div className="framework-description">{fw.description}</div>
                    </div>
                  </label>
                ))}
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="export-actions">
                <button
                  className="export-btn"
                  onClick={handleExport}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderIcon size={16} className="spinner" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <DownloadIcon size={16} />
                      Export & Download
                    </>
                  )}
                </button>
                <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="success-state">
              <CheckCircle size={48} className="success-icon" />
              <h3>Export Complete!</h3>
              <p>Your {selectedFramework} project has been downloaded.</p>
              <div className="success-actions">
                <button className="btn-primary" onClick={() => { setDownloadUrl(null); setSelectedFramework('html'); }}>
                  Export Again
                </button>
                <button className="btn-secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <style>{`
          .export-dialog-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.2s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .export-dialog {
            background: #1f2937;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease-out;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .export-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .export-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
          }

          .close-btn {
            background: none;
            border: none;
            color: #9ca3af;
            font-size: 28px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            transition: color 0.2s;
          }

          .close-btn:hover {
            color: #ffffff;
          }

          .export-content {
            padding: 24px;
          }

          .export-content > p {
            color: #d1d5db;
            margin-bottom: 16px;
            font-size: 14px;
          }

          .frameworks-grid {
            display: grid;
            gap: 12px;
            margin-bottom: 20px;
          }

          .framework-option {
            display: flex;
            align-items: center;
            padding: 12px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .framework-option:hover {
            border-color: rgba(99, 102, 241, 0.5);
            background: rgba(99, 102, 241, 0.05);
          }

          .framework-option.selected {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.1);
          }

          .framework-option input {
            margin-right: 12px;
            cursor: pointer;
          }

          .framework-info {
            flex: 1;
          }

          .framework-label {
            color: #ffffff;
            font-weight: 500;
            font-size: 14px;
          }

          .framework-description {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 2px;
          }

          .error-message {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 6px;
            color: #fecaca;
            font-size: 14px;
            margin-bottom: 16px;
          }

          .export-actions {
            display: flex;
            gap: 12px;
          }

          .export-btn,
          .cancel-btn {
            flex: 1;
            padding: 12px 16px;
            border-radius: 6px;
            border: none;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .export-btn {
            background: #6366f1;
            color: white;
          }

          .export-btn:hover:not(:disabled) {
            background: #4f46e5;
          }

          .export-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .cancel-btn {
            background: rgba(255, 255, 255, 0.1);
            color: #d1d5db;
          }

          .cancel-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.15);
          }

          .cancel-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .spinner {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .success-state {
            text-align: center;
            padding: 24px 0;
          }

          .success-icon {
            color: #10b981;
            margin-bottom: 16px;
          }

          .success-state h3 {
            color: #ffffff;
            margin: 16px 0 8px 0;
            font-size: 18px;
          }

          .success-state p {
            color: #9ca3af;
            margin: 0 0 24px 0;
          }

          .success-actions {
            display: flex;
            gap: 12px;
          }

          .btn-primary,
          .btn-secondary {
            flex: 1;
            padding: 10px 16px;
            border-radius: 6px;
            border: none;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-primary {
            background: #6366f1;
            color: white;
          }

          .btn-primary:hover {
            background: #4f46e5;
          }

          .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #d1d5db;
          }

          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        `}</style>
      </div>
    </div>
  );
}
