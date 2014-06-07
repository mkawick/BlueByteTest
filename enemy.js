// enemy.js

function Enemy( x, y )
{
	this.position = new Point( x, y );

	this.flashTimeLength = 2000;
	this.beginLifeTime = new Date().getTime();
	this.isFlashing = false;
	this.shoudShow = true;
	this.isAlive = true;
	this.entityStates = 
	{
		none			:0, 
		walking			:1, 
		resting			:2, 
		chasing			:3, 
		decidingWhatToDo:21,
		dying			:25,
		dead			: 30
	};
	this.timeAtLastStateChange = this.beginLifeTime;
	this.timeUntilNextStateChange = 8000;// 8 secs before we start moving
	this.state = this.entityStates.none;
	this.frameCounterBeforeAction = 0; // preventing runaway actions... it was too fast withoout this
	this.frameLock = 6;
	this.destination;
	
	this.draw = function( context, grid, aliveColor, dyingColor )
	{
		if( this.isAlive == false )
			return;
			
		if( this.isFlashing == true )
		{
			if( this.shouldShow == 1 )
				grid.drawMyPosition( context, this.position, aliveColor );
			else
				grid.drawMyPosition( context, this.position, dyingColor );
		}
		else
		{
			grid.drawMyPosition( context, this.position, aliveColor );
		}
	};
	function findAGoodPlaceToWalk( pt, grid, wallManager )
	{
		var dist = parseInt( getRandomArbitrary( 2, 6 ) );
		var randDirection = parseInt( getRandomArbitrary( 0, 7 ) );
		var directionsToTest = // moving in a circle
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
		var testPt = {x:(dist*directionsToTest[randDirection].x) + pt.x, y:(dist*directionsToTest[randDirection].y)+pt.y};
		if( grid.isValidLocation( testPt ) == true && 
			wallManager.isWallPresent( testPt ) == false )
			return testPt;
			
		// sort of a worst case here
		var num = directionsToTest.length;
		for( var i=0; i<num; i++ )
		{
			var testPt = {x:(dist*directionsToTest[i].x) + pt.x, y:(dist*directionsToTest[i].y)+pt.y};
			if( grid.isValidLocation( testPt ) == true && 
				wallManager.isWallPresent( testPt ) == false )
			return testPt;
		}
		return undefined;
	};
	this.update = function( player, wallManager, blockManager, grid, currentTime )
	{
		if( this.isAlive == false )
			return;
			
		if( ++this.frameCounterBeforeAction < this.frameLock )
			return;
		this.frameCounterBeforeAction = 0;
			
		// at any time, the player may walk past. 
		var distanceToPursuePlayer = 5;
		var testDistSquared = distanceToPursuePlayer*distanceToPursuePlayer;
		if( distSquared( this.position, player.position ) < testDistSquared )
		{
			this.state = this.entityStates.chasing;
			this.timeUntilNextStateChange = 5000; // track the player for a minimum of 5 seconds.
		}
		else
		{
			if( currentTime - this.timeAtLastStateChange  > this.timeUntilNextStateChange )
			{
				if( this.state == this.entityStates.none )
				{
					var pt = findAGoodPlaceToWalk( this.position, grid, wallManager );
					if( pt !== undefined ) // we'll do nothing for now... we can wait another cycle
					{
						this.state = this.entityStates.walking;
						this.timeUntilNextStateChange = 4000;
						this.destination = pt;
					}
					else 
						this.destination = undefined;
				}
				else if( this.state == this.entityStates.chasing )
				{
					this.state = this.entityStates.none;
					this.timeUntilNextStateChange = 5000;
				}
				else if( this.state == this.entityStates.walking )
				{
					this.state = this.entityStates.none;
					this.timeUntilNextStateChange = 5000;
				}
			}
		}
		
		switch( this.state )
		{
		case this.entityStates.chasing:
			{
				var offset = getNextValidMovementLocation( wallManager, grid, this.position, player.position );
				if( offset !== undefined )
				{
					this.move( offset.x, offset.y, wallManager, blockManager );
				}
			}
			break;
		case this.entityStates.walking:
			{
				var offset = getNextValidMovementLocation( wallManager, grid, this.position, this.destination );
				if( offset !== undefined )
				{
					this.move( offset.x, offset.y, wallManager, blockManager );
				}
			}
			break;
		}
	};
	this.move = function( x, y, wallManager, blockManager )
	{
		var newX = this.position.x + x;
		var newY = this.position.y + y;
		if( wallManager.isWallPresent( {x:newX, y:newY } ) == true )
			return;
		
		this.position.x = newX;
		this.position.y = newY;
		
		if( blockManager.isBlockPresent( this.position ) == true )
		{
			blockManager.removeBlock( this.position );
		}
	};
};

