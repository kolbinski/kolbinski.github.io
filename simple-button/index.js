FooHTML
  .register('simple-button', {
		events: {
			click: () => {
				this.style.backgroundColor = 'gold';
				this.innerHTML = 'I was clicked!';
			}
		}
	})
;
