FooHTML
	.register('x-tabs', {
		onCreate: function(){
			var titleTags = this.getElementsByTagName('x-tab-title'),
				contentTags = this.getElementsByTagName('x-tab-content'),
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
					this.getElementsByTagName('x-tab-title')[this.prevTab].className = this.getElementsByTagName('x-tab-title')[this.prevTab].className.replace(' active', '');
					this.getElementsByTagName('x-tab-content')[this.prevTab].style.display = 'none';
				}
				this.getElementsByTagName('x-tab-title')[this.activeTab].className += ' active';
				this.getElementsByTagName('x-tab-content')[this.activeTab].style.display = 'block';
				this.prevTab = this.activeTab;
			}
		}
	})
	.register('x-tab-title', {
		events: {
			click: function(){
				this.parentNode.activeTab = this.getAttribute('data-index');
				this.parentNode.setTab();
			}
		}
	})
	.register('x-tab-content', {
		onCreate: function(){
			this.innerHTML = this.innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
	})
	
	.register('x-foo', {
		events: {
			click: function() {
				this.style.backgroundColor = 'green';
				this.innerHTML = 'You clicked me!';
			}
		}
	})
	
	.register('x-checkbox', {
		onCreate: function(){
			this.checked = this.getAttribute('data-checked') || false;
			this.disabled = this.getAttribute('data-disabled') || false;
			this.defaults = {
				checked: this.checked,
				disabled: this.disabled
			}
		},
		events: {
			click: function(){
				if(this.disabled) return;
				this.setValue(!this.checked);
			}
		},
		methods: {
			check: function(){
				this.setValue(true);
			},
			uncheck: function(){
				this.setValue(false);
			},
			toggle: function(){
				this.setValue(!this.checked);
			},
			setValue: function(value){
				this.checked = value;
				this.setAttribute('data-checked', this.checked);
			},
			enable: function(){
				this.setAbility(true);
			},
			disable: function(){
				this.setAbility(false);
			},
			toggleAbility: function(){
				this.setAbility(this.disabled);
			},
			setAbility: function(enabled){
				this.disabled = !enabled;
				this.setAttribute('data-disabled', this.disabled);
			},
			reset: function(){
				this.setValue(this.defaults.checked);
				this.setAbility(!this.defaults.disabled);
			}
		}
	})
	
	.register('x-combobox', {
		onCreate: function(){
			this.opened = false;
			this.selected = {
				index: 0,
				value: null,
				text: ''
			};
			this.values = [];
			var options = this.getElementsByTagName('x-option'),
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
							var comboboxes = document.getElementsByTagName('x-combobox'),
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
						this.getElementsByTagName('x-option')[0].innerHTML = this.values[0].text;
					}else{
						this.getElementsByTagName('x-option')[0].innerHTML = this.selected.text;
					}
				}
			},
			setValue: function(value){
				if(!this.opened){
					this.getElementsByTagName('x-option')[0].innerHTML = this.values[0].text;
				}else{
					if(value){
						var i = this.values.length;
						while(i--){
							if(this.values[i].value === value){
								if(value && this.selected.index){
									this.getElementsByTagName('x-option')[this.selected.index].setAttribute('selected', false);
								}
								this.selected.index = i;
								this.selected.value = value;
								this.selected.text = this.values[i].text;
								this.getElementsByTagName('x-option')[0].innerHTML = this.selected.text;
								if(this.selected.value !== null){
									this.getElementsByTagName('x-option')[this.selected.index].setAttribute('selected', true);
								}
								break;
							}
						};
					}else{
						this.getElementsByTagName('x-option')[this.selected.index].setAttribute('selected', false);
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
	.register('x-option', {
		events: {
			click: function(){
				this.parentNode.setValue(this.getAttribute('value'));
			}
		}
	})
	
	//TODO: poprawic, aby kolejnosc register nie miala wplywu na ladowanie lazy loadingu gdy obrazek jest juz na ekranie
	.register('x-image', {
		extends: 'x-lazyloading',
		methods: {
			load: function(){
				this.super.load();
				var src = this.getAttribute('data-src'),
					img = new Image(),
					_this = this;
				img.onload = function(){
					_this.style.background = 'url('+src+') no-repeat center center / cover';
				}
				img.src = src;
			}
		}
	})
	
	.register('x-lazyloading', {
		onCreate: function(){
			this.threshold = this.getAttribute('data-lazy-threshold') || 0;
			this.lazyType = 0;
			if(this.threshold[this.threshold.length - 1] === '%'){
				this.threshold = this.threshold.replace('%', '');
				if(this.threshold[0] === 'W'){
					this.threshold = this.threshold.replace('W', '');
					this.lazyType = 1;
				}else{
					this.lazyType = 2;
				}
			}else if(this.threshold > 0 && this.threshold < 1){
				this.lazyType = 3;
			}
			this.threshold = +this.threshold;
		},
		methods: {
			checkLoading: function(){
				var condition = false;
				if(this.lazyType === 0){
					condition = window.pageYOffset >= this.offsetTop - window.innerHeight + this.threshold;
				}else if(this.lazyType === 1){
					condition = window.pageYOffset >= this.offsetTop - window.innerHeight * this.threshold / 100;
				}else if(this.lazyType === 2){
					condition = window.pageYOffset >= this.offsetTop - window.innerHeight + this.offsetHeight * this.threshold / 100;
				}else if(this.lazyType === 3){
					condition = window.pageYOffset >= this.offsetTop - window.innerHeight / 2 + this.offsetHeight * this.threshold;
				}
				if(condition){
					this.loaded = true;
					this.load();
				}
			},
			load: function(){
				this.className += ' loaded';
			}
		},
		externalEvents: [
			{
				target: window,
				events: {
					scroll: {
						trigger: true,
						func: function(){
							var lazyloadings = document.getElementsByClassName('x-lazyloading'),
								i = lazyloadings.length;
							while(i--){
								if(lazyloadings[i].initialized && !lazyloadings[i].loaded) lazyloadings[i].checkLoading();
							}
						}
					}
				}
			}
		]
	})
	
	.register('x-player', {
		onCreate: function(){
			var video = document.createElement('video'),
				config = JSON.parse((this.getAttribute('data-config')).replace(/'/g, '"')),
				i,
				source,
				titleDiv = document.createElement('div'),
				playDiv = document.createElement('div'),
				progressBarDiv = document.createElement('div');
				progressCurrBarDiv = document.createElement('div');
			this.config = config;
			titleDiv.className = 'title';
			this.titleDiv = titleDiv;
			playDiv.className = 'play';
			this.api.addEvent(playDiv, 'click', this.togglePause.bind(this));
			progressBarDiv.className = 'progressBar';
			progressCurrBarDiv.className = 'progressCurrBar';
			this.progressCurrBarDiv = progressCurrBarDiv;
			this.api.addEvent(video, 'pause', this.pause.bind(this));
			this.api.addEvent(video, 'timeupdate', this.timeupdate.bind(this));
			this.api.addEvent(progressBarDiv, 'click', this.move.bind(this));
			this.api.addEvent(progressCurrBarDiv, 'click', this.move.bind(this));
			this.appendChild(video);
			this.appendChild(titleDiv);
			this.appendChild(playDiv);
			this.appendChild(progressBarDiv);
			this.appendChild(progressCurrBarDiv);
			this.video = video;
			this.playing = false;
			this.reloadMovie(config[0]);
		},
		methods: {
			reloadMovie: function(config){
				this.titleDiv.innerHTML = config.title;
				var sources = this.video.getElementsByTagName('source'),
					i = sources.length;
				while(i--){
					this.video.removeChild(sources[i]);
				}
				for(i in config.videos){
					sources = document.createElement('source');
					sources.setAttribute('type', i);
					sources.setAttribute('src', config.videos[i]);
					this.video.appendChild(sources);
				}
				this.video.load();
			},
			togglePause: function(){
				if(this.playing){
					this.pause();
				}else{
					this.play();
				}
			},
			play: function(){
				if(this.data.playingPlayer && this.data.playingPlayer !== this){
					this.data.playingPlayer.video.pause();
				}
				this.video.play();
				this.setAttribute('data-playing', true);
				this.playing = true;
				this.data.playingPlayer = this;
			},
			pause: function(){
				this.video.pause();
				this.removeAttribute('data-playing');
				this.playing = false;
			},
			timeupdate: function(){
				this.progressCurrBarDiv.style.width = 100 * (this.video.currentTime / this.video.duration) + '%';
			},
			move: function(e){
				this.video.currentTime = this.video.duration * (e.clientX - Math.round(this.getBoundingClientRect().left)) / this.offsetWidth;
				this.play();
			}
		},
		data: {
			playingPlayer: null	
		}
	})
	
	.register('x-player-advanced', {
		extends: 'x-player',
		onCreate: function(){
			var tabs = document.createElement('div'),
				cover = document.createElement('div'),
				covers = document.createElement('div'),
				subtitle = document.createElement('span');
			cover.className = 'cover';
			cover.style.background = 'url('+this.config[0].cover+') no-repeat center center / cover';
			this.cover = cover;
			this.appendChild(cover);
			tabs.className = 'tabs';
			this.tabs = tabs;
			this.currentConfig = this.config[0];
			this.reloadTabs();
			this.appendChild(tabs);
			covers.className = 'covers';
			this.covers = covers;
			this.appendChild(covers);
			subtitle.className = 'subtitles';
			this.subtitle = subtitle;
			this.appendChild(subtitle);
			this.api.addEvent(this.video, 'ended', this.showCovers.bind(this));
			this.api.addEvent(this.video, 'timeupdate', this.timeupdate.bind(this));
		},
		methods: {
			play: function(){
				this.super.play();
				this.cover.style.display = 'none';
				this.covers.style.display = 'none';
				this.subtitle.innerHTML = '';
				this.subtitle.style.display = 'none';
				if(this.currentConfig.subtitles){
					var subtitles = [];
					for(i in this.currentConfig.subtitles){
						subtitles.push({time: i, subtitles: this.currentConfig.subtitles[i]});
					}
					this.subtitles = subtitles;
					this.displayedSubtitles = {};
					this.subtitle.style.display = 'block';
				}
			},
			showCovers: function(){
				var length = this.config.length,
					covers = this.covers.getElementsByTagName('div'),
					i = covers.length,
					cover;
				while(i--){
					this.covers.removeChild(covers[i]);
				}
				for(i = 0; i<length; i++){
					if(this.config[i] === this.currentConfig) continue;
					cover = document.createElement('div');
					cover.innerHTML = this.config[i].title;
					cover.style.background = 'url('+this.config[i].cover+') no-repeat center center / cover';
					cover.config = this.config[i];
					this.api.addEvent(cover, 'click', this.changeMovie.bind(this));
					this.covers.appendChild(cover);
				}
				this.covers.style.display = 'block';
				this.subtitle.innerHTML = '';
				this.subtitle.style.display = 'none';
				this.subtitle.style.background = 'none';
				this.subtitle.removeAttribute('data-banner');
			},
			changeMovie: function(e){
				this.currentConfig = e.target.config;
				this.super.reloadMovie(this.currentConfig);
				this.play();
				this.reloadTabs();
			},
			timeupdate: function(){
				this.super.timeupdate();
				if(this.subtitles){
					var length = this.subtitles.length,
						i;
					for(i = 0; i<length; i++){
						if(!this.displayedSubtitles[this.subtitles[i].time] && this.video.currentTime >= this.subtitles[i].time){
							this.displayedSubtitles[this.subtitles[i].time] = true;
							this.subtitle.removeAttribute('data-banner');
							this.subtitle.style.background = 'none';
							if(this.subtitles[i].subtitles.substr(this.subtitles[i].subtitles.length - 4) === '.jpg'){
								this.subtitle.style.background = 'url('+this.subtitles[i].subtitles+') no-repeat center center / cover';
								this.subtitle.setAttribute('data-banner', true);
							}else{
								this.subtitle.innerHTML = this.subtitles[i].subtitles;
							}
						}
					}
				}
			},
			reloadTabs: function(){
				var length = this.config.length,
					tabs = this.tabs.getElementsByTagName('div'),
					i = tabs.length,
					tab;
				while(i--){
					this.tabs.removeChild(tabs[i]);
				}
				for(i = 0; i<length; i++){
					if(this.config[i] === this.currentConfig) continue;
					tab = document.createElement('div');
					tab.innerHTML = this.config[i].title;
					tab.config = this.config[i];
					this.api.addEvent(tab, 'click', this.changeMovie.bind(this));
					this.tabs.appendChild(tab);
				}
			}
		}
	})
	
	.addMethod('setStyle', function(obj, property, value){
		obj.style[property] = value;
	})
	
	.addMethod('setStyles', function(obj, styles){
		var i = styles.length;
		while(i--){
			this.setStyle(obj, styles[i][0], styles[i][1]);
		}
	})
	
	.register('x-hex-img', {
		onCreate: function(){
			var src = this.getAttribute('data-src'),
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
	
	.register('x-hex-mosaic', {
		onCreate: function(){
			var config = JSON.parse((this.getAttribute('data-config')).replace(/'/g, '"')),
				margin = config.margin || 0,
				marginHalf = Math.floor(margin/2),
				marginSlant = Math.floor(margin / Math.sqrt(5)),
				columns = config.size[0],
				rows = config.size[1],
				k = -1, m = 1, n = 1, size = columns === 1 ? (rows+(rows+1)*(columns+1)) : (((columns+1)*(Math.ceil(rows/2)+1)) + (columns * (Math.floor(rows/2)+1))),
				tile,
				edge;
			while(k++ < size - 1){
				edge = '';
				tile = this.api.createElement('x-hex-img', false);
				if(config.tiles[k]) tile.setAttribute('data-src', config.tiles[k]);
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
	
	.register('x-slider', {
		onCreate: function(){
			var prev = document.createElement('div'),
				next = document.createElement('div');
			this.config = JSON.parse((this.getAttribute('data-config')).replace(/'/g, '"'));
			this.width = this.offsetWidth;
			this.height = this.offsetHeight;
			this.api.setStyles(this, [['position', 'relative'], ['overflow', 'hidden']]);
			this.style.background = 'url('+this.config[0].img+') no-repeat center center / cover';
			//this.slide();
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
					circle = document.createElement('div');
					circle.className = 'circle';
					this.api.setStyles(circle, [['position', 'absolute'], ['width', '0px'], ['height', '0px'], ['border-radius', '50%'], ['background-color', '#001626'], ['top', top+'px'], ['left', left+'px'], ['transform', 'translateX(-50%) translateY(-50%)'], ['transition', 'all '+time+'ms linear'], ['z-index', this.z]]);
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
			clear: function(){
				return;
				var circles = this.getElementsByClassName('circle'),
					i = circles.length;
				while(i--){
					this.removeChild(circles[i]);
				}
			},
			expandCircle: function(circle, width){
				this.api.setStyles(circle, [['width', 2*width+'px'], ['height', 2*width+'px']]);
			}
		}
	})
	
	.register('x-img-posterized', {
		onCreate: function(){
			var canvas = document.createElement('canvas'),
				img, i;
			this.config = JSON.parse((this.getAttribute('data-config')).replace(/'/g, '"'));
			this.size = this.config.length;
			canvas.width = this.offsetWidth;
			canvas.height = this.offsetHeight;
			this.appendChild(canvas);
			this.ctx = [];
			this.data = {};
			this.step = 0;
			this.thresholdStep = 10;
			i = this.size;
			this.lazyCounter = 0;
			while(i--){
				this.ctx.push(canvas.getContext('2d'));
				img = new Image();
				img.onload = this.onImgLoad.bind(this, img, i);
				img.src = this.config[i];
			}
			this.currData = null;
			this.api.addEvent(this, 'click', this.slide);
		},
		methods:{
			onImgLoad: function(img, i){
				if(1 || i===0){
					this.ctx[i].drawImage(img, 0, 0, this.offsetWidth, this.offsetHeight); //TODO: fix aspect ratio
				}
				this.data[i] = this.ctx[i].getImageData(0, 0, this.offsetWidth, this.offsetHeight);
				//this.preprocessor.call(this, i);
			},
			preprocessor: function(i){
				var length = this.data[i].data.length / 4, pixelGray;
				while(length--){
					pixelGray = 0.21 * this.data[i].data[length*4] + 0.72 * this.data[i].data[length*4+1] + 0.07 * this.data[i].data[length*4+2];
					this.data[i].data[length*4] = pixelGray;
					this.data[i].data[length*4+1] = pixelGray;
					this.data[i].data[length*4+2] = pixelGray;
				}
			},
			slide: function(){
				this.step++;
				if(this.step >= this.size) this.step = 0;
				this.threshold = 0;
				this.loop.call(this);
			},
			loop: function(){
				this.clear();
				this.update();
				this.draw();
				this.queue();
			},
			clear: function(){
				//this.ctx.clearRect(0, 0, this.offsetWidth, this.offsetHeight);
			},
			update: function(){
				var length, pixelGray, pixelGrayCurr, prevStep = this.step-1 === -1 ? this.size-1 : this.step-1, rnd;
				this.currData = this.ctx[prevStep].createImageData(this.offsetWidth, this.offsetHeight);
				this.currData.data.set(this.data[prevStep].data);
				length = this.data[prevStep].data.length / 4;
				var s = true;
				while(length--){
					pixelGray = 0.21 * this.data[prevStep].data[length*4] + 0.72 * this.data[prevStep].data[length*4+1] + 0.07 * this.data[prevStep].data[length*4+2];
					pixelGrayCurr = 0.21 * this.data[this.step].data[length*4] + 0.72 * this.data[this.step].data[length*4+1] + 0.07 * this.data[this.step].data[length*4+2];
					//if(s){ console.log(pixelGray, pixelGrayCurr, Math.floor(pixelGrayCurr), this.threshold, Math.floor(pixelGrayCurr*255)<= this.threshold, pixelGrayCurr > pixelGray); s = false; }
					rnd = Math.random()>0.5 ? pixelGrayCurr > 255 - this.threshold : pixelGrayCurr <= this.threshold;
					rnd = pixelGrayCurr > 255 - this.threshold;
					if(rnd){
						//if(s){ console.log(pixelGray, pixelGrayCurr); s = false; }
						this.currData.data[length*4] = this.data[this.step].data[length*4];
						this.currData.data[length*4+1] = this.data[this.step].data[length*4+1];
						this.currData.data[length*4+2] = this.data[this.step].data[length*4+2];
						/*this.currData.data[length*4] = pixelGrayCurr;
						this.currData.data[length*4+1] = pixelGrayCurr;
						this.currData.data[length*4+2] = pixelGrayCurr;*/
						//this.currData.data[length*4+3] = 0;
					}
				}
				this.threshold += this.thresholdStep;
			},
			draw: function(){
				this.ctx[this.step-1 === -1 ? this.size-1 : this.step-1].putImageData(this.currData, 0, 0);
				//this.ctx[this.step-1].clearRect(0, 0, this.offsetWidth, this.offsetHeight);
			},
			queue: function(){
				if(this.threshold > 255+this.thresholdStep) return;
				window.requestAnimationFrame(this.loop.bind(this));
			}
		}
	})
;

function resetCheckboxes(){
	var checkboxes = document.getElementsByTagName('x-checkbox'),
		i = checkboxes.length;
	while(i--){
		checkboxes[i].reset();
	}
}
