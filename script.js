FooHTML
	.addMethod('setStyle', function(obj, property, value){
		obj.style[property] = value;
	})
	.addMethod('setStyles', function(obj, styles){
		var i = styles.length;
		while(i--){
			this.setStyle(obj, styles[i][0], styles[i][1]);
		}
	})
;
