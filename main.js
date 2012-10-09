window.onload = function() {
	var canvasesInfo = [];
	
	canvasesInfo.push(
		{
			canvas: document.getElementById('canvas1'),
			pattern: function(t, i) {
				return (Math.sin(10*(t + i)) + Math.sin(9*(t + i)))/2;
			}
		}, {
			canvas: document.getElementById('canvas2'),
			pattern: function(t, i) {
				return (Math.sin(10*(t + i)) + Math.sin(9*(t + i)) + Math.sin(5*(t + i)))/3;
			}
		}, {
			canvas: document.getElementById('canvas3'),
			pattern: function(t, i) {
				return Math.sin(10*(t + i))/2;
			}
		}, {
			canvas: document.getElementById('canvas4'),
			pattern: function(t, i) {
				return (Math.sin(10*(t + i)) + Math.cos(6*(t + i)))/2;
			}
		}/*, {
			canvas: document.getElementById('canvas5'),
			pattern: function(t, i) {
				return (Math.sin(4*t + i) + Math.cos(3*t + i))/2;
			}
		}, {
			canvas: document.getElementById('canvas6'),
			pattern: function(t, i) {
				return (Math.sin(4*t + i) + 0.3*Math.cos(3*t + i))/2;
			}
		}*/
	);
	
	var WIDTH = 1500;
	var HEIGHT = 150;
	var RADIUS = 3;
	var MIDHEIGHT = HEIGHT/2;
	var NUM_CIRCLES = WIDTH/(2*RADIUS);
	var TRAILING_DOTS = 1;
	var DOTS_TO_STORE = TRAILING_DOTS + 2;
	
	//init arrays
	for (var f = 0, len = canvasesInfo.length; f < len; ++f) {
		var canvasInfo = canvasesInfo[f];
		canvasInfo.canvas.width = WIDTH;
		canvasInfo.canvas.height = HEIGHT;
		canvasInfo.dots = [];
		canvasInfo.max = [];
		for (var j = 0; j < NUM_CIRCLES; ++j) {
			var dotHolder = [];
			
			for (var k = 0; k < DOTS_TO_STORE; ++k) {
				dotHolder.push(0);
			}
			
			canvasInfo.dots.push(dotHolder);
			canvasInfo.max.push(0);
		}
	}
	
	
	function draw() {
		for (var f = 0, len = canvasesInfo.length; f < len; ++f) {
			var canvasInfo = canvasesInfo[f];
			var canvas = canvasInfo.canvas;
			if (canvas.getContext) {
				var ctx = canvas.getContext('2d');
				ctx.clearRect(0, 0, WIDTH, HEIGHT);
				var t = new Date().getTime()/3000;
				
				for (var i = 0; i < NUM_CIRCLES; ++i) {				
					var sinHeight = canvasInfo.pattern(t, i);
					var currentDotHolder = canvasInfo.dots[i];
					
					for (var k = 0; k < DOTS_TO_STORE - 1; ++k) {
						currentDotHolder[k] = currentDotHolder[k + 1];
					}
					
					currentDotHolder[DOTS_TO_STORE - 1] = sinHeight;
					
					if (Math.abs(currentDotHolder[DOTS_TO_STORE - 2]) > Math.abs(currentDotHolder[DOTS_TO_STORE - 3]) && Math.abs(currentDotHolder[DOTS_TO_STORE - 2]) > Math.abs(currentDotHolder[DOTS_TO_STORE - 1])) {
						canvasInfo.max[i] = Math.abs(currentDotHolder[j]);
					}
					
					for (var j = TRAILING_DOTS; j > 0; --j) {
						drawCircle(i, canvasInfo.max[i], currentDotHolder[j], currentDotHolder[j - 1], j/TRAILING_DOTS, ctx);
					}
				}
			}
		}
	}
	
	function drawCircle(i, max, height, prevHeight, opacity, ctx) {
		var radiusScaling = 2 * (max - Math.abs(height));
		var zoomDir = height > prevHeight ? -1 : 1;
		var color = Math.round(50 * (2 + zoomDir * radiusScaling));
		
		ctx.beginPath();
		ctx.fillStyle = 'rgba(' + (255 - color) + ', ' + color + ', ' + color + ', ' + opacity + ')';
		ctx.arc(i * RADIUS * 2.5, MIDHEIGHT  + MIDHEIGHT * (height) * 0.95, RADIUS + zoomDir * radiusScaling, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	}
	
	function drawWave() {
		setInterval(draw, 50);
	}
	
	drawWave();
}