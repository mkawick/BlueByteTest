// Struct.js

//--------------------------------------------------------------
//--------------------------------------------------------------

function Color()
{
	var _this = this;
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = undefined;
	
	if( arguments )
	{
		var a = arguments[0];
		if( Array.isArray( a ) )
		{
			_this.r = a[0];
			_this.g = a[1];
			_this.b = a[2];
			if( a[3] )
				_this.a = a[3];
		}
		else if( typeof a == 'object' )
		{
			this.r = a.r;
			this.g = a.g;
			this.b = a.b;
			this.a = a.a;
		}
		else if( arguments.length > 2 ) // simpler test than >=3
		{
			_this.r = arguments[0];
			_this.g = arguments[1];
			_this.b = arguments[2];
			if( arguments[3] )
				_this.a = arguments[3];
		}
		else if( arguments.length != 0 )// 0 is alright
		{
			throw new Error( "WTF");
		}
	}
};

//---------------------------------------------------

Color.prototype.set = function( _r, _g, _b, _a )
{
	if( typeof _r === 'number' )
	{
		this.r = _r;
		this.g = _g;
		this.b = _b;
		this.a = _a;
	}
	else if( (typeof _r == 'object') && (_r.r != undefined) )// treat like a color instance
	{
		this.r = _r.r;
		this.g = _r.g;
		this.b = _r.b;
		this.a = _r.a;
	}
};

//---------------------------------------------------

Color.prototype.toString = function()
{
	if( this.a == undefined )
	{
		_r = Number(this.r).toString(16); if( this.r < 16 ) _r = '0' + _r;
		_g = Number(this.g).toString(16); if( this.g < 16 ) _g = '0' + _g;
		_b = Number(this.b).toString(16); if( this.b < 16 ) _b = '0' + _b;
		var num = '#' + _r + _g + _b;
		return num;
	}
	else
	{
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	}
};

//---------------------------------------------------

Color.prototype.calculateLinearInterpolation = function( _1, _2, steps )
{
	var recip = 1 / steps;
	this.r = (_2.r - _1.r) * recip;
	this.g = (_2.g - _1.g) * recip;
	this.b = (_2.b - _1.b) * recip;
	if( _2.a && _1.a )
	{
		this.a = (_2.a - _1.a) * recip;
	}
};

//---------------------------------------------------

Color.prototype.add = function( _add )
{
	this.r += _add.r;
	this.g += _add.g;
	this.b += _add.b;
	if( _add.a )
	{
		if( this.a == undefined )
			this.a = _add.a;
		else
			this.a += _add.a;
	}
	
	if( this.r< 0 )
		this.r = 0;
	if( this.g< 0 )
		this.g = 0;
	if( this.b< 0 )
		this.b = 0;
	if( this.a< 0 )
		this.a = 0;
		
	if( this.r > 255 )
		this.r = 255;
	if( this.g > 255 )
		this.g = 255;
	if( this.b > 255 )
		this.b = 255;
	if( this.a > 255 )
		this.a = 255;
};

//---------------------------------------------------

Color.prototype.midColor = function( endColor, t )
{
	// todo, range check t
	var OneMinus = (1-t);
	var r = Math.floor( endColor.r * t + this.r * OneMinus );
	var g = Math.floor( endColor.g * t + this.g * OneMinus );
	var b = Math.floor( endColor.b * t + this.b * OneMinus );
	
	if( endColor.a )
	{
		var a = (endColor.a - this.a) * t;
		if( a < 0 )
			a = 255 + a;
	}
	if( r < 0 )
		r = 255 + r;
	if( g < 0 )
		g = 255 + g;
	if( b < 0 )
		b = 255 + b;
	
	return new Color( r, g, b, a );
};

//--------------------------------------------------------------------------------
// Point
//--------------------------------------------------------------------------------
function Point( _x, _y )
{
	var _this 		= this;
	this.x 		= typeof _x === 'object' ? _x.x: _x || 0;
	this.y 		= typeof _x === 'object' ? _x.y: _y || 0;
	
	//-----------------------------------------------------
};

//--------------------------------------------------------------

Point.prototype.set 		= function ( _x, _y ) 
{
	var a = arguments[0];
	if( Array.isArray( a ) )
	{
		this.x = a[0];
		this.y = a[1];
	}
	else if( typeof a === 'object' )
	{
		this.x = a.x;
		this.y = a.y;
	}
	else
	{
		this.x  = _x; 
		this.y  = _y; 
	}
};

//-----------------------------------------------------

Point.prototype.add 		= function ( _x, _y ) 
{ 
	if( typeof _x === 'object' )
	{
		this.x += _x.x; this.y += _x.y;
	}
	else
	{
		this.x += _x; this.y += _y; 
	}
};

//-----------------------------------------------------

Point.prototype.scale 		= function ( _x, _y ) 
{ 
	this.x *= _x; 
	this.y *= _y ? _y: _x; 
}

//-----------------------------------------------------

Point.prototype.distanceSquared = function ( _x, _y ) 
{ 
	if( typeof _x === 'object' )// pass in a single point
	{
		var distX = ( _x.x - this.x ); 
		var distY = ( _x.y - this.y ); 
		return distX*distX + distY*distY;
	}
	else
	{
		var distX = ( _x - this.x ); 
		var distY = ( _y - this.y ); 
		return distX*distX + distY*distY;
	}
};

