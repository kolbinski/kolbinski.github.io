FooHTML
  .register('hexagonal-gallery', {
    onCreate: function(){
      var config = JSON.parse((this.getAttribute('data-config')).replace(/'/g, '"')),
        margin = (config.glue || {size: 0}).size || 0,
        color = (config.glue || {color: '#000'}).color || '#000',
        marginHalf = Math.floor(margin/2),
        marginSlant = Math.floor(margin / Math.sqrt(5)),
        columns = config.size[0],
        rows = config.size[1],
        k = -1, m = 1, n = 1, size = columns === 1 ? (rows+(rows+1)*(columns+1)) : (((columns+1)*(Math.ceil(rows/2)+1)) + (columns * (Math.floor(rows/2)+1))),
        tile,
        edge;
      this.style.backgroundColor = color;
      while(k++ < size - 1){
        edge = '';
        tile = this.api.createElement('hexagonal-image', false);
        if(config.tiles[k]) tile.setAttribute('src', config.tiles[k]);
        tile.style.marginTop = marginSlant+'px';
        tile.style.marginBottom = marginSlant+'px';
        tile.style.marginLeft = marginHalf+'px';
        tile.style.marginRight = marginHalf+'px';
        if(k > 0 && k < columns) edge = 'top';
        if(k > size - 1 - columns) edge = 'bottom';
        if(columns === 1){
          if(!(k % 3)) edge = 'left';
          if(!((k-1) % 3)) edge = 'right';
          if(k === size - 2) edge = 'bottom-left';
          if(k === size - 1) edge = 'bottom-right';
        }else{
          if(!(k % (columns*2+1))) edge = 'left';
          if(!(k % (columns*3+2 - 1))) edge = 'right';
          if((rows%2) && k === size - 1 - columns) edge = 'bottom-left';
          if((rows%2) && k === size - 1) edge = 'bottom-right';
        };
        if(k === 0) edge = 'top-left';
        if(k === columns) edge = 'top-right';
        if(k>0 && !(k % (columns*m+n))){
          tile.style.marginLeft = margin+'px';
          m += 2;
          n++;
        }
        tile.setAttribute('data-edge', edge);
        tile.style.width = Math.floor((+(window.getComputedStyle(this).width).replace('px', '') - margin * (columns + 1))/columns)+'px';
        if(edge.indexOf('top') > -1) tile.style.marginTop = margin+'px';
        if(edge.indexOf('bottom') > -1) tile.style.marginBottom = margin+'px';
        if(edge.indexOf('left') > -1) tile.style.marginLeft = margin+'px';
        if(edge.indexOf('right') > -1) tile.style.marginRight = margin+'px';
        if(edge.indexOf('left') > -1 || edge.indexOf('right') > -1){
          tile.setAttribute('data-margin', marginHalf);
        }
        this.api.callOnCreate(tile);
        this.appendChild(tile);
      }
    }
  })
;
