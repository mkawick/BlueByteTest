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
	this.score = 0;
	this.mines = 10;

	this.movementStates = 
	{
		none			:0, 
		walking			:1
	};
	this.currentMovementState = this.movementStates.none;
	
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
		var mines = document.getElementById( "blocks" );
		if( mines )
		{
			mines.innerHTML = "mines: " + this.mines;
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
			this.mines ++;
		}
	};
	
	this.placeMine = function( mineField )
	{
		if( this.mines === 0 )
			return;
		
		if( mineField.isMinePresent( this.position ) == true )
			return;
			
		this.mines--;
		mineField.placeMine( this.position );
	};
	
	this.moveTo = function( gridPosition )
	{
		this.finalDestination = gridPosition;
		this.currentMovementState = this.movementStates.walking;
	};
};