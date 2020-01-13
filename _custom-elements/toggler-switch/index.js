FooHTML
  .register('toggler-switch', {
    onCreate: function () {
      this.checked = this.getAttribute('checked') === '';
      this.disabled = this.getAttribute('disabled') === '';
    },
    events: {
      click: function(){
        if (this.disabled) return;
        this.setValue(!this.checked);
      }
    },
    methods: {
      setValue: function(value){
        this.checked = value;
        if (this.checked) {
          this.setAttribute('checked', true);
        } else {
          this.removeAttribute('checked')
        }
      },
    }
  })
;
