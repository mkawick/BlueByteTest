// player.js

function Player()
{
	this.startPosition = new Point(1,1);
	this.position = this.startPosition;
	this.desiredNewPosition = this.position;
	this.finalDestination;
	
	this.frameCounterBeforeAction = 0; // preventing runaway actions... it was too fast withoout this
	this.frameLock = 4;
	
	this.health = 3;
	this.isDead = false;
	this.score = 100;
	this.blocks = 10;

	this.movementStates = 
	{
		none			:0, 
		walking			:1
	};
	this.currentMovementState = this.movementStates.none;
/*	this.getNextValidMovementLocation = function( wallManager, grid, currentPosition, finalDestination )
	{
		var positionsToTest = // moving in a circle
		[
			{x:-1, y:-1},
			{x: 0, y:-1},
			{x: 1, y:-1},
			{x: 1, y: 0},
			{x: 1, y: 1},
			{x: 0, y: 1},
			{x:-1, y: 1},
			{x:-1, y: 0}
		];
		
		// I recognize that this is currently unnecessary.. hill climbing is good enough.
		// But if we want the to be smarter in the future, then keeping the weights helps with better A*
		var weights = [-1, -1, -1, -1, -1, -1, -1, -1];
		var smallestValueIndex = -1;
		var smallestValue = 1000000;
		var num = positionsToTest.length;
		for( var i=0; i< num; i++ )
		{
			var pos = { x:currentPosition.x+positionsToTest[i].x, y:currentPosition.y+positionsToTest[i].y };
			if( grid.isValidLocation( pos ) == false )
			{
				continue;
			}
			if( wallManager.isWallPresent( pos ) == true )
			{
				continue;
			}
			weights[i] = distSquared( pos, finalDestination );
			if( weights[i] < smallestValue )
			{
				smallestValue = weights[i];
				smallestValueIndex = i;
			}
		}
		if( smallestValueIndex == -1 )
			return undefined;
		return positionsToTest[ smallestValueIndex ];
	};*/
	
	this.draw = function( context, grid )
	{
		var lives = document.getElementById( "lives" );
		if( lives )
		{
			lives.innerHTML = "lives: " + this.health;
		}
		var score = document.getElementById( "score" );
		if( score )
		{
			score.innerHTML = "score: " + this.score;
		}
		var blocks = document.getElementById( "blocks" );
		if( blocks )
		{
			blocks.innerHTML = "blocks: " + this.blocks;
		}
		
		grid.drawMyPosition( context, this.position, "#0f0" );
	};
	
	this.update = function( grid, enemyManager, wallManager, blockManager )
	{
		if( ++this.frameCounterBeforeAction < this.frameLock )
			return;
		this.frameCounterBeforeAction = 0;

		if( this.currentMovementState == this.movementStates.walking )
		{
			var isStuck = false;
			
			var offset = getNextValidMovementLocation( wallManager, grid, this.position, this.finalDestination );
			if( offset == undefined )
			{
				isStuck = true;
			}
			else
			{
				this.move( offset.x, offset.y, grid, wallManager, blockManager );
			}
			
			if( isStuck == true ||
				( this.position.x == this.finalDestination.x && this.position.y == this.finalDestination.y ) )
			{
				this.currentMovementState = this.movementStates.none;
				this.finalDestination = undefined;
			}
		}
	};
	
	this.move = function( x, y, grid, wallManager, blockManager )
	{
		var newX = this.position.x + x;
		var newY = this.position.y + y;
		if( wallManager.isWallPresent( {x:newX, y:newY } ) == true )
			return;
		
		this.position.x = newX;
		this.position.y = newY;
		grid.keepPlayerInBounds( this );
		
		if( blockManager.isBlockPresent( this.position ) == true )
		{
			blockManager.removeBlock( this.position );
			this.blocks ++;
		}
	};
	
	this.placeMine = function( mineField )
	{
		if( this.blocks === 0 )
			return;
		this.blocks--;
		
		if( mineField.isMinePresent( this.position ) == true )
			return;
		mineField.placeMine( this.position );
	};
	
	this.moveTo = function( gridPosition )
	{
		this.finalDestination = gridPosition;
		this.currentMovementState = this.movementStates.walking;
	};
};