import React, { useEffect, useState } from 'react';

const MoodDisplay = ({ moodData, onCreateRemix }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCreatingRemix, setIsCreatingRemix] = useState(false);

  useEffect(() => {
    if (moodData) {
      setIsVisible(true);
    }
  }, [moodData]);

  if (!moodData) return null;

  const moodColors = {
    Happy: {
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      shadow: 'rgba(255, 215, 0, 0.4)',
      glow: '#FFD700'
    },
    Sad: {
      gradient: 'linear-gradient(135deg, #4169E1 0%, #1E3A8A 100%)',
      shadow: 'rgba(65, 105, 225, 0.4)',
      glow: '#4169E1'
    },
    Energetic: {
      gradient: 'linear-gradient(135deg, #FF4500 0%, #DC143C 100%)',
      shadow: 'rgba(255, 69, 0, 0.4)',
      glow: '#FF4500'
    },
    Calm: {
      gradient: 'linear-gradient(135deg, #98FB98 0%, #3CB371 100%)',
      shadow: 'rgba(152, 251, 152, 0.4)',
      glow: '#98FB98'
    }
  };

  const moodEmojis = {
    Happy: '😊',
    Sad: '😢',
    Energetic: '⚡',
    Calm: '😌'
  };

  const moodDescriptions = {
    Happy: 'Uplifting and joyful vibes detected!',
    Sad: 'Emotional and melancholic tones found.',
    Energetic: 'High energy and powerful rhythm!',
    Calm: 'Peaceful and soothing atmosphere.'
  };

  const currentMood = moodColors[moodData.mood] || moodColors.Calm;

  const handleRemixClick = async () => {
    setIsCreatingRemix(true);
    try {
      await onCreateRemix();
    } finally {
      setTimeout(() => setIsCreatingRemix(false), 1000);
    }
  };

  return (
    <div style={{
      ...styles.container,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>
      {/* Mood Card */}
      <div style={{
        ...styles.moodCard,
        background: currentMood.gradient,
        boxShadow: `0 20px 60px ${currentMood.shadow}, 0 0 100px ${currentMood.shadow}`
      }}>
        <div style={styles.particlesContainer}>
          <div style={styles.particle1}></div>
          <div style={styles.particle2}></div>
          <div style={styles.particle3}></div>
        </div>

        <div style={styles.emojiContainer}>
          <div style={styles.emoji}>{moodEmojis[moodData.mood]}</div>
          <div style={styles.emojiGlow}></div>
        </div>

        <h2 style={styles.moodTitle}>
          Detected Mood: <span style={styles.moodName}>{moodData.mood}</span>
        </h2>

        <p style={styles.moodDescription}>
          {moodDescriptions[moodData.mood]}
        </p>

        <div style={styles.confidenceContainer}>
          <div style={styles.confidenceLabel}>Confidence Level</div>
          <div style={styles.confidenceBarBg}>
            <div 
              style={{
                ...styles.confidenceBar,
                width: `${moodData.confidence * 100}%`,
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: `0 0 20px ${currentMood.glow}`
              }}
            >
              <span style={styles.confidenceText}>
                {(moodData.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Features */}
      <div style={styles.featuresBox}>
        <div style={styles.featuresHeader}>
          <span style={styles.featuresIcon}>📊</span>
          <h3 style={styles.featuresTitle}>Audio Analysis</h3>
        </div>

        <div style={styles.featureGrid}>
          <div style={{
            ...styles.featureCard,
            borderTop: `4px solid ${currentMood.glow}`
          }}>
            <div style={styles.featureIcon}>💝</div>
            <div style={styles.featureLabel}>Valence</div>
            <div style={styles.featureValueLarge}>
              {(moodData.audio_features.valence * 100).toFixed(0)}%
            </div>
            <div style={styles.featureDescription}>Emotional Positivity</div>
            <div style={styles.progressBar}>
              <div style={{
                ...styles.progressFill,
                width: `${moodData.audio_features.valence * 100}%`,
                background: currentMood.gradient
              }}></div>
            </div>
          </div>

          <div style={{
            ...styles.featureCard,
            borderTop: `4px solid ${currentMood.glow}`
          }}>
            <div style={styles.featureIcon}>⚡</div>
            <div style={styles.featureLabel}>Energy</div>
            <div style={styles.featureValueLarge}>
              {(moodData.audio_features.energy * 100).toFixed(0)}%
            </div>
            <div style={styles.featureDescription}>Intensity Level</div>
            <div style={styles.progressBar}>
              <div style={{
                ...styles.progressFill,
                width: `${moodData.audio_features.energy * 100}%`,
                background: currentMood.gradient
              }}></div>
            </div>
          </div>

          <div style={{
            ...styles.featureCard,
            borderTop: `4px solid ${currentMood.glow}`
          }}>
            <div style={styles.featureIcon}>🎵</div>
            <div style={styles.featureLabel}>Tempo</div>
            <div style={styles.featureValueLarge}>
              {moodData.audio_features.tempo.toFixed(0)}
            </div>
            <div style={styles.featureDescription}>Beats Per Minute</div>
            <div style={styles.tempoIndicator}>
              <span style={styles.tempoDot}></span>
              <span style={styles.tempoDot}></span>
              <span style={styles.tempoDot}></span>
            </div>
          </div>
        </div>
      </div>

      {/* Remix Button */}
      <button 
        onClick={handleRemixClick} 
        disabled={isCreatingRemix}
        style={{
          ...styles.remixButton,
          background: isCreatingRemix 
            ? 'linear-gradient(135deg, #999 0%, #666 100%)'
            : 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
          cursor: isCreatingRemix ? 'not-allowed' : 'pointer'
        }}
      >
        {isCreatingRemix ? (
          <>
            <span style={styles.spinner}></span>
            Creating Remix...
          </>
        ) : (
          <>
            <span style={styles.remixIcon}>🎛️</span>
            Create Mood-Based Remix
            <span style={styles.remixArrow}>→</span>
          </>
        )}
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    marginBottom: '40px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  moodCard: {
    position: 'relative',
    padding: '50px 40px',
    borderRadius: '24px',
    textAlign: 'center',
    marginBottom: '40px',
    color: 'white',
    overflow: 'hidden',
    transform: 'scale(1)',
    transition: 'transform 0.3s ease'
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  particle1: {
    position: 'absolute',
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    top: '10%',
    left: '10%',
    animation: 'float 6s ease-in-out infinite'
  },
  particle2: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    top: '60%',
    right: '15%',
    animation: 'float 8s ease-in-out infinite reverse'
  },
  particle3: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    bottom: '20%',
    left: '70%',
    animation: 'float 7s ease-in-out infinite'
  },
  emojiContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '20px'
  },
  emoji: {
    position: 'relative',
    fontSize: '100px',
    animation: 'bounce 2s ease-in-out infinite',
    zIndex: 2,
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
  },
  emojiGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120px',
    height: '120px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
    zIndex: 1
  },
  moodTitle: {
    fontSize: '28px',
    margin: '15px 0',
    fontWeight: '600',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
    letterSpacing: '0.5px'
  },
  moodName: {
    fontWeight: '800',
    fontSize: '36px',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  },
  moodDescription: {
    fontSize: '16px',
    opacity: 0.95,
    marginBottom: '25px',
    fontStyle: 'italic',
    fontWeight: '300'
  },
  confidenceContainer: {
    marginTop: '25px'
  },
  confidenceLabel: {
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '10px',
    opacity: 0.9,
    fontWeight: '500'
  },
  confidenceBarBg: {
    width: '100%',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    overflow: 'hidden',
    position: 'relative',
    backdropFilter: 'blur(10px)'
  },
  confidenceBar: {
    height: '100%',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '15px',
    transition: 'width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    overflow: 'hidden'
  },
  confidenceText: {
    fontWeight: '700',
    fontSize: '16px',
    color: '#333',
    zIndex: 2,
    textShadow: '0 2px 4px rgba(255,255,255,0.5)'
  },
  featuresBox: {
    backgroundColor: 'white',
    padding: '35px',
    borderRadius: '20px',
    marginBottom: '30px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  featuresHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '30px'
  },
  featuresIcon: {
    fontSize: '32px',
    animation: 'pulse 2s ease-in-out infinite'
  },
  featuresTitle: {
    fontSize: '26px',
    color: '#333',
    margin: 0,
    fontWeight: '700'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px'
  },
  featureCard: {
    padding: '25px',
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    cursor: 'default'
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '12px',
    animation: 'float 3s ease-in-out infinite'
  },
  featureLabel: {
    fontSize: '14px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    fontWeight: '600',
    marginBottom: '10px'
  },
  featureValueLarge: {
    fontSize: '42px',
    fontWeight: '800',
    color: '#333',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  featureDescription: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '15px',
    fontStyle: 'italic'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '12px'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    animation: 'shimmer 2s ease-in-out infinite'
  },
  tempoIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '15px'
  },
  tempoDot: {
    width: '12px',
    height: '12px',
    backgroundColor: '#667eea',
    borderRadius: '50%',
    animation: 'blink 1.5s ease-in-out infinite'
  },
  remixButton: {
    width: '100%',
    padding: '20px',
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(156, 39, 176, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    position: 'relative',
    overflow: 'hidden'
  },
  remixIcon: {
    fontSize: '28px',
    animation: 'rotate 4s linear infinite'
  },
  remixArrow: {
    fontSize: '24px',
    transition: 'transform 0.3s ease'
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

// Add animations
const animations = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-15px) scale(1.05); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-20px) translateX(10px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
  }
  
  @keyframes shimmer {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.8); }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const styleId = 'mood-display-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = animations + `
      .featureCard:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
      }
      
      button:not(:disabled):hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(156, 39, 176, 0.6) !important;
      }
      
      button:not(:disabled):hover .remixArrow {
        transform: translateX(5px);
      }
    `;
    document.head.appendChild(style);
  }
}

export default MoodDisplay;