//--------------------------------------------------------------------------------
// Rect
//--------------------------------------------------------------------------------
function Rect( x, y, width, height )
{
	var _this 		= this;
	_this.x 		= x;
	_this.y 		= y;
	_this.width 	= width;
	_this.height	= height;
	
	this.Left 		= function( ) { return _this.x; }
	this.Right 		= function( ) { return _this.x + _this.width; }
	this.Top 		= function( ) { return _this.y; }
	this.Bottom 	= function( ) { return _this.y + _this.height; }

	this.X			= function( ) { return _this.x; }
	this.Y			= function( ) { return _this.y; }
	this.Width		= function( ) { return _this.width; }
	this.Height		= function( ) { return _this.height; }
};

//--------------------------------------------------------------------------------
// Line
//--------------------------------------------------------------------------------

function Line()
{
	var _this = this;
	this.color = new Color();
	this.point = new Array();
	this.point[0] = new Point();
	this.point[1] = new Point();
	this.left = function() {return this.point[0].x;}
	this.right = function() {return this.point[1].x;}
	this.top = function() {return this.point[0].y;}
	this.bottom = function() {return this.point[1].y;}
};
	
//--------------------------------------------------------------

Line.prototype.set = function( x1, y1, x2, y2 )
{
	if( y1 > y2 )// ordered only. Pairing is immaterial in a rect.
	{
		var y = y1;
		y1 = y2;
		y2 = y;
	}
	if( x1 > x2 )
	{
		var x = x1;
		x1 = x2;
		x2 = x;
	}
	this.point[0].x = x1;
	this.point[0].y = y1;

	this.point[1].x = x2;
	this.point[1].y = y2;
};
	
//--------------------------------------------------------------

Line.prototype.getMagnitude = function()
{
	var diffx = this.point[1].x - this.point[0].x;
	var diffy = this.point[1].y - this.point[0].y;
	return Math.sqrt( diffx * diffx + diffy * diffy );
};
	
//--------------------------------------------------------------

Line.prototype.update = function(){};// ntd

Line.prototype.center = function()
{
	return {x: (this.point[0].x + this.point[1].x) *0.5,
			y: (this.point[0].y + this.point[1].y) *0.5};
};
//--------------------------------------------------------------

Line.prototype.draw = function( context, offsetX, offsetY )
{
	var point = this.point;
	var left = point[0].x - offsetX;
	var top = point[0].y - offsetY;
	var right = point[1].x - offsetX;
	var bottom = point[1].y - offsetY;
	context.strokeStyle = this.color.toString();
	context.lineWidth = 1.5;
	context.lineCap = "square";
	
	context.beginPath();
	context.moveTo( left, top );
	context.lineTo( right, top );
	if( bottom != top )
	{
		context.lineTo( right, bottom );
		context.lineTo( left, bottom );
		context.lineTo( left, top );
	}
	context.closePath();
	context.stroke();
};
	
//--------------------------------------------------------------

Line.prototype.intersects = function( x1, y1, x2, y2 )
{
	var point = this.point;
	if( ( x2 < point[0].x &&  x1 < point[0].x ) || (x2 > point[1].x && x1 > point[1].x ) )
		return null;
	if( ( y2 < point[0].y &&  y1 < point[0].y ) || (y2 > point[1].y && y1 > point[1].y ) )
		return null;
		
	if( x2 == x1 )// we can still intersect vertically.
	{
		if( y1 == y2 )
			return null;
		
		if( y1 > y2 )
		{
			var y = y1;
			y1 = y2;
			y2 = y;
			
			var x = x1;
			x1 = x2;
			x2 = x;
		}
		if( y1 < point[0].y && y2 > point[0].y )
		{
			return {x: x1, y: point[0].y};
		}
		if( y1 < point[1].y && y2 > point[1].y )
		{
			return {x: x1, y: point[1].y};
		}
	}
	else if( y2 == y1 )// intersect horizontally
	{
		if( x1 > x2 )
		{
			var x = x1;
			x1 = x2;
			x2 = x;
			
			var y = y1;
			y1 = y2;
			y2 = y;
		}
		if( x1 < point[0].x && x2 > point[0].x )
		{
			return {x: point[0].x, y: y2};
		}
		if( x1 < point[1].x && x2 > point[1].x )
		{
			return {x: point[1].x, y: y2};
		}
	}
	else
	{
		/*if( y2 < y1 )
		{
			// swap
			var y = y1;
			y1 = y2; 
			y2 = y;
			var x = x1;
			x1 = x2;
			x2 = x;
		}*/
		var ratio = (y2 - y1) / (x2 - x1);
		// assume that we intersect the left
		var newY = (point[0].x - x1) * ratio + y1;
		if( newY >= point[0].y && newY < point[1].y )
		{
			return {x: point[0].x, y: newY};
		}
		// now, assume that we intersect the right
		newY = (x2 - point[1].x) * ratio + y2;
		if( newY >= point[0].y && newY < point[1].y )
		{
			return {x: point[1].x, y: newY};
		}
		// try the top
		var newX = (point[0].y - y1) * ratio + x1;
		if( newX >= point[0].x && newX < point[1].x )
		{
			return {x: newX, y: point[0].y};
		}
		// now the bottom
		newX = (y2 - point[0].y) * ratio + x2;
		if( newX >= point[0].x && newX < point[1].x )
		{
			return {x: newX, y: point[1].y};
		}
	}
	return null;		
};
	
//--------------------------------------------------------------

Line.prototype.bordersOrIntersects = function( line )
{
	var borderRange = 2;
	var point = this.point;
	var lp = line.point;
	if( lp[0].x > ( point[1].x + borderRange ) || // right
		lp[1].x < ( point[0].x - borderRange ) )// left
		return false;
		
	if( lp[0].y > ( point[1].y + borderRange ) || // bottom
		lp[1].y < ( point[0].y - borderRange ) )// top
		return false;
		
	return true;
};

//--------------------------------------------------------------
//--------------------------------------------------------------