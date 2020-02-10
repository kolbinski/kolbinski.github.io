FooHTML
  .register('animated-select', {
    onCreate: function(){
      this.opened = false;
      this.selected = {
        index: 0,
        value: null,
        text: ''
      };
      this.values = [];
      var options = this.getElementsByTagName('animated-select-option'),
        length = options.length,
        i = 0;
      for(i; i<length; i++){
        this.values.push({
          index: i,
          value: options[i].getAttribute('value'),
          text: options[i].innerHTML
        });
      }
    },
    events: {
      click: function(){
        this.toggleOpen();
      }
    },
    externalEvents: [
      {
        target: document,
        events: {
          click: {
            func: function(e){
              var comboboxes = document.getElementsByTagName('animated-select'),
                i = comboboxes.length;
              while(i--){
                if(comboboxes[i] !== e.target.parentNode && comboboxes[i].opened) comboboxes[i].toggleOpen();
              }
            }
          }
        }
      }
    ],
    methods: {
      toggleOpen: function(){
        if(this.opened){
          this.className = this.className.replace(' opened', '');
        }else{
          this.className += ' opened';
        }
        this.opened = !this.opened;
        if(this.selected.text){
          if(this.opened){
            this.getElementsByTagName('animated-select-option')[0].innerHTML = this.values[0].text;
          }else{
            this.getElementsByTagName('animated-select-option')[0].innerHTML = this.selected.text;
          }
        }
      },
      setValue: function(value){
        if(!this.opened){
          this.getElementsByTagName('animated-select-option')[0].innerHTML = this.values[0].text;
        }else{
          if(value){
            var i = this.values.length;
            while(i--){
              if(this.values[i].value === value){
                if(value && this.selected.index){
                  this.getElementsByTagName('animated-select-option')[this.selected.index].setAttribute('selected', false);
                }
                this.selected.index = i;
                this.selected.value = value;
                this.selected.text = this.values[i].text;
                this.getElementsByTagName('animated-select-option')[0].innerHTML = this.selected.text;
                if(this.selected.value !== null){
                  this.getElementsByTagName('animated-select-option')[this.selected.index].setAttribute('selected', true);
                }
                break;
              }
            };
          }else{
            this.getElementsByTagName('animated-select-option')[this.selected.index].setAttribute('selected', false);
            this.selected.index = 0;
            this.selected.value = null;
            this.selected.text = '';
          }
        }
      },
      getSelected: function(){
        return this.selected;
      }
    }
  })
  .register('animated-select-option', {
    events: {
      click: function(){
        this.parentNode.setValue(this.getAttribute('value'));
      }
    }
  })
;
