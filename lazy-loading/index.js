FooHTML
  .register('lazy-loading', {
    onCreate: function(){
      this.threshold = this.getAttribute('data-threshold') || 0;
      this.lazyType = 0;
      if(this.threshold[this.threshold.length - 1] === '%'){
        this.threshold = this.threshold.replace('%', '');
        if(this.threshold[0] === 'W'){
          this.threshold = this.threshold.replace('W', '');
          this.lazyType = 1;
        }else{
          this.lazyType = 2;
        }
      }else if(this.threshold > 0 && this.threshold < 1){
        this.lazyType = 3;
      }
      this.threshold = +this.threshold;
    },
    methods: {
      checkLoading: function(){
        var condition = false;
        if(this.lazyType === 0){
          condition = window.pageYOffset >= this.offsetTop - window.innerHeight + this.threshold;
        }else if(this.lazyType === 1){
          condition = window.pageYOffset >= this.offsetTop - window.innerHeight * this.threshold / 100;
        }else if(this.lazyType === 2){
          condition = window.pageYOffset >= this.offsetTop - window.innerHeight + this.offsetHeight * this.threshold / 100;
        }else if(this.lazyType === 3){
          condition = window.pageYOffset >= this.offsetTop - window.innerHeight / 2 + this.offsetHeight * this.threshold;
        }
        if(condition){
          this.loaded = true;
          this.load();
        }
      },
      load: function(){
        this.className += ' loaded';
      }
    },
    externalEvents: [
      {
        target: window,
        events: {
          scroll: {
            trigger: true,
            func: function(){
              var lazyloadings = document.getElementsByClassName('lazy-loading'),
                i = lazyloadings.length;
              while(i--){
                if(lazyloadings[i].initialized && !lazyloadings[i].loaded) lazyloadings[i].checkLoading();
              }
            }
          }
        }
      }
    ]
  })
;
