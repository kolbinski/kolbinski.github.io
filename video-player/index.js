FooHTML
  .register('video-player', {
    onCreate: function(){
      var video = document.createElement('video'),
        config = JSON.parse((this.getAttribute('data-config')).replace(/'/g, '"')),
        i,
        source,
        titleDiv = document.createElement('div'),
        playDiv = document.createElement('div'),
        progressBarDiv = document.createElement('div');
        progressCurrBarDiv = document.createElement('div');
      this.config = config;
      titleDiv.className = 'title';
      this.titleDiv = titleDiv;
      playDiv.className = 'play';
      this.api.addEvent(playDiv, 'click', this.togglePause.bind(this));
      progressBarDiv.className = 'progressBar';
      progressCurrBarDiv.className = 'progressCurrBar';
      this.progressCurrBarDiv = progressCurrBarDiv;
      this.api.addEvent(video, 'pause', this.pause.bind(this));
      this.api.addEvent(video, 'timeupdate', this.timeupdate.bind(this));
      this.api.addEvent(progressBarDiv, 'click', this.move.bind(this));
      this.api.addEvent(progressCurrBarDiv, 'click', this.move.bind(this));
      this.appendChild(video);
      this.appendChild(titleDiv);
      this.appendChild(playDiv);
      this.appendChild(progressBarDiv);
      this.appendChild(progressCurrBarDiv);
      this.video = video;
      this.playing = false;
      this.reloadMovie(config[0]);
    },
    methods: {
      reloadMovie: function(config){
        this.titleDiv.innerHTML = config.title;
        var sources = this.video.getElementsByTagName('source'),
          i = sources.length;
        while(i--){
          this.video.removeChild(sources[i]);
        }
        for(i in config.videos){
          sources = document.createElement('source');
          sources.setAttribute('type', i);
          sources.setAttribute('src', config.videos[i]);
          this.video.appendChild(sources);
        }
        this.video.load();
      },
      togglePause: function(){
        if(this.playing){
          this.pause();
        }else{
          this.play();
        }
      },
      play: function(){
        if(this.data.playingPlayer && this.data.playingPlayer !== this){
          this.data.playingPlayer.video.pause();
        }
        this.video.play();
        this.setAttribute('data-playing', true);
        this.playing = true;
        this.data.playingPlayer = this;
      },
      pause: function(){
        this.video.pause();
        this.removeAttribute('data-playing');
        this.playing = false;
      },
      timeupdate: function(){
        this.progressCurrBarDiv.style.width = 100 * (this.video.currentTime / this.video.duration) + '%';
      },
      move: function(e){
        this.video.currentTime = this.video.duration * (e.clientX - Math.round(this.getBoundingClientRect().left)) / this.offsetWidth;
        this.play();
      }
    },
    data: {
      playingPlayer: null
    }
  })
;
