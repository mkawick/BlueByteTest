//--------------------------------------------------------------------------------
// Log
//--------------------------------------------------------------------------------

function ProLogger()
{
	var eLoggingLevel = {basic:0, comment:1, warning:2, error:3, verbose:4 };
	var gateCategories = new Object();
	var logLevel = eLoggingLevel.basic;
	var isGateCategoriesSet = false;
	
	/*var logHistory = new Array();
	function dump_log()
	{
		var message = '';
		
		for (var i = 0; i < logHistory.length; i++)
			message += logHistory[i] + '\n';
				
		alert(message);
		
		_log_timeout = null;
		delete logHistory;
		logHistory = [];
	}*/
	//----------------------------------------------------------
	
	/** set the maximum level for logging
	* @param {int} level
	*/
	function _setLogLevel( level )
	{
		if( level < eLoggingLevel.basic || level > eLoggingLevel.verbose )
		{
			return;
		}
		logLevel = level;
	};
	/** return the maximum level for logging
	*/
	function _getLogingLevel()
	{
		return logLevel;
	};
	/** add strings that permit logging. If the string isn't stored, you cannot log.
	* @param {string, string array, object} category: which categories are permitted for logging
	*/
	function _addCategoryGate( gateName )
	{
		if( typeof gateName == 'string' )
		{
			gateCategories[ gateName ] = gateName;
			isGateCategoriesSet = true;
		}
		else if( typeof gateName == 'object' || typeof gateName == 'array' )
		{
			for( var j in gateName )
			{
				var cat = gateName[j];
				gateCategories[ cat ] = cat;
			}
			isGateCategoriesSet = true;
		}
	};
	/** removes the specified gate
	* @param
	*/
	function _removeCategoryGate( gateName )
	{
		if( typeof gateName == 'string' )
		{
			gateCategories[ gateName ] = undefined;
		}
		var empty = true, fld;
		for( var i in gateCategories) 
		{
			empty = false;
			break;
		}
		if( empty === true )
		{
			isGateCategoriesSet = false;
		}
	};
	/** normal clear function
	*/
	function _clearAllGates()
	{
		for( var i in gateCategories) 
		{
			gateCategories[i] = undefined;
		}
		isGateCategoriesSet = false;
	};
	/**
	* @param {string} comment: anything that you want to say
	* @param {int} level:  the log level
	* @param {string, string array} category: which categories this qualifies for logging
	*/
	function _log( comment, level, category )
	{
		if( logLevel < level )
		{
			return;
		}
		var matchingCategory = undefined;
		if( isGateCategoriesSet )
		{
			if( ! category )
			{
				return;
			}
			else if( typeof category == 'string' )
			{ 
				if( gateCategories[ category ] == undefined )
				{
					return;
				}
				for( var i in gateCategories) 
				{
					if( category == gateCategories[i] )
					{
						matchingCategory = gateCategories[i];
						break;
					}
				}
			}
			else if( typeof category == 'object' || typeof category == 'array')
			{
				var found = false;
				for( var j in category )
				{
					var cat = category [j];
					for( var i in gateCategories) 
					{
						if( cat == gateCategories[i] )
						{
							matchingCategory = gateCategories[i];
							break;
						}
					}
					if( matchingCategory )
						break;
				}
				if( !matchingCategory )
				{
					return;
				}
			}
		}
		else
			matchingCategory = category;

		if( matchingCategory )
			console.log( '[' + matchingCategory + '] - ', comment, ': ' + new Date() );
		else
			console.log( comment, ': ' + new Date() );
	};
	
	/**
	* @interface
	*/
	this.loggingLevel = eLoggingLevel;
	this.setLogLevel = _setLogLevel;
	this.getLogingLevel = _getLogingLevel;
	this.addCategoryGate = _addCategoryGate;
	this.removeCategoryGate = _removeCategoryGate;
	this.clearAllGates = _clearAllGates;
	this.log = _log;
}
//--------------------------------------------------------------------------------
// clone
//--------------------------------------------------------------------------------

function clone(what) 
{
	for (i in what) 
	{
		if (typeof what[i] == 'object') 
		{
			this[i] = new clone(what[i]);
		}
		else
		{
			this[i] = what[i];
		}
	}
};

//--------------------------------------------------------------------------------
// Rand function override
//--------------------------------------------------------------------------------
Math.rand = function( lower,upper )// add the rand function to the Math library
{
	return Math.floor((Math.random() * (upper-lower+1))+lower);
};
//--------------------------------------------------------------------------------
// Find max in an array
//--------------------------------------------------------------------------------
Array.max = function( array )
{
    return Math.max.apply( Math, array );
};
//--------------------------------------------------------------------------------
// find min in an array
//--------------------------------------------------------------------------------
Array.min = function( array )
{
    return Math.min.apply( Math, array );
};

//--------------------------------------------------------------------------------
// calculate dist
//--------------------------------------------------------------------------------
dist = function( pt1, pt2 )
{
	var distX = pt2.x-pt1.x;
	
	var distY = pt2.y-pt1.y;
	
    return Math.sqrt( distX*distX + distY*distY );
};
//--------------------------------------------------------------------------------
// calculate dist^2
//--------------------------------------------------------------------------------
distSquared = function( pt1, pt2 )
{
	var distX = pt2.x-pt1.x;
	
	var distY = pt2.y-pt1.y;
	
    return ( distX*distX + distY*distY );
};

