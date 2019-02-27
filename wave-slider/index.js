FooHTML
  .register('wave-slider', {
    onCreate: function(){
      var prev = document.createElement('div'),
        next = document.createElement('div');
      this.config = JSON.parse((this.getAttribute('data-config')).replace(/'/g, '"'));
      this.width = this.offsetWidth;
      this.height = this.offsetHeight;
      this.api.setStyles(this, [['position', 'relative'], ['overflow', 'hidden']]);
      this.style.background = 'url('+this.config[0].img+') no-repeat center center / cover';
      prev.className = 'prev';
      next.className = 'next';
      this.prev = prev;
      this.next = next;
      this.appendChild(prev);
      this.appendChild(next);
      this.step = 0;
      this.z = 1;
      this.api.addEvent(prev, 'click', this.slide.bind(this, -1));
      this.api.addEvent(next, 'click', this.slide.bind(this, 1));
    },
    methods:{
      slide: function(step, e){
        console.log(step, +step);
        var i = 2, time = 3000, img, circle, circleIn, top, left;
        this.step += step;
        if(this.step < 0) this.step = this.config.length - 1;
        if(this.step >= this.config.length) this.step = 0;
        img = this.config[this.step].img
        while(i--){
          top = i === 0 ? (e.clientY - Math.round(this.getBoundingClientRect().top)) : Math.floor(Math.random()*this.height),
          left = i === 0 ? (e.clientX - Math.round(this.getBoundingClientRect().left)) : (step === -1 ? Math.floor(Math.random()*this.width/3+2*this.width/3) : Math.floor(Math.random()*this.width/3));
          console.log({top, left});
          circle = document.createElement('div');
          circle.className = 'circle';
          this.api.setStyles(circle, [['position', 'absolute'], ['width', '0px'], ['height', '0px'], ['border-radius', '50%'], ['background-color', '#FFF'], ['top', top+'px'], ['left', left+'px'], ['transform', 'translateX(-50%) translateY(-50%)'], ['transition', 'all '+time+'ms linear'], ['z-index', this.z]]);
          circleIn = document.createElement('div');
          circleIn.className = 'circle';
          this.api.setStyles(circleIn, [['position', 'absolute'], ['width', '0px'], ['height', '0px'], ['border-radius', '50%'], ['background-color', 'lightgray'], ['top', top+'px'], ['left', left+'px'], ['transform', 'translateX(-50%) translateY(-50%)'], ['transform', 'translateX(-50%) translateY(-50%)'], ['transition', 'all '+time+'ms linear'], ['z-index', this.z+1], ['background-image', 'url('+img+')'], ['background-repeat', 'no-repeat'], ['background-position', 'calc(50% - '+left+'px + '+Math.round(this.width/2)+'px) calc(50% - '+top+'px + '+Math.round(this.height/2)+'px)'], ['background-size', this.width+'px '+this.height+'px']]);
          this.appendChild(circle);
          this.appendChild(circleIn);
          setTimeout(this.expandCircle.bind(this, circle, this.width), 200);
          setTimeout(this.expandCircle.bind(this, circleIn, this.width), 400);
          setTimeout(this.clear.bind(this), time+400);
        }
        this.z += 1;
        this.prev.style.zIndex = this.z + 1;
        this.next.style.zIndex = this.z + 1;
      },
      clear: function () {
        return;
        var circles = this.getElementsByClassName('circle'),
          i = circles.length;
        while (i--) {
          this.removeChild(circles[i]);
        }
      },
      expandCircle: function (circle, width) {
        this.api.setStyles(circle, [['width', 2*width+'px'], ['height', 2*width+'px']]);
      }
    }
  })
;
