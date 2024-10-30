const audioPlayers = document.querySelectorAll('.audio-player');

audioPlayers.forEach((player, index) => {
  const audio = player.querySelector('audio');
  const playPauseBtn = player.querySelector('.play-pause');
  const rewindBtn = player.querySelector('.rewind');
  const loopBtn = player.querySelector('.loop');
  const prevBtn = player.querySelector('.prev');
  const nextBtn = player.querySelector('.next');
  const timeSlider = player.querySelector('.time-slider');
  const currentTimeDisplay = player.querySelector('.current-time');
  const totalTimeDisplay = player.querySelector('.total-time');

  let isMutedWhileSeeking = false;

  // Function to hide all audio controls
  const hideAllControls = () => {
    audioPlayers.forEach(otherPlayer => {
      const otherPlayPauseBtn = otherPlayer.querySelector('.play-pause');
      otherPlayer.classList.remove('playing'); // Hide controls
      otherPlayPauseBtn.textContent = 'Play'; // Reset button text
    });
  };

  // Play/Pause functionality
  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      hideAllControls(); // Hide all controls before showing the current one
      audio.play();
      playPauseBtn.textContent = 'Pause';
      player.classList.add('playing'); // Show controls for current track
    } else {
      audio.pause();
      playPauseBtn.textContent = 'Play';
      player.classList.remove('playing'); // Hide controls when paused
    }
  });

  // Rewind button functionality
  rewindBtn.addEventListener('click', () => {
    audio.currentTime = 0;
  });

  // Loop button toggle
  loopBtn.addEventListener('click', () => {
    audio.loop = !audio.loop;
    loopBtn.textContent = audio.loop ? 'Unloop' : 'Loop';
  });

  // Function to handle track switching
  const resetAudio = (targetAudio, targetPlayPauseBtn, targetPlayer) => {
    audio.pause();
    audio.currentTime = 0;
    hideAllControls(); // Hide all controls when switching tracks
    targetAudio.play();
    targetPlayPauseBtn.textContent = 'Pause';
    targetPlayer.classList.add('playing'); // Show controls for new track
  };

  // Previous track button functionality
  prevBtn.addEventListener('click', () => {
    const prevAudioPlayer = audioPlayers[index - 1];
    if (prevAudioPlayer) {
      const prevAudio = prevAudioPlayer.querySelector('audio');
      const prevPlayPauseBtn = prevAudioPlayer.querySelector('.play-pause');
      resetAudio(prevAudio, prevPlayPauseBtn, prevAudioPlayer);
    }
  });

  // Next track button functionality
  nextBtn.addEventListener('click', () => {
    const nextAudioPlayer = audioPlayers[index + 1];
    if (nextAudioPlayer) {
      const nextAudio = nextAudioPlayer.querySelector('audio');
      const nextPlayPauseBtn = nextAudioPlayer.querySelector('.play-pause');
      resetAudio(nextAudio, nextPlayPauseBtn, nextAudioPlayer);
    }
  });

  // Update time display as the audio plays
  audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    timeSlider.value = (currentTime / duration) * 100 || 0;
    currentTimeDisplay.textContent = formatTime(currentTime);
    totalTimeDisplay.textContent = formatTime(duration);
  });

  // Seek functionality using the slider
  timeSlider.addEventListener('input', () => {
    isMutedWhileSeeking = true;
    audio.muted = true;
    const duration = audio.duration;
    audio.currentTime = (timeSlider.value / 100) * duration;
  });

  timeSlider.addEventListener('change', () => {
    if (isMutedWhileSeeking) {
      audio.muted = false;
      isMutedWhileSeeking = false;
    }
  });

  // Format time in mm:ss
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  // Set total duration display when metadata is loaded
  audio.addEventListener('loadedmetadata', () => {
    totalTimeDisplay.textContent = formatTime(audio.duration);
  });

  // Ensure only one audio plays at a time
  audio.addEventListener('play', () => {
    audioPlayers.forEach((otherPlayer, otherIndex) => {
      if (otherIndex !== index) {
        const otherAudio = otherPlayer.querySelector('audio');
        otherAudio.pause();
        otherAudio.currentTime = 0;
        otherPlayer.classList.remove('playing'); // Hide controls for other players
      }
    });
  });

  // Auto-play next track when the current one ends
  audio.addEventListener('ended', () => {
    const nextAudioPlayer = audioPlayers[index + 1];
    if (nextAudioPlayer) {
      const nextAudio = nextAudioPlayer.querySelector('audio');
      const nextPlayPauseBtn = nextAudioPlayer.querySelector('.play-pause');
      resetAudio(nextAudio, nextPlayPauseBtn, nextAudioPlayer);
    } else {
      playPauseBtn.textContent = 'Play';
      player.classList.remove('playing'); // Hide controls on finished track
    }
  });
});
