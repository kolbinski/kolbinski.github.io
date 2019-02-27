FooHTML
  .register('video-widget', {
    extends: 'video-player',
    onCreate: function(){
      var tabs = document.createElement('div'),
        cover = document.createElement('div'),
        covers = document.createElement('div'),
        subtitle = document.createElement('span');
      cover.className = 'cover';
      cover.style.background = 'url('+this.config[0].cover+') no-repeat center center / cover';
      this.cover = cover;
      this.appendChild(cover);
      tabs.className = 'tabs';
      this.tabs = tabs;
      this.currentConfig = this.config[0];
      this.reloadTabs();
      this.appendChild(tabs);
      covers.className = 'covers';
      this.covers = covers;
      this.appendChild(covers);
      subtitle.className = 'subtitles';
      this.subtitle = subtitle;
      this.appendChild(subtitle);
      this.api.addEvent(this.video, 'ended', this.showCovers.bind(this));
      this.api.addEvent(this.video, 'timeupdate', this.timeupdate.bind(this));
    },
    methods: {
      play: function(){
        this.super.play();
        this.cover.style.display = 'none';
        this.covers.style.display = 'none';
        this.subtitle.innerHTML = '';
        this.subtitle.style.display = 'none';
        if(this.currentConfig.subtitles){
          var subtitles = [];
          for(i in this.currentConfig.subtitles){
            subtitles.push({time: i, subtitles: this.currentConfig.subtitles[i]});
          }
          this.subtitles = subtitles;
          this.displayedSubtitles = {};
          this.subtitle.style.display = 'block';
        }
      },
      showCovers: function(){
        var length = this.config.length,
          covers = this.covers.getElementsByTagName('div'),
          i = covers.length,
          cover;
        while(i--){
          this.covers.removeChild(covers[i]);
        }
        for(i = 0; i<length; i++){
          if(this.config[i] === this.currentConfig) continue;
          cover = document.createElement('div');
          cover.innerHTML = this.config[i].title;
          cover.style.background = 'url('+this.config[i].cover+') no-repeat center center / cover';
          cover.config = this.config[i];
          this.api.addEvent(cover, 'click', this.changeMovie.bind(this));
          this.covers.appendChild(cover);
        }
        this.covers.style.display = 'block';
        this.subtitle.innerHTML = '';
        this.subtitle.style.display = 'none';
        this.subtitle.style.background = 'none';
        this.subtitle.removeAttribute('data-banner');
      },
      changeMovie: function(e){
        this.currentConfig = e.target.config;
        this.super.reloadMovie(this.currentConfig);
        this.play();
        this.reloadTabs();
      },
      timeupdate: function(){
        this.super.timeupdate();
        if(this.subtitles){
          var length = this.subtitles.length,
            i;
          for(i = 0; i<length; i++){
            if(!this.displayedSubtitles[this.subtitles[i].time] && this.video.currentTime >= this.subtitles[i].time){
              this.displayedSubtitles[this.subtitles[i].time] = true;
              this.subtitle.removeAttribute('data-banner');
              this.subtitle.style.background = 'none';
              if(this.subtitles[i].subtitles.substr(this.subtitles[i].subtitles.length - 4) === '.jpg'){
                this.subtitle.style.background = 'url('+this.subtitles[i].subtitles+') no-repeat center center / cover';
                this.subtitle.setAttribute('data-banner', true);
              }else{
                this.subtitle.innerHTML = this.subtitles[i].subtitles;
              }
            }
          }
        }
      },
      reloadTabs: function(){
        var length = this.config.length,
          tabs = this.tabs.getElementsByTagName('div'),
          i = tabs.length,
          tab;
        while(i--){
          this.tabs.removeChild(tabs[i]);
        }
        for(i = 0; i<length; i++){
          if(this.config[i] === this.currentConfig) continue;
          tab = document.createElement('div');
          tab.innerHTML = this.config[i].title;
          tab.config = this.config[i];
          this.api.addEvent(tab, 'click', this.changeMovie.bind(this));
          this.tabs.appendChild(tab);
        }
      }
    }
  })
;
