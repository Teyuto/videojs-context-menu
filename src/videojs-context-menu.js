videojs.registerPlugin('contextMenu', function (options) {
  var player = this;

  var defaults = {
    playerName: '',
    playerVersion: '',
    playerUrl: '#',
    theme: 'light',
    buttons: []
  };

  var settings = videojs.mergeOptions(defaults, options);

  var popup = document.createElement('div');
  popup.className = 'context-menu';
  player.el().appendChild(popup);

  function updateButtonsState() {
    var playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
      playPauseBtn.innerText = player.paused() ? 'Play' : 'Pause';
    }

    var muteUnmuteBtn = document.getElementById('muteUnmuteBtn');
    if (muteUnmuteBtn) {
      muteUnmuteBtn.innerText = player.muted() ? 'Unmute' : 'Mute';
    }

    var fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
      fullscreenBtn.innerText = player.isFullscreen() ? 'Exit Fullscreen' : 'Fullscreen';
    }
  }

  player.on('contextmenu', function (event) {
    event.preventDefault();

    var playerRect = player.el().getBoundingClientRect();

    let playerVs = '';
    if (settings.playerVersion) {
      playerVs = ' v' + settings.playerVersion;
    }

    while (popup.firstChild) {
      popup.removeChild(popup.firstChild);
    }

    var ulElement = document.createElement('ul');
    ulElement.style.listStyleType = 'none';
    ulElement.style.padding = '0';
    ulElement.style.margin = '0';

    var liElement = document.createElement('li');
    liElement.style.fontWeight = 'bold';
    var aElement = document.createElement('a');
    aElement.href = settings.playerUrl;
    aElement.target = '_blank';
    aElement.innerText = settings.playerName + playerVs;
    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);

    settings.buttons.forEach(function (button) {
      var liButton = document.createElement('li');
      switch (button) {
        case 'playPause':
          liButton.id = 'playPauseBtn';
          liButton.innerText = player.paused() ? 'Play' : 'Pause';
          break;
        case 'muteUnmute':
          liButton.id = 'muteUnmuteBtn';
          liButton.innerText = player.muted() ? 'Unmute' : 'Mute';
          break;
        case 'fullscreen':
          liButton.id = 'fullscreenBtn';
          liButton.innerText = player.isFullscreen() ? 'Exit Fullscreen' : 'Fullscreen';
          break;
        case 'copyUrl':
          liButton.id = 'copyUrlBtn';
          liButton.innerText = 'Copy Video URL';
          break;
      }
      ulElement.appendChild(liButton);
    });

    popup.appendChild(ulElement);

    if (settings.theme === 'light') {
      popup.classList.add('light-theme');
      popup.classList.remove('dark-theme');
    } else {
      popup.classList.add('dark-theme');
      popup.classList.remove('light-theme');
    }

    popup.style.display = 'block';
    popup.style.left = (event.clientX - playerRect.left) + 'px';
    popup.style.top = (event.clientY - playerRect.top) + 'px';

    updateButtonsState();

    document.getElementById('playPauseBtn').addEventListener('click', function () {
      player.paused() ? player.play() : player.pause();
      updateButtonsState();
    });

    document.getElementById('muteUnmuteBtn').addEventListener('click', function () {
      player.muted(!player.muted());
      updateButtonsState();
    });

    document.getElementById('fullscreenBtn').addEventListener('click', function () {
      player.isFullscreen() ? player.exitFullscreen() : player.requestFullscreen();
      updateButtonsState();
    });

    document.getElementById('copyUrlBtn').addEventListener('click', function () {
      var videoUrl = window.location.href;
      navigator.clipboard.writeText(videoUrl).then(function () {
        console.log('URL copiato negli appunti: ' + videoUrl);
      }).catch(function (err) {
        console.error('Errore nella copia negli appunti: ', err);
      });
    });

  });

  document.addEventListener('click', function () {
    popup.style.display = 'none';
  });
});