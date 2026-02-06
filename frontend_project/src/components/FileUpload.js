import React, { useState } from 'react';

const FileUpload = ({ onAnalyze }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.includes('audio')) {
      setSelectedFile(file);
    } else {
      alert('Please drop an audio file');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setIsAnalyzing(true);
    try {
      await onAnalyze(selectedFile);
    } catch (error) {
      alert('Error analyzing file: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowEffect}></div>
      
      <h2 style={styles.title}>
        <span style={styles.musicIcon}>🎵</span>
        Upload Your Music
      </h2>
      
      <p style={styles.subtitle}>
        Drop your audio file or click to browse
      </p>

      <div
        style={{
          ...styles.uploadBox,
          ...(isDragging && styles.uploadBoxDragging),
          ...(selectedFile && styles.uploadBoxSelected)
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".mp3,.wav,.ogg,.flac,.m4a"
          onChange={handleFileSelect}
          style={styles.fileInput}
          id="file-upload"
        />
        
        <label htmlFor="file-upload" style={styles.fileLabel}>
          {selectedFile ? (
            <div style={styles.fileInfo}>
              <div style={styles.fileIcon}>🎼</div>
              <div style={styles.fileName}>{selectedFile.name}</div>
              <div style={styles.fileSize}>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </div>
              <div style={styles.changeFile}>Click to change file</div>
            </div>
          ) : (
            <div style={styles.uploadPrompt}>
              <div style={styles.uploadIcon}>📁</div>
              <div style={styles.uploadText}>Choose Audio File</div>
              <div style={styles.uploadHint}>
                Supports: MP3, WAV, OGG, FLAC, M4A
              </div>
            </div>
          )}
        </label>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!selectedFile || isAnalyzing}
        style={{
          ...styles.button,
          ...((!selectedFile || isAnalyzing) && styles.buttonDisabled)
        }}
      >
        {isAnalyzing ? (
          <>
            <span style={styles.spinner}></span>
            Analyzing...
          </>
        ) : (
          <>
            <span style={styles.buttonIcon}>🔍</span>
            Analyze Mood
          </>
        )}
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    padding: '40px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    textAlign: 'center',
    marginBottom: '40px',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
    overflow: 'hidden'
  },
  glowEffect: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'rotate 20s linear infinite',
    pointerEvents: 'none'
  },
  title: {
    position: 'relative',
    fontSize: '36px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '10px',
    textShadow: '0 2px 20px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px'
  },
  musicIcon: {
    fontSize: '40px',
    animation: 'bounce 2s ease-in-out infinite'
  },
  subtitle: {
    position: 'relative',
    fontSize: '16px',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '30px',
    fontWeight: '300'
  },
  uploadBox: {
    position: 'relative',
    margin: '30px auto',
    maxWidth: '500px',
    padding: '40px',
    backgroundColor: 'rgba(255,255,255,0.95)',
    border: '3px dashed rgba(102, 126, 234, 0.5)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: 'scale(1)',
  },
  uploadBoxDragging: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderColor: '#667eea',
    borderStyle: 'solid',
    transform: 'scale(1.02)',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
  },
  uploadBoxSelected: {
    backgroundColor: 'rgba(118, 75, 162, 0.1)',
    borderColor: '#764ba2',
    borderStyle: 'solid'
  },
  fileInput: {
    display: 'none'
  },
  fileLabel: {
    display: 'block',
    cursor: 'pointer',
    userSelect: 'none'
  },
  uploadPrompt: {
    textAlign: 'center'
  },
  uploadIcon: {
    fontSize: '64px',
    marginBottom: '15px',
    animation: 'float 3s ease-in-out infinite'
  },
  uploadText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#667eea',
    marginBottom: '10px'
  },
  uploadHint: {
    fontSize: '13px',
    color: '#999',
    fontWeight: '400'
  },
  fileInfo: {
    textAlign: 'center'
  },
  fileIcon: {
    fontSize: '64px',
    marginBottom: '15px',
    animation: 'pulse 2s ease-in-out infinite'
  },
  fileName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
    wordBreak: 'break-word'
  },
  fileSize: {
    fontSize: '14px',
    color: '#764ba2',
    fontWeight: '500',
    marginBottom: '15px'
  },
  changeFile: {
    fontSize: '13px',
    color: '#667eea',
    fontWeight: '500',
    textDecoration: 'underline'
  },
  button: {
    position: 'relative',
    padding: '18px 50px',
    fontSize: '20px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    marginTop: '25px',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(245, 87, 108, 0.4)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    transform: 'translateY(0)',
  },
  buttonIcon: {
    fontSize: '24px',
    animation: 'rotate 3s linear infinite'
  },
  buttonDisabled: {
    background: 'linear-gradient(135deg, #bbb 0%, #999 100%)',
    cursor: 'not-allowed',
    boxShadow: 'none',
    transform: 'none'
  },
  spinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

// Add CSS animations
const styleSheet = document.styleSheets[0];
const animations = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (styleSheet && !document.querySelector('#upload-animations')) {
  const style = document.createElement('style');
  style.id = 'upload-animations';
  style.textContent = animations;
  document.head.appendChild(style);
}

// Add hover effect
if (typeof window !== 'undefined') {
  const addHoverStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      button:not(:disabled):hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 15px 40px rgba(245, 87, 108, 0.6) !important;
      }
    `;
    document.head.appendChild(style);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHoverStyles);
  } else {
    addHoverStyles();
  }
}

export default FileUpload;
