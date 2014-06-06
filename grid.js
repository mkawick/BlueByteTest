// grid.js

function Grid( blockSize, gridLineSize, blocksAcross, blocksDown, width, height )
{
	//this.context = context;
	this.width = width;
	this.height = height;
	this.blockSize = blockSize;
	this.gridLineSize = gridLineSize;
	this.blockColor = "#000";
	this.visibleGrid = { width:blocksAcross, height:blocksDown };
	this.visibleOffset = { x:0, y:0 }; // could start in the middle
	
	
	/// this is only for drawing.
	this.draw = function( context )
	{
		var finalBlockSize = this.blockSize;// - this.gridLineSize;
		var offsetBlockSize = this.blockSize + this.gridLineSize;
		var yPos = 0;
		for( var y=0; y<this.visibleGrid.height; y++ )
		{
			var xPos = 0;
			for( var x=0; x<this.visibleGrid.width; x++ )
			{
				drawSquare( context, {x:xPos, y:yPos}, finalBlockSize, this.blockColor );
				xPos += offsetBlockSize;
			}
			yPos += offsetBlockSize;
		}
		
		/*for( var j=0; j<this.height; j+= 4 )
		{
			for( var i=0; i<this.width; i+= 4 )
			{
				this.drawMyPosition( context, { x:i, y:j }, "#ccc" );
			}
		}*/
	};
	
	this.drawMyPosition = function( context, pt, color )
	{
		var finalBlockSize = this.blockSize;// - this.gridLineSize;
		var offsetBlockSize = this.blockSize + this.gridLineSize;
		var screenPosition = { 
			x: (pt.x - this.visibleOffset.x)*offsetBlockSize, 
			y: (pt.y - this.visibleOffset.y)*offsetBlockSize 
			};
		drawSquare( context, screenPosition, finalBlockSize, color );
	};
	
	this.keepPlayerInBounds = function( player )
	{
		if( player.position.x < 0 )
			player.position.x = 0;
		if( player.position.y < 0 )
			player.position.y = 0;
		if( player.position.x >= this.width )
			player.position.x = this.width-1;
		if( player.position.y >= this.height )
			player.position.y = this.height-1;
			
		var borderRange = 2;
		
		// keep all offsets withon a range to keep play on screen.
		var rightEdge = this.visibleOffset.x + this.visibleGrid.width;
		var leftEdge = this.visibleOffset.x;		
		if( player.position.x > (rightEdge - borderRange-1) && 
			rightEdge <= this.width )
		{
			this.visibleOffset.x = player.position.x - this.visibleGrid.width + borderRange + 1;
			if( this.visibleOffset.x >= this.width - this.visibleGrid.width )
				this.visibleOffset.x = this.width - this.visibleGrid.width;
		}
		else if( player.position.x < leftEdge + borderRange )
		{
			this.visibleOffset.x = player.position.x - borderRange;
			if( this.visibleOffset.x < 0 )
			 this.visibleOffset.x = 0;
		}
		
		var bottomEdge = this.visibleOffset.y + this.visibleGrid.height;
		var topEdge = this.visibleOffset.y;
		if( player.position.y > (bottomEdge - borderRange-1) && 
			bottomEdge <= this.height )
		{
			this.visibleOffset.y = player.position.y - this.visibleGrid.height + borderRange + 1;
			if( this.visibleOffset.y >= this.height - this.visibleGrid.height )
				this.visibleOffset.y = this.height - this.visibleGrid.height ;
		}
		else if( player.position.y < topEdge + borderRange )
		{
			this.visibleOffset.y = player.position.y - borderRange;
			if( this.visibleOffset.y < 0 )
			 this.visibleOffset.y = 0;
		}
		
	};
	
	this.calculatePosition = function( pt )
	{
		var offsetBlockSize = this.blockSize + this.gridLineSize;
		var x = parseInt( pt.x/offsetBlockSize ) + this.visibleOffset.x;
		var y = parseInt( pt.y/offsetBlockSize ) + this.visibleOffset.y;
		
		return {x:x, y:y};
	};
	
	this.isValidLocation = function( pt )
	{
		if( pt.x < 0 || pt.y < 0 )
			return false;
		if( pt.x >= this.width || pt.y >= this.height )
			return false;
		return true;
	};
};