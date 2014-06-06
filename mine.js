// mine.js

function Mine( x, y )
{
	this.position = new Point( x, y );
	this.lifetimeLength = 3000;
	this.flashTimeLength = 2000;
	this.beginLifeTime = new Date().getTime();
	this.isFlashing = false;
	this.shoudShow = true;
	this.isAlive = true;
	this.doesExpire = true;
	
	this.draw = function( context, grid, color )
	{
		if( this.isAlive == false )
			return;
			
		if( this.doesExpire == true && this.isFlashing == true )
		{
			if( this.shouldShow == 1 )
				grid.drawMyPosition( context, this.position, color );
		}
		else
		{
			grid.drawMyPosition( context, this.position, color );
		}
	};
	this.update = function( currentTime )
	{
		if( this.doesExpire == true )
		{
			if( currentTime - this.beginLifeTime > this.lifetimeLength )
			{
				this.isFlashing = true;
			}
			if( currentTime - this.beginLifeTime > this.lifetimeLength + this.flashTimeLength )
			{
				this.isAlive = false;
			}
			if( this.isFlashing == true && this.isAlive == true )
			{
				var numFlashesBeforeDeath = 10;
				var lengthOfFlash = this.flashTimeLength / numFlashesBeforeDeath;
				this.shouldShow = parseInt( ( ( currentTime - this.beginLifeTime ) - this.lifetimeLength ) / lengthOfFlash ) % 2;
			}
		}
	};
};

function MineField()
{
	this.mineList = [];
	
	this.draw = function( context, grid )
	{
		var color = "gold";
		var num = this.mineList.length;
		for( var i=0; i<num; i++ )
		{
			this.mineList[i].draw( context, grid, color );
		}
	};
	
	this.update = function()
	{
		var currentTime = new Date().getTime();
		// slicing might remove an element from the middle. Take the safe approach.
		for( var i=this.mineList.length-1; i>=0; i-- )
		{
			var mine = this.mineList[i];
			if( mine.isAlive == false )
				this.mineList.splice( i, 1 );
			else
				mine.update( currentTime );
		}
	};
	
	this.addMine = function( x, y )
	{
		this.mineList.push( new Mine( x, y ) );
	};
	
	this.isMinePresent = function( pt ) 
	{
		var num = this.mineList.length;
		for( var i=0; i<num; i++ )
		{
			var minePoint = this.mineList[i].position;
			if( minePoint.x == pt.x && 
				minePoint.y == pt.y )
			return true;
		}
		return false;
	};
	
	this.placeMine = function( pt )
	{
		this.mineList.push( new Mine( pt.x, pt.y ) );
	};
};