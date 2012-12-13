// Basic error handling
window.onerror = function(msg, url, lineno) {
  console.log(url + '(' + lineno + '): ' + msg);
};


// Provides requestAnimationFrame in a cross browser way.
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           return window.setTimeout(callback, 1000/60);
         };
})();

// Global application
var MyApp = {
	gl : undefined,
	canvas : undefined,
	running : true,
};

MyApp.create_shader = function(str, type) {
	var shader = MyApp.gl.createShader(type);
	MyApp.gl.shaderSource(shader, str);
	MyApp.gl.compileShader(shader);

	// Checks if shader was correctly compiled
	if (!MyApp.gl.getShaderParameter(shader, MyApp.gl.COMPILE_STATUS)) {
		throw MyApp.gl.getShaderInfoLog(shader);
	}

	return shader;
};

MyApp.init_program = function(vertexShaderAux, fragShaderAux) {
	var program = MyApp.gl.createProgram();
	
	var vShader = MyApp.create_shader(vertexShaderAux, MyApp.gl.VERTEX_SHADER);
	var fShader = MyApp.create_shader(fragShaderAux, MyApp.gl.FRAGMENT_SHADER);

	MyApp.gl.attachShader(program, vShader);
	MyApp.gl.attachShader(program, fShader);

	// Makes sure that gl.FRAGMENT_SHADER accepts data sent by gl.VERTEX_SHADER
	MyApp.gl.linkProgram(program);
	
	// Checks if linking is okey
	if (!MyApp.gl.getProgramParameter(program, MyApp.gl.LINK_STATUS)) {
  		throw MyApp.gl.getProgramInfoLog(program);
	}
	return program;
};

MyApp.draw = function() {
	var color_clear = MyApp.gl.COLOR_CLEAR_VALUE;
	if (!MyApp.running || !MyApp.gl) {
		console.log('Running: ' + MyApp.running);
		return;
	}

	console.log('color_clear: ' + color_clear);

	// Clears screen
	MyApp.gl.clear(MyApp.gl.COLOR_BUFFER_BIT);

	// Redraws triangle
	MyApp.gl.drawArrays(MyApp.gl.TRIANGLES, 0, 3);

	// Recalls draw() function.
	window.requestAnimFrame(MyApp.draw, canvas);
};

MyApp.init = function() {
	canvas = document.getElementById('viewport');
	MyApp.gl = canvas.getContext('experimental-webgl');

	// Creates a vertex buffer
	var vertexPosBuffer = MyApp.gl.createBuffer();
	
	// Binds buffer to the gl environment
	MyApp.gl.bindBuffer(MyApp.gl.ARRAY_BUFFER, vertexPosBuffer);

	// Defines vertices in 2D to draw a triangle
	var vertices = [-0.5,-0.5,0.5,-0.5, 0, 0.5];

	MyApp.gl.bufferData(MyApp.gl.ARRAY_BUFFER, new Float32Array(vertices), MyApp.gl.STATIC_DRAW);
	var vertexShader = 'attribute vec2 pos;' +
		'void main() { gl_Position = vec4(pos, 0, 1); }';
	
	// mediump is used to define medium precision to our numbers
	// Other values can be lowp
	var fragShader = 'precision mediump float;' +
		'void main() { gl_FragColor = vec4(0,0.8,0,1); }';

	// init_program() - Creates and compiles the shaders before attaching
	// them to the program and linking it.
	var program = MyApp.init_program(vertexShader, fragShader);

	MyApp.gl.useProgram(program);
	program.vertexPosAttrib = MyApp.gl.getAttribLocation(program, 'pos');
	
	// Specify which buffer is gonna be read when drawing starts
	MyApp.gl.enableVertexAttribArray(program.vertexPosAttrib);
	
	// Specify how the data is gonna be read
	// param:
	//	reference where data is stored, number of coordinates for each vertex,
	//	dataType, ¿false?, gap between data, starting index in array
	MyApp.gl.vertexAttribPointer(program.vertexPosAttrib, 2, MyApp.gl.FLOAT, false, 0, 0);

	// Draws the gl.ARRAY_BUFFER, which info comes from vertices through gl.bufferData.
	// param:
	// 	Defines how to draw given the vertex,
	//	from which vertex should we start drawing,
	//	number of vertices to draw.
	MyApp.gl.drawArrays(MyApp.gl.TRIANGLES, 0, 3);

	MyApp.draw();
	
};





