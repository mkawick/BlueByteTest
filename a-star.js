// a-star.js

function getNextValidMovementLocation( wallManager, grid, currentPosition, finalDestination )
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
};