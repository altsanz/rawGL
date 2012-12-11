var gl;

var init = function() {
	
	
	var viewport = document.getElementById('viewport');
	gl = viewport.getContext('experimental-webgl');

	// Creates a vertex buffer
	var vertexPosBuffer = gl.createBuffer();
	
	// Binds buffer to the gl environment
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);

	// Defines vertices in 2D to draw a triangle
	var vertices = [-0.5,-0.5,0.5,-0.5, 0, 0.5];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	var vertexShader = 'attribute vec2 pos;' +
		'void main() { gl_Position = vec4(pos, 0, 1); }';
	
	// mediump is used to define medium precision to our numbers
	// Other values can be lowp
	var fragShader = 'precision mediump float;' +
		'void main() { gl_FragColor = vec4(0,0.8,0,1); }';

	// createProgram() - Creates and compiles the shaders before attaching
	// them to the program and linking it.
	var program = createProgram(vertexShader, fragShader);

	gl.useProgram(program);
	program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
	
	// Specify which buffer is gonna be read when drawing starts
	gl.enableVertexAttribArray(program.vertexPosAttrib);
	
	// Specify how the data is gonna be read
	// param:
	//	reference where data is stored, number of coordinates for each vertex,
	//	dataType, ¿false?, gap between data, starting index in array
	gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);

	// Draws the gl.ARRAY_BUFFER, which info comes from vertices through gl.bufferData.
	// param:
	// 	Defines how to draw given the vertex,
	//	from which vertex should we start drawing,
	//	number of vertices to draw.
	gl.drawArrays(gl.TRIANGLES, 0, 3);


};

function createProgram(vertexShaderAux, fragShaderAux) {
	var program = gl.createProgram();
	var vShader = createShader(vertexShaderAux, gl.VERTEX_SHADER);
	var fShader = createShader(fragShaderAux, gl.FRAGMENT_SHADER);

	gl.attachShader(program, vShader);
	gl.attachShader(program, fShader);

	// Makes sure that gl.FRAGMENT_SHADER accepts data sent by gl.VERTEX_SHADER
	gl.linkProgram(program);
	
	return program;
}

function createShader(str, type) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	return shader;
}

