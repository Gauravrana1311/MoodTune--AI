import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import MoodDisplay from './components/MoodDisplay';
import PlaylistRecommendation from './components/PlaylistRecommendation';
import { analyzeAudio, getRecommendations, createRemix, downloadRemix } from './services/api';

function App() {
  const [moodData, setMoodData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [remixFilename, setRemixFilename] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (file) => {
    setLoading(true);
    try {
      const result = await analyzeAudio(file);
      setMoodData(result);

      const recs = await getRecommendations(result.mood);
      setRecommendations(recs.recommendations);
    } catch (error) {
      console.error('Error:', error);
      alert('Error analyzing audio: ' + (error.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRemix = async () => {
    if (!moodData) return;

    setLoading(true);
    try {
      const result = await createRemix(moodData.filename, moodData.mood);
      setRemixFilename(result.remix_filename);
      // Show success message with custom styled alert
      showCustomAlert('Remix created successfully! 🎉');
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating remix: ' + (error.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRemix = () => {
    if (remixFilename) {
      downloadRemix(remixFilename);
    }
  };

  const showCustomAlert = (message) => {
    // You can use a toast library or custom modal here
    alert(message);
  };

  return (
    <div style={styles.app}>
      {/* Animated Background */}
      <div style={styles.backgroundAnimation}>
        <div style={styles.bgCircle1}></div>
        <div style={styles.bgCircle2}></div>
        <div style={styles.bgCircle3}></div>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIconContainer}>
            <span style={styles.headerIcon}>🎵</span>
            <div style={styles.headerGlow}></div>
          </div>
          <h1 style={styles.headerTitle}>Mood Music Analyzer</h1>
          <p style={styles.headerSubtitle}>
            Upload a song to analyze its mood and get personalized recommendations
          </p>
          <div style={styles.headerDivider}></div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <FileUpload onAnalyze={handleAnalyze} />

        {/* Loading State */}
        {loading && (
          <div style={styles.loaderContainer}>
            <div style={styles.loaderCard}>
              <div style={styles.spinnerContainer}>
                <div style={styles.spinner}></div>
                <div style={styles.spinnerGlow}></div>
              </div>
              <p style={styles.loaderText}>Analyzing your music...</p>
              <div style={styles.loadingBars}>
                <span style={styles.loadingBar1}></span>
                <span style={styles.loadingBar2}></span>
                <span style={styles.loadingBar3}></span>
                <span style={styles.loadingBar4}></span>
                <span style={styles.loadingBar5}></span>
              </div>
            </div>
          </div>
        )}

        {/* Mood Display and Recommendations */}
        {moodData && (
          <>
            <MoodDisplay moodData={moodData} onCreateRemix={handleCreateRemix} />
            
            {/* Remix Ready Box */}
            {remixFilename && (
              <div style={styles.remixBox}>
                <div style={styles.remixGlow}></div>
                <div style={styles.remixContent}>
                  <span style={styles.remixIcon}>🎛️</span>
                  <div style={styles.remixTextContainer}>
                    <p style={styles.remixTitle}>Your Remix is Ready!</p>
                    <p style={styles.remixSubtitle}>
                      Download your mood-enhanced track below
                    </p>
                  </div>
                  <button onClick={handleDownloadRemix} style={styles.downloadButton}>
                    <span style={styles.downloadIcon}>📥</span>
                    <span>Download Remix</span>
                    <span style={styles.downloadArrow}>→</span>
                  </button>
                </div>
              </div>
            )}

            <PlaylistRecommendation recommendations={recommendations} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerWave}></div>
          <p style={styles.footerText}>
            Made with <span style={styles.heartIcon}>❤️</span> for Music Lovers
          </p>
          <p style={styles.footerSubtext}>
            Powered by AI • Spotify Integration • Real-time Analysis
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: '#0a0e27',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: 'hidden'
  },
  backgroundAnimation: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  bgCircle1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
    animation: 'float 20s ease-in-out infinite'
  },
  bgCircle2: {
    position: 'absolute',
    bottom: '10%',
    right: '15%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
    animation: 'float 25s ease-in-out infinite reverse'
  },
  bgCircle3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(29, 185, 84, 0.1) 0%, transparent 70%)',
    animation: 'float 30s ease-in-out infinite'
  },
  header: {
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '60px 20px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    zIndex: 1
  },
  headerContent: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative'
  },
  headerIconContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '20px'
  },
  headerIcon: {
    fontSize: '80px',
    display: 'inline-block',
    animation: 'bounce 2s ease-in-out infinite',
    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
    position: 'relative',
    zIndex: 2
  },
  headerGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
    zIndex: 1
  },
  headerTitle: {
    fontSize: '56px',
    margin: '0 0 15px 0',
    fontWeight: '800',
    color: 'white',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
    letterSpacing: '1px'
  },
  headerSubtitle: {
    fontSize: '20px',
    margin: '0 0 30px 0',
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '300',
    lineHeight: '1.6'
  },
  headerDivider: {
    width: '100px',
    height: '4px',
    background: 'rgba(255,255,255,0.5)',
    margin: '0 auto',
    borderRadius: '2px'
  },
  main: {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
    zIndex: 1
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    marginBottom: '40px'
  },
  loaderCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '50px',
    borderRadius: '24px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)'
  },
  spinnerContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '30px'
  },
  spinner: {
    border: '6px solid rgba(102, 126, 234, 0.2)',
    borderTop: '6px solid #667eea',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    animation: 'spin 1s linear infinite',
    position: 'relative',
    zIndex: 2
  },
  spinnerGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
    zIndex: 1
  },
  loaderText: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '25px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  loadingBars: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '40px'
  },
  loadingBar1: {
    width: '6px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '3px',
    animation: 'loadingWave 1.2s ease-in-out infinite',
    animationDelay: '0s'
  },
  loadingBar2: {
    width: '6px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '3px',
    animation: 'loadingWave 1.2s ease-in-out infinite',
    animationDelay: '0.1s'
  },
  loadingBar3: {
    width: '6px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '3px',
    animation: 'loadingWave 1.2s ease-in-out infinite',
    animationDelay: '0.2s'
  },
  loadingBar4: {
    width: '6px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '3px',
    animation: 'loadingWave 1.2s ease-in-out infinite',
    animationDelay: '0.3s'
  },
  loadingBar5: {
    width: '6px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '3px',
    animation: 'loadingWave 1.2s ease-in-out infinite',
    animationDelay: '0.4s'
  },
  remixBox: {
    position: 'relative',
    background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
    padding: '40px',
    borderRadius: '24px',
    marginBottom: '40px',
    boxShadow: '0 20px 60px rgba(156, 39, 176, 0.4)',
    overflow: 'hidden',
    border: '2px solid rgba(255,255,255,0.2)'
  },
  remixGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'rotate 20s linear infinite',
    pointerEvents: 'none'
  },
  remixContent: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    flexWrap: 'wrap',
    zIndex: 2
  },
  remixIcon: {
    fontSize: '60px',
    animation: 'rotate 4s linear infinite',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
  },
  remixTextContainer: {
    flex: 1,
    minWidth: '200px'
  },
  remixTitle: {
    fontSize: '28px',
    margin: '0 0 10px 0',
    fontWeight: '800',
    color: 'white',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  remixSubtitle: {
    fontSize: '16px',
    margin: 0,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '300'
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '18px 35px',
    fontSize: '18px',
    fontWeight: '700',
    backgroundColor: 'white',
    color: '#9C27B0',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    whiteSpace: 'nowrap'
  },
  downloadIcon: {
    fontSize: '24px'
  },
  downloadArrow: {
    fontSize: '20px',
    transition: 'transform 0.3s ease'
  },
  footer: {
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '50px 20px',
    marginTop: '80px',
    zIndex: 1
  },
  footerContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative'
  },
  footerWave: {
    position: 'absolute',
    top: '-30px',
    left: 0,
    width: '100%',
    height: '30px',
    background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\'%3E%3Cpath d=\'M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z\' fill=\'%23667eea\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  footerText: {
    fontSize: '20px',
    color: 'white',
    margin: '0 0 15px 0',
    fontWeight: '600'
  },
  heartIcon: {
    display: 'inline-block',
    color: '#ff6b9d',
    animation: 'heartbeat 1.5s ease-in-out infinite',
    fontSize: '24px'
  },
  footerSubtext: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
    fontWeight: '300'
  }
};

// Add CSS animations
const animations = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-30px); }
  }
  
  @keyframes loadingWave {
    0%, 100% { height: 10px; }
    50% { height: 40px; }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

if (typeof document !== 'undefined') {
  const styleId = 'app-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = animations + `
      button:hover .downloadArrow {
        transform: translateX(5px);
      }
      
      button:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.3) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export default App;
