FooHTML
  .register('lazy-image', {
    extends: 'lazy-loading',
    methods: {
      load: function(){
        this.super.load();
        var src = this.getAttribute('src'),
          img = new Image(),
          _this = this;
        img.onload = function(){
          _this.style.background = 'url('+src+') no-repeat center center / cover';
        }
        img.src = src;
      }
    }
  })
;