//--------------------------------------------------------------------------------
// uuid generator
//--------------------------------------------------------------------------------

function uuid()
{
   var chars = '0123456789abcdef'.split('');

   var uuid = [], rnd = Math.random, r;
   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
   uuid[14] = '4'; // version 4

   for (var i = 0; i < 36; i++)
   {
      if (!uuid[i])
      {
         r = 0 | rnd()*16;

         uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
      }
   }

   return uuid.join('');
};

//--------------------------------------------------------------------------------
// randomString
// randomString() - some string of random length from 4-62
// randomString(n) - some string of random length n
//--------------------------------------------------------------------------------

function randomString(length) 
{
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    
    if (! length) 
    {
        length = Math.floor( Math.random() * (chars.length-4) )+4;
    }
    
    var str = '';
    for (var i = 0; i < length; i++) 
    {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
};

function randomTextString( len ) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	if( len )
	{
		string_length = len;
	}
	var charsLen = chars.length;
	// don't start the string with a number
	var rnum = 10 + Math.floor( Math.random() * (charsLen-10) );
	var randomstring = chars[ rnum ];
	
	for (var i=1; i<string_length; i++)
	{
		var rnum = Math.floor( Math.random() * charsLen );
		randomstring += chars[ rnum ];
	}
	return randomstring;
}

// from: http://jsfromhell.com/math/is-point-in-poly
function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}

function lcm(o){// least common multiple
    for(var i, j, n, d, r = 1; (n = o.pop()) != undefined;)
        while(n > 1){
            if(n % 2){
                for (i = 3, j = Math.floor(Math.sqrt(n)); i <= j && n % i; i += 2);
                d = i <= j ? i : n;
            }
            else
                d = 2;
            for(n /= d, r *= d, i = o.length; i; !(o[--i] % d) && (o[i] /= d) == 1 && o.splice(i, 1));
        }
    return r;
};

function gcd(o){// greatest common divisor
    if(!o.length)
        return 0;
    for(var r, a, i = o.length - 1, b = o[i]; i;)
        for(a = o[--i]; r = a % b; a = b, b = r);
    return b;
};

function str2num( mystr ) {
	mystr = mystr.toUpperCase();
	var conv = [];
	var l = mystr.length;
	for (var i=0; i<l; i ++ ){
		conv[i] = mystr.charCodeAt(i)-65;
	}
	return conv;
}

//--------------------------------------------------------------------------------
// supporting inheritance
//--------------------------------------------------------------------------------
/*function extend( subClass, superClass )
{
	var f = function() {};
	subClass.prototype = superClass.prototype;
	subClass.prototype = new f();
	subClass.uber = superClass.prototype;
	subClass.prototype.constructor = subClass;
	//subClass.prototype = superClass.prototype;
};

function extend2( child, parent )
{
	var toStr = Object.prototype.toString;
	var astr = "[object Array]";
	
	child = child || {};
	for( var i in parent )
	{
		if( parent.hasOwnProperty(i) )
		{
			if( typeof( parent[i] === 'object' )
			{
				if( toStr.call( parent[i] ) === astr )
					child[i] = [] ;
				else
					child[i] = {};
				extend2( child[i], parent[i] );
			}
			else
			{
				child[i] = parent[i];
			}
		}
	}
	return child;
}; */
/*
Function.prototype.inheritsFrom = function()
{
	for (var i in arguments) 
	{
		if (arguments[i].constructor === Function) 
		{
			// Normal Inheritance
			this.prototype = new arguments[i];
			this.prototype.constructor = this;
			this.prototype.parent = this.prototype;
		} 
		else 
		{
			// Pure Virtual Inheritance
			this.prototype = arguments[i];
			this.prototype.constructor = this;
			this.prototype.parent = this.prototype;
		}
	}

	return this;
};*/
Function.prototype.inheritsFrom = function( parentClassOrObject )
	{ 
		if ( parentClassOrObject.constructor == Function ) 
		{ 
			//Normal Inheritance 
			this.prototype = new parentClassOrObject;  //Normal Inheritance 
			this.prototype.constructor = this;
			this.prototype.parent = parentClassOrObject.prototype;
		} 
		else 
		{ 
			//Pure Virtual Inheritance 
			this.prototype = parentClassOrObject;
			this.prototype.constructor = this;
			this.prototype.parent = parentClassOrObject;
		} 
		return this;
	};

Function.prototype.instanceOf = function(object, constructorFunction)
{
	while (object != null)
	{
		if (object == constructorFunction.prototype)
		{
			return true;
		}
		object = object.__proto__;
	}
	return false;
};
// example code follows
/*
function Person ()
{
this.name;
}
//*********************************************************
Person.prototype.
setName = function (name)
{
this.name = name;
};
Person.prototype.
getName = function ()
{
return this.name;a
};


Person.prototype.private =
{
	privateFn: function ()
	{
	return this.name;
	},
	foo: function()
	{
	this.name = null;
	}
};

//*********************************************************

function Truckdriver ()
{
Person.call (this);

this.trucks;
}

Truckdriver.prototype.getTrucks = function()
{
};

extend (Truckdriver, Person);
*/

function setupBrowserFrameRateMaximum( callback )
{
	if( window.requestAnimFrame )
		return;
	
	window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
	
	(function loop()
	{
		callback();
		requestAnimFrame( loop, undefined );
	} )(callback);
};
