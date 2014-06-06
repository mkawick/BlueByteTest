// block_manager.js


function BlockManager( width, height, gridSize, offsetX, offsetY )
{
	var blocks = [];
	
	_findBlock = function ( pt )
	{
		var num = blocks.length;
		for( var i=0; i<num; i++ )
		{
			var block = blocks[i];
			if( block.x == pt.x && 
				block.y == pt.y )
			return i;
		}
		return -1;
	}
	
	this.draw = function( context, grid )
	{
		var color = "LavenderBlush";
		var num = blocks.length;
		for( var i=0; i<num; i++ )
		{
			var pt = blocks[i];
			grid.drawMyPosition( context, pt, color );
		}
	};
	
	
	
	this.update = function()
	{
	};

	this.isBlockPresent = function( pt ) 
	{
		if( _findBlock( pt ) != -1 )
			return true;
		return false;
	};
	
	
	this.removeBlock = function( pt )
	{
		var index = _findBlock( pt );
		if( index != -1 )
		{
			blocks.splice( index, 1 );
		}
	};
	
	this.canPlaceBlock = function( pt )
	{
		return false;
	};
	
	// because there is a fair amount of work to do here, I added the complexity of a c'tor
	// most other classes do not need this.
	var __construct = function() 
	{
      /* if( numToPlace > 40 ) /// error condition?
		{
			alert( "bad setup for blocks" );
		}
		
		var tempArray;
		
		if( avoidedLocations == undefined )
			tempArray = [];
		else
			tempArray = avoidedLocations.slice(0);
			
		var distSquared = minDistance * minDistance;
			
		for( var i=0; i< numToPlace; i++ )
		{
			var x;
			var y;
			var count = 0;
			do{
				x = parseInt( getRandomArbitrary( 0, width ) );
				y = parseInt( getRandomArbitrary( 0, height ) );
				calculatedDist = findMinDistance( {x:x, y:y}, tempArray );
				console.log( count + ":" + calculatedDist);
				count++;
				} while( calculatedDist < distSquared );
				
			pt = new Point( x, y );
			tempArray.push( pt );// tracking 
			blocks.push( pt );// storage
		}*/
		
		console.log( "BlockManager init " );
		
		for( var y=offsetY; y<height; y+=gridSize )
		{
			for( var x=offsetX; x<width; x+= gridSize )
			{
				blocks.push( new Point( x, y ) );
			}
		}
		console.log( "BlockManager init " );
		
	}();
	
};