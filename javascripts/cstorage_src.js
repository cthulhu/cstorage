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
    policyUrl: null,
  	api: null,
    loaded: false,
    element: "FlashCookies",
    onload: function(){},
  
	configure: function(settings) 
    {
        $extend(this, settings);
        this.onLogEntry( "@configure start" );
        div = document.createElement('div');
        div.id = this.element;
        document.getElementsByTagName('body')[0].appendChild( div );
        swfobject.embedSWF(
            "/swfs/FlashCookies.swf?" + Math.random().toString(),
            this.element, "1", "1", "9.0.0",
            null,
            { storage_name:"AppStore" },
            { allowScriptAccess: "always", wmode:"opaque" },{},
            this.flash_loaded
        );
        this.onLogEntry( "@configure stop" );
	},
    // private flash_loaded
    flash_loaded: function( e ){
        if( !e.success ){
            CStorage.loaded = true;
            CStorage.onload();
        }
    },
	
	GetJsCookies: function( c_name ){
      try
      {
          if( document.cookie.length > 0 )
          {
              c_start = document.cookie.indexOf( c_name + "=" );
              if( c_start != -1 )
              {
                  c_start = c_start + c_name.length + 1;
                  c_end = document.cookie.indexOf( ";", c_start );
                  if( c_end==-1) c_end = document.cookie.length;
                  return unescape( document.cookie.substring( c_start,c_end ) );
              }
          }
      }catch(err){}
      return "";
	},
	
	Get: function( key ) {
	  this.onLogEntry( "@Get " + key );
        var value = {};
        flash_cookies = this.dispatch("Get", key );
        this.onLogEntry( "Flash " + flash_cookies );
        js_cookies = this.GetJsCookies( key );
        this.onLogEntry( "Js " + js_cookies );
	  return { "flash": flash_cookies, "js": js_cookies } ;
	},
  
  GetRandomKey: function( size ) {
    var symbols = ["a","b","c","d","e","f","0","1","2","3",
      "4","5","6","7","8","9"];
    var str = "";
    for( i = 0; i < size ; i++ ){
      str += symbols[ parseInt(Math.random() * (symbols.length - 1)) ];
    }
    return str;
  },
  
	SetJsCookies: function( c_name, value, expire_minutes ){
      var exdate = new Date();
      exdate.setDate( exdate.getDate() + expire_minutes );
      document.cookie = c_name + "=" + escape( value ) 
        + ( ( expire_minutes == null ) ? 
        "" : ";expires=" + exdate.toGMTString( ) );
	  
	},
	Put: function( key, value, expire_minutes ) {
	  this.SetJsCookies( key, value["js"], expire_minutes );
		this.dispatch("Put", key, value["flash"], expire_minutes );
	},
	
	//private
	onLoad: function() {
  	  this.onLogEntry( "@onLoad " );
      this.api = document.getElementById( this.element );
	  this.update();
      this.loaded = true;
      this.onload();
      
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

