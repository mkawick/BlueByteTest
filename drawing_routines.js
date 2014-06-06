// drawing_routines.js

function fillTriangle( context, pt1, pt2, pt3, color )
{
	// Draw a path
	context.beginPath();
	context.moveTo( pt1.x, pt1.y ); 
	context.lineTo( pt2.x, pt2.y ); 
	context.lineTo( pt3.x, pt3.y );
	context.closePath();

	// Fill the path
	context.fillStyle = color;
	context.fill();
}
function drawCircle( context, pt, r, color )
{
	context.beginPath();
	context.arc( pt.x, pt.y, r, 0, Math.PI*2, true); 
	context.closePath();
	context.fillStyle = color;
	context.fill();
}
function drawSquare( context, pt, r, color )
{
	if( color )
	{
		context.fillStyle = color;
	}
	//context.strokeStyle="red";
	//context.strokeRect( pt.x, pt.y, r, r);
	//context.fill();
	context.fillRect( pt.x, pt.y, r, r);

}
function drawPoints( context )
{
	context.fillStyle = gradient;
	context.fillRect( -widthOver2, -heightOver2, width, height );
}

		/*var x = 20;
			var y = 100;
			context.font = "40pt Calibri";
			context.fillStyle = "#388"; // text color
			context.fillText("Loading...", x, y);*/