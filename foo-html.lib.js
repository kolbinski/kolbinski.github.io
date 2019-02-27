var FooHTML = FooHTML || (function(window, document){
	var registerTags = {}, proto, i, j, k, isBrowserSupport = document.registerElement, isOnCreatedToBeCalled = true,
		addEvent = function(obj, event, func){
			if(obj.addEventListener){
				obj.addEventListener(event, func);
			}else{
				obj.attachEvent('on'+event, func);
			}
		},
		removeEvent = function(obj, event, func){
			if(obj.removeEventListener){
				obj.removeEventListener(event, func);
			}else{
				obj.detachEvent('on'+event, func);
			}
		},
		createElement = function(tag, _isOnCreatedToBeCalled){
			if(_isOnCreatedToBeCalled === undefined) _isOnCreatedToBeCalled = true;
			isOnCreatedToBeCalled = _isOnCreatedToBeCalled;
			var element = document.createElement(tag);
			if(!isBrowserSupport){
				createdCallbackFallback(element, tag, false);
			}
			return element;
		},
		callOnCreate = function(_this){
			registerTags[_this.tagName.toLowerCase()].onCreate.call(_this);
		},
		createdCallbackFallback = function(_this, tag, registerTargetEvents){
			_this.api = api;
			_this.data = registerTags[tag].data || {};
			if(registerTags[tag].extends){
				_this.super = {};
				j = registerTags[registerTags[tag].extends].methods;
				if(j){
					for(k in j){
						_this.super[k] = j[k].bind(_this);
					}
				}
				createdCallbackFallback(_this, registerTags[tag].extends, false);
				for(j in registerTags[registerTags[tag].extends].data){
					_this.data[j] = registerTags[registerTags[tag].extends].data[j];
				}
			}
			_this.className += ' ' + tag;
			if(registerTags[tag].methods){
				for(j in registerTags[tag].methods){
					_this[j] = registerTags[tag].methods[j];
				}
			}
			//console.log(tag, isOnCreatedToBeCalled);
			if(registerTags[tag].onCreate && isOnCreatedToBeCalled){
				//setTimeout(function(){registerTags[tag].onCreate.call(_this)}, 100); //TODO: avoid setTimeout
				registerTags[tag].onCreate.call(_this);
				isOnCreatedToBeCalled = true;
			}
			if(registerTags[tag].events){
				for(j in registerTags[tag].events){
					addEvent(_this, j, registerTags[tag].events[j]);
				}
			}
			if(registerTargetEvents && registerTags[tag].externalEvents){
				j = registerTags[tag].externalEvents.length;
				while(j--){
					for(k in registerTags[tag].externalEvents[j].events){
						addEvent(registerTags[tag].externalEvents[j].target, k, registerTags[tag].externalEvents[j].events[k].func);
					}
				}
			}
		},
		createdCallback = function(){
			createdCallbackFallback(this, this.tagName.toLowerCase(), true);
		},
		onload = function(){
			for(tag in registerTags){
				if(isBrowserSupport){
					proto = Object.create(HTMLElement.prototype);
					proto.createdCallback = createdCallback;
					document.registerElement(tag, {prototype: proto});
				}else{
					tags = document.getElementsByTagName(tag);
					i = tags.length;
					while(i--){
						createdCallbackFallback(tags[i], tag, true);
					}
				}
				tags = document.getElementsByTagName(tag);
				i = tags.length;
				while(i--){
					tags[i].initialized = true;
				}
				if(registerTags[tag].externalEvents){
					j = registerTags[tag].externalEvents.length;
					while(j--){
						for(k in registerTags[tag].externalEvents[j].events){
							if(registerTags[tag].externalEvents[j].events[k].trigger){
								registerTags[tag].externalEvents[j].events[k].func();
							}
						}
					}
				}
			}
		},
		addMethod = function(name, func){
			api[name] = func;
			return this;
		}
		api = {
			register: function(tag, config){
				registerTags[tag] = config || {};
				return this;
			},
			createElement: createElement,
			addEvent: addEvent,
			removeEvent: removeEvent,
			callOnCreate: callOnCreate,
			addMethod: addMethod
		};
	addEvent(window, 'load', onload);
	return api;
})(window, document);
