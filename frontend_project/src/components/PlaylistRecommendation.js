import React, { useState, useEffect } from 'react';

const PlaylistRecommendation = ({ recommendations }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      setIsVisible(true);
    }
  }, [recommendations]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Remove the unused handlePlayPause function - we handle it inline instead

  return (
    <div style={{
      ...styles.container,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>

      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <span style={styles.playlistEmoji}>🎧</span>
          <div style={styles.soundWave}>
            <span style={styles.bar1}></span>
            <span style={styles.bar2}></span>
            <span style={styles.bar3}></span>
            <span style={styles.bar4}></span>
          </div>
        </div>
        <h2 style={styles.title}>Recommended Playlist</h2>
        <p style={styles.subtitle}>
          {recommendations.length} songs curated for your mood
        </p>
      </div>

      <div style={styles.trackList}>
        {recommendations.map((track, index) => (
          <div
            key={track.id}
            style={{
              ...styles.trackItem,
              ...(hoveredIndex === index && styles.trackItemHovered),
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
              transition: `all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.05}s`
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Track Number */}
            <div style={styles.trackNumberContainer}>
              <span style={{
                ...styles.trackNumber,
                opacity: hoveredIndex === index ? 0 : 1
              }}>
                {index + 1}
              </span>
              {hoveredIndex === index && (
                <span style={styles.playIcon}>▶️</span>
              )}
            </div>

            {/* Album Art */}
            <div style={styles.imageContainer}>
              {track.image ? (
                <img
                  src={track.image}
                  alt={track.name}
                  style={styles.trackImage}
                />
              ) : (
                <div style={styles.imagePlaceholder}>🎵</div>
              )}
              {playingIndex === index && (
                <div style={styles.playingOverlay}>
                  <span style={styles.equalizer}>
                    <span style={styles.eqBar1}></span>
                    <span style={styles.eqBar2}></span>
                    <span style={styles.eqBar3}></span>
                  </span>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div style={styles.trackInfo}>
              <div style={styles.trackName}>{track.name}</div>
              <div style={styles.trackArtist}>{track.artist}</div>
              {track.album && (
                <div style={styles.trackAlbum}>{track.album}</div>
              )}
            </div>

            {/* Actions */}
            <div style={styles.trackActions}>
              {/* Preview Player */}
              {track.preview_url && (
                <div style={styles.previewContainer}>
                  <audio
                    id={`audio-${index}`}
                    src={track.preview_url}
                    style={styles.audioPlayer}
                    onPlay={() => setPlayingIndex(index)}
                    onPause={() => setPlayingIndex(null)}
                    onEnded={() => setPlayingIndex(null)}
                  />
                  <button
                    onClick={() => {
                      const audio = document.getElementById(`audio-${index}`);
                      if (playingIndex === index) {
                        audio.pause();
                      } else {
                        // Pause all other audio
                        document.querySelectorAll('audio').forEach(a => a.pause());
                        audio.play();
                      }
                    }}
                    style={{
                      ...styles.playButton,
                      background: playingIndex === index
                        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {playingIndex === index ? '⏸️' : '▶️'}
                    <span style={styles.buttonText}>
                      {playingIndex === index ? 'Pause' : 'Preview'}
                    </span>
                  </button>
                </div>
              )}

              {/* Spotify Link */}
              <a
                href={track.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.spotifyLink}
              >
                <span style={styles.spotifyIcon}>
                  <svg viewBox="0 0 24 24" style={styles.spotifySvg}>
                    <path fill="currentColor" d="M17.9,10.9C14.7,9 9.35,8.8 6.3,9.75C5.8,9.9 5.3,9.6 5.15,9.15C5,8.65 5.3,8.15 5.75,8C9.3,6.95 15.15,7.15 18.85,9.35C19.3,9.6 19.45,10.2 19.2,10.65C18.95,11 18.35,11.15 17.9,10.9M17.8,13.7C17.55,14.05 17.1,14.2 16.75,13.95C14.05,12.3 9.95,11.8 6.8,12.8C6.4,12.9 5.95,12.7 5.85,12.3C5.75,11.9 5.95,11.45 6.35,11.35C9.95,10.25 14.5,10.8 17.6,12.7C17.9,12.85 18.05,13.35 17.8,13.7M16.6,16.45C16.4,16.75 16.05,16.85 15.75,16.65C13.4,15.2 10.45,14.9 6.95,15.7C6.6,15.8 6.3,15.55 6.2,15.25C6.1,14.9 6.35,14.6 6.65,14.5C10.45,13.65 13.75,14 16.35,15.6C16.7,15.75 16.75,16.15 16.6,16.45M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                </span>
                <span style={styles.spotifyText}>Spotify</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    marginBottom: '40px',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    position: 'relative'
  },
  headerIcon: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '20px'
  },
  playlistEmoji: {
    fontSize: '60px',
    animation: 'bounce 2s ease-in-out infinite',
    display: 'inline-block',
    filter: 'drop-shadow(0 10px 20px rgba(102, 126, 234, 0.3))'
  },
  soundWave: {
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '3px',
    alignItems: 'flex-end'
  },
  bar1: {
    width: '4px',
    height: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '2px',
    animation: 'wave 1s ease-in-out infinite',
    animationDelay: '0s'
  },
  bar2: {
    width: '4px',
    height: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '2px',
    animation: 'wave 1s ease-in-out infinite',
    animationDelay: '0.1s'
  },
  bar3: {
    width: '4px',
    height: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '2px',
    animation: 'wave 1s ease-in-out infinite',
    animationDelay: '0.2s'
  },
  bar4: {
    width: '4px',
    height: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '2px',
    animation: 'wave 1s ease-in-out infinite',
    animationDelay: '0.3s'
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    fontWeight: '500'
  },
  trackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  trackItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '16px',
    gap: '16px',
    cursor: 'pointer',
    border: '2px solid transparent',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  trackItemHovered: {
    transform: 'translateY(-4px) scale(1.01)',
    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    backgroundColor: '#fafbff'
  },
  trackNumberContainer: {
    position: 'relative',
    minWidth: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  trackNumber: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#999',
    transition: 'opacity 0.2s ease',
    fontFamily: 'monospace'
  },
  playIcon: {
    position: 'absolute',
    fontSize: '20px',
    animation: 'fadeIn 0.2s ease'
  },
  imageContainer: {
    position: 'relative',
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    flexShrink: 0
  },
  trackImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontSize: '32px'
  },
  playingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.3s ease'
  },
  equalizer: {
    display: 'flex',
    gap: '4px',
    alignItems: 'flex-end',
    height: '24px'
  },
  eqBar1: {
    width: '4px',
    background: 'white',
    borderRadius: '2px',
    animation: 'equalize 0.8s ease-in-out infinite',
    animationDelay: '0s'
  },
  eqBar2: {
    width: '4px',
    background: 'white',
    borderRadius: '2px',
    animation: 'equalize 0.8s ease-in-out infinite',
    animationDelay: '0.2s'
  },
  eqBar3: {
    width: '4px',
    background: 'white',
    borderRadius: '2px',
    animation: 'equalize 0.8s ease-in-out infinite',
    animationDelay: '0.4s'
  },
  trackInfo: {
    flex: 1,
    minWidth: 0
  },
  trackName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '6px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  trackArtist: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  trackAlbum: {
    fontSize: '13px',
    color: '#999',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  trackActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexShrink: 0
  },
  audioPlayer: {
    display: 'none'
  },
  previewContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  playButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '24px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    whiteSpace: 'nowrap'
  },
  buttonText: {
    fontSize: '14px'
  },
  spotifyLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#1DB954',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(29, 185, 84, 0.3)',
    whiteSpace: 'nowrap'
  },
  spotifyIcon: {
    width: '20px',
    height: '20px',
    display: 'flex'
  },
  spotifySvg: {
    width: '100%',
    height: '100%'
  },
  spotifyText: {
    fontSize: '14px'
  }
};

// Add animations
const animations = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes wave {
    0%, 100% { height: 12px; }
    50% { height: 24px; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes equalize {
    0%, 100% { height: 8px; }
    50% { height: 24px; }
  }
`;

if (typeof document !== 'undefined') {
  const styleId = 'playlist-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = animations + `
      .trackItem:hover img {
        transform: scale(1.1);
      }
      
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
      }
      
      a:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(29, 185, 84, 0.5) !important;
        background-color: #1ed760 !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export default PlaylistRecommendation;
