FooHTML
  .register('simple-button', {
		events: {
			click: function () {
				this.style.backgroundColor = 'gold';
				this.innerHTML = 'I was clicked!';
			}
		}
	})
;
