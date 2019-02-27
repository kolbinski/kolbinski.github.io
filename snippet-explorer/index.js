FooHTML
	.register('snippet-explorer-title', {
		events: {
			click: function(){
				this.parentNode.activeTab = this.getAttribute('data-index');
				this.parentNode.setTab();
			}
		}
	})
	.register('snippet-explorer', {
		onCreate: function () {
			var title = this.getAttribute('title');
			var tabTitles = ['HTML', 'JavaScript', 'CSS'];
			for (var idx = 0; idx < 3; idx++) {
				var tab = document.createElement('snippet-explorer-title');
				tab.innerHTML = tabTitles[idx];
				this.appendChild(tab);
			}
			var contents = ['snippet.txt', 'index.js', 'style.css'];
			for (var idx = 0; idx < 3; idx++) {
				var content = document.createElement('snippet-explorer-content');
				var iframe = document.createElement('iframe');
				iframe.src = 'https://kolbinski.github.io/' + title + '/' + contents[idx];
				this.appendChild(iframe);
			}
			var titleTags = this.getElementsByTagName('snippet-explorer-title'),
				contentTags = this.getElementsByTagName('snippet-explorer-content'),
				length = titleTags.length,
				i = length;
			while(i--){
				titleTags[length - i - 1].setAttribute('data-index', length - i - 1);
				contentTags[length - i - 1].setAttribute('data-index', length - i - 1);
			}
			this.prevTab = null;
			this.activeTab = 0;
			this.setTab();
		},
		methods: {
			setTab: function(){
				if(this.prevTab !== null){
					this.getElementsByTagName('snippet-explorer-title')[this.prevTab].className = this.getElementsByTagName('snippet-explorer-title')[this.prevTab].className.replace(' active', '');
					this.getElementsByTagName('snippet-explorer-content')[this.prevTab].style.display = 'none';
				}
				this.getElementsByTagName('snippet-explorer-title')[this.activeTab].className += ' active';
				this.getElementsByTagName('snippet-explorer-content')[this.activeTab].style.display = 'block';
				this.prevTab = this.activeTab;
			}
		}
	})
 ;