function EnemyManager( width, height, minDistance, walls, numToPlace )
{
	enemies = [];
	
	this.draw = function( context, grid )
	{
		var aliveColor = "OrangeRed";
		var dyingColor = "SaddleBrown";
		var num = enemies.length;
		for( var i=0; i<num; i++ )
		{
			var enemy = enemies[i];
			enemy.draw( context, grid, aliveColor, dyingColor )
		}
	};
	
	this.update = function( wallManager, blockManager, player, grid, currentTime )
	{
		var num = enemies.length;
		for( var i=0; i<num; i++ )
		{
			var enemy = enemies[i];
			enemy.update( player, wallManager, blockManager, grid, currentTime )
			//grid.drawMyPosition( context, pt, color );
		}
	};

	this.isEnemyPresent = function( pt ) 
	{
		var num = enemies.length;
		for( var i=0; i<num; i++ )
		{
			var wall = enemies[i];
			if( wall.x == pt.x && 
				wall.y == pt.y )
			return true;
		}
		return false;
	};
	
	findMinDistance = function( pt, listOfPoints )
	{
		if( listOfPoints.length == 0 )
			return 0;// 
		var minDistance = distSquared( pt, listOfPoints[0] );
		var num = listOfPoints.length;
		for( var i=1; i<num; i++ )
		{
			var distance = distSquared( pt, listOfPoints[i] );
			if( distance < minDistance )
				minDistance = distance;
		}
		return minDistance;
	}
	
	this.placeWall = function( pt )
	{
		enemies.push( new Point( pt.x, pt.y ) );
	};
	
	this.canPlaceWall = function( pt )
	{
	};
	
	// because there is a fair amount of work to do here, I added the complexity of a c'tor
	// most other classes do not need this.
	var __construct = function() 
	{
		if( numToPlace > 20 ) /// error condition?
		{
			alert( "bad setup for enemies" );
		}
		
		var trackingArray;
		
		if( walls == undefined )
			trackingArray = [];
		else
			trackingArray = walls.getWalls();
			
		var distSquared = minDistance * minDistance;
		var calculatedDist;// scope
		console.log( "EnemyManager init " );
			
		//enemies.push( new Enemy( 20, 12 ) );// storage
		for( var i=0; i< numToPlace; i++ )
		{
			var x;
			var y;
			var count = 0;
			do{
				x = parseInt( getRandomArbitrary( 0, width ) );
				y = parseInt( getRandomArbitrary( 0, height ) );
				calculatedDist = findMinDistance( {x:x, y:y}, trackingArray );
				
				count++;
			} while( calculatedDist < distSquared && count < numToPlace );// I am bounding this in case we run into a runaway condition
				
			pt = new Point( x, y );
			trackingArray.push( pt );
			enemies.push( new Enemy( x, y ) );// storage
		}
		/*if( calculatedDist < 0 ) // debugging ounly
				{
					calculatedDist = findMinDistance( {x:x, y:y}, trackingArray );
				}*/
				//console.log( count + ":" + calculatedDist);
		console.log( "EnemyManager end init " );
		
	}();
	
};