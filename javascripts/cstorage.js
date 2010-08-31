//simple inheritance helper
function extend(superclass, constructor_extend, prototype) {
	var res = function () {
		superclass.apply(this);
		constructor_extend.apply(this, arguments);
	};
	var withoutcon = function () {};
	withoutcon.prototype = superclass.prototype;
	res.prototype = new withoutcon();
	for (var k in prototype) {
		res.prototype[k] = prototype[k];
	}
	return res;
}

//used to add methods and properties to objects
function $extend(target, source){
	for (var key in (source || {})) {
		target[key] = source[key];
	}
	return target;
};


var Dispatcher = function() { 
	this.listeners = {};
}

Dispatcher.prototype = {

	addListener: function(name, fn, scope) {
		if(!this.listeners[name]) {
			this.listeners[name] = [];
		}
		this.listeners[name].push({
			fn: fn,
			scope: scope || window
		});
	},
	
	on: function(name, fn, scope) {
		this.addListener(name, fn, scope);
	},
	
	fireEvent: function() {
		var args = [].slice.call(arguments);
		var name = args.shift();
		var calls = this.listeners[name];
		if(calls) {
			for(var i = 0; i < calls.length;i++) {
				var c = calls[i];
				c.fn.apply(c.scope, args);
			}
		}
	}
	
};


var FlashInterface = extend(Dispatcher, function(){}, {
  
  buffer: [],
	logger: null,
	loglevel: 2,
	
  element: "FlashCookies",
  
	configure: function(settings) {
		$extend(this, settings);
	},
	
	Get: function( key ) {
		return this.dispatch("Get", key );
	},
	
	Put: function( key, value ) {
		this.dispatch("Put", key, value );
	},
	
	//private
	onLoad: function() {
		this.api = document.getElementById( this.element );
		this.update();
	},

	//private
	onLogEntry: function(msg) {
		if(this.logger && this.logger.log) {
			this.logger.log( msg );
		}
	},
	
	//private
	update: function() {
		if(this.logger) {
			this.dispatch("SetLogLevel", this.loglevel);
		}
		if(this.policyUrl) {
			this.dispatch("LoadPolicy", this.policyUrl);
		}
	},

	/// private
	dispatch: function() {
		if( this.api ) {
			var args = [].slice.call(arguments);
			if( this.logger && this.logger )
			this.onLogEntry( "@dispatch " + args );
			return this.api[args.shift()].apply(this.api, args);
		} else {
			this.buffer.push(arguments);
		}
	},

	//private
	flush: function() {
		while(this.buffer.length > 0) {
			this.dispatch.apply(this, this.buffer.shift());
		}
	}

});

var CStorage = new FlashInterface();

