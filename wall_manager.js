// wall_manager.js

function WallManager( width, height, minDistance, avoidedLocations, numToPlace )
{
	walls = [];
	
	this.draw = function( context, grid )
	{
		var color = "DodgerBlue";
		var num = walls.length;
		for( var i=0; i<num; i++ )
		{
			var pt = walls[i];
			grid.drawMyPosition( context, pt, color );
		}
	};
	
	this.update = function()
	{
	};

	this.isWallPresent = function( pt ) 
	{
		var num = walls.length;
		for( var i=0; i<num; i++ )
		{
			var wall = walls[i];
			if( wall.x == pt.x && 
				wall.y == pt.y )
			return true;
		}
		return false;
	};
	
	this.getWalls = function() { return walls.slice(0);}
	
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
		walls.push( new Point( pt.x, pt.y ) );
	};
	
	this.canPlaceWall = function( pt )
	{
	};
	
	// because there is a fair amount of work to do here, I added the complexity of a c'tor
	// most other classes do not need this.
	var __construct = function() 
	{
       if( numToPlace > 40 ) /// error condition?
		{
			alert( "bad setup for walls" );
		}
		
		var trackingArray;
		
		if( avoidedLocations == undefined )
			trackingArray = [];
		else
			trackingArray = avoidedLocations.slice(0);
			
		var distSquared = minDistance * minDistance;
		var calculatedDist;// scope
		console.log( "WallManager init " );
			
		for( var i=0; i< numToPlace; i++ )
		{
			var x;
			var y;
			var count = 0;
			do{
				x = parseInt( getRandomArbitrary( 0, width ) );
				y = parseInt( getRandomArbitrary( 0, height ) );
				calculatedDist = findMinDistance( {x:x, y:y}, trackingArray );
				/*if( calculatedDist < 0 ) // debugging ounly
				{
					calculatedDist = findMinDistance( {x:x, y:y}, trackingArray );
				}*/
				//console.log( count + ":" + calculatedDist);
				count++;
			} while( calculatedDist < distSquared && count < numToPlace );// I am bounding this in case we run into a runaway condition
				
			pt = new Point( x, y );
			trackingArray.push( pt );
			walls.push( pt );// storage
		}
		console.log( "WallManager end init " );
		
	}();
	
};