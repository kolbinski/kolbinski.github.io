FooHTML
  .register('hexagonal-image', {
    onCreate: function(){
      var src = this.getAttribute('src'),
        edge = this.getAttribute('data-edge'),
        margin = this.getAttribute('data-margin') || 0,
        wrap = document.createElement('div'),
        wrapIn = document.createElement('div'),
        div1 = document.createElement('div'),
        div2 = document.createElement('div'),
        div3 = document.createElement('div'),
        span1 = document.createElement('span'),
        span2 = document.createElement('span'),
        width, height, divStyles, spanStyles, edgeConfig, img = new Image(), apla,
        aplaStyles = [['position', 'absolute'], ['top', 0], ['bottom', 0], ['left', 0], ['right', 0], ['backgroundColor', 'hsl(50, 0%, '+Math.random()*100+'%)'], ['opacity', 1], ['transition', 'opacity 1000ms ease-in-out']];
      this.style.display = 'block';
      width = (this.style.width?this.style.width:window.getComputedStyle(this).width).replace('px', '');
      height = Math.ceil(2*width*Math.sqrt(3)/3);
      divStyles = [['height', Math.ceil(height/2)+'px'], ['transform-origin', '50% 50%'], ['width', '100%'], ['position', 'absolute'], ['top', '50%'], ['left', '50%'], ['transform', 'translateX(-50%) translateY(-50%) rotate(60deg)'], ['overflow', 'hidden']];
      spanStyles = [['display', 'block'], ['position', 'absolute'], ['width', '100%'], ['height', height+'px'], ['transform-origin', '50% 50%'], ['top', '50%'], ['left', '50%'], ['transform', 'translateX(-50%) translateY(-50%) rotate(-60deg)']];
      edgeConfig = {
        width: width,
        height: Math.ceil(width*7/8),
        tileHeight: height,
        horizontal: 'left',
        vertical: 'top',
        offsetTop: Math.ceil(-height/8)
      };
      if(edge){
        if(edge !== 'top' && edge !== 'bottom') edgeConfig.width = Math.ceil(width/2);
        if(edge !== 'left' && edge !== 'right'){
          edgeConfig.height = Math.ceil(width*7/16);
          edgeConfig.tileHeight = Math.ceil(height/2);
        }
        if(edge.indexOf('left') > -1) edgeConfig.horizontal = 'right';
        if(edge.indexOf('right') > -1) edgeConfig.horizontal = 'left';
        if(edge.indexOf('top') > -1){
          edgeConfig.vertical = 'bottom';
          edgeConfig.offsetTop = 0;
        }
        if(edge.indexOf('bottom') > -1) edgeConfig.vertical = 'top';
      }
      div3.style.backgroundColor = '#888';
      span1.style.backgroundColor = '#888';
      span2.style.backgroundColor = '#888';
      apla = document.createElement('div');
      apla.className = 'apla';
      this.api.setStyles(apla, aplaStyles);
      div3.appendChild(apla);
      this.layer1 = div3;
      apla = document.createElement('div');
      apla.className = 'apla';
      this.api.setStyles(apla, aplaStyles);
      span1.appendChild(apla);
      this.layer2 = span1;
      apla = document.createElement('div');
      apla.className = 'apla';
      this.api.setStyles(apla, aplaStyles);
      span2.appendChild(apla);
      this.layer3 = span2;
      this.api.setStyles(wrap, [['position', 'absolute'], ['width', '100%'], ['height', edgeConfig.tileHeight+'px'], ['overflow', 'hidden'], ['top', edgeConfig.offsetTop+'px'], ['left', 0]]);
      this.api.setStyles(wrapIn, [['position', 'absolute'], ['width', width+'px'], ['height', height+'px'], [edgeConfig.vertical, 0], [edgeConfig.horizontal, 0]]);
      wrapIn.appendChild(div1);
      div1.appendChild(span1);
      wrapIn.appendChild(div2);
      div2.appendChild(span2);
      wrapIn.appendChild(div3);
      this.api.setStyles(this, [['position', 'relative'], ['width', (edgeConfig.width-margin)+'px'], ['height', edgeConfig.height+'px'], ['display', 'inline-block'], ['vertical-align', 'middle'], ['overflow', 'visible']]);
      this.api.setStyles(div1, divStyles);
      this.api.setStyles(div2, divStyles);
      this.api.setStyles(div3, divStyles);
      this.api.setStyle(div2, 'transform', 'translateX(-50%) translateY(-50%) rotate(-60deg)');
      this.api.setStyle(div3, 'transform', 'translateX(-50%) translateY(-50%) rotate(0deg)');
      this.api.setStyles(span1, spanStyles);
      this.api.setStyles(span2, spanStyles);
      this.api.setStyle(span2, 'transform', 'translateX(-50%) translateY(-50%) rotate(60deg)');
      wrap.appendChild(wrapIn);
      this.appendChild(wrap);
      img.onload = this.imgLoad.bind(this, img);
      img.src = src;
    },
    methods: {
      imgLoad: function(img){
        this.layer1.style.background = 'url('+img.src+') no-repeat center center / cover';
        this.layer2.style.background = 'url('+img.src+') no-repeat center center / cover';
        this.layer3.style.background = 'url('+img.src+') no-repeat center center / cover';
        if(img.width > img.height){
          this.layer1.style.backgroundSize = 'auto 200%';
        }
        var aplas = this.getElementsByClassName('apla');
        setTimeout(function(){
          aplas[0].style.opacity = 0;
          aplas[1].style.opacity = 0;
          aplas[2].style.opacity = 0;
        }, Math.random()*3000);
      }
    }
  })
;
