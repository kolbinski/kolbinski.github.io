FooHTML
  .register('simple-button', {
    events: {
      click: function () {
        this.style.color = '#FFF';
        this.style.backgroundColor = '#00b8ff';
        this.innerHTML = 'I was clicked!';
      }
    }
  })
;
