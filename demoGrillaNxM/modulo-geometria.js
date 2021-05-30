/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/


var superficie3D;
var mallaDeTriangulos;

var filas=90;
var columnas=90;

var SUPERFICIE_ELEGIDA='esfera'

function crearGeometria(){
    var superficies = {
        esfera: new Esfera(2),
        plano: new Plano(3,3),
        tubo_senoidal: new TuboSenoidal(.2,.25,1,2)
    }
    mallaDeTriangulos=generarSuperficie(superficies[SUPERFICIE_ELEGIDA],filas,columnas);
    
}

function dibujarGeometria(){

    dibujarMalla(mallaDeTriangulos);

}

function Esfera(r){
    this.getPosicion=function(u,v){
        var u2 = u * Math.PI * 2;
        var v2 = v * Math.PI;
        var z=r*Math.sin(v2)*Math.cos(u2);
        var x=r*Math.sin(v2)*Math.sin(u2);
        var y=r*Math.cos(v2);
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        var posicion = this.getPosicion(u,v);
        var x = posicion[0];
        var y = posicion[1];
        var z = posicion[2];
        
        var norma_de_posicion = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        return [x/norma_de_posicion, y/norma_de_posicion, z/norma_de_posicion];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){

        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function TuboSenoidal(amplitud, longitud_de_onda, r, h){

    this.getPosicion=function(u,v) {
        // Se puede ver que los vertices del extremo superior se conectan con los del
        // extremo inferior. No pude encontrar el motivo de esto. 
        var z = 0;
        var y = (u-0.5) * h;
        var x = (amplitud * Math.cos((2*Math.PI/longitud_de_onda)*y)) + amplitud + r;
        
        var a = v * 2 * Math.PI;
        var x_rotado = Math.cos(a) * x + Math.sin(a) * z;
        var z_rotado = -Math.sin(a) * x + Math.cos(a) * z;
        var y_rotado = y;

    
        return [x_rotado,y_rotado,z_rotado];
    }

    this.restarVectores=function(v1, v2) {
        return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
    }

    this.productoVectorial=function(v1, v2) {
        var x = v1[1] * v2[2] - v1[2] * v2[1];
        var y = v1[2] * v2[0] - v1[0] * v2[2];
        var z = v1[0] * v2[1] - v1[1] * v2[0];
        return [x,y,z];
    }

    this.getNormal=function(u,v) {
        var posicion = this.getPosicion(u,v);
        var delta_u = this.getPosicion(u + 0.01,v);
        var delta_v = this.getPosicion(u,v + 0.01);

        var tg_u = this.restarVectores(delta_u, posicion);
        var tg_v = this.restarVectores(delta_v, posicion);

        var normal = this.productoVectorial(tg_u, tg_v);

        norm = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2) + Math.pow(normal[2], 2))

        return [normal[0]/norm, normal[1]/norm, normal[2]/norm];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}



function calcularIndice(i, j, verticesPorFila){
    return i*verticesPorFila + j
}


function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];
    
    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }
    console.log("POSITION BUFFER");
    console.log(positionBuffer);

    console.log("NORMAL BUFFER");
    console.log(normalBuffer);

    // Buffer de indices de los triángulos
    
    indexBuffer=[];  

    for (i=0; i < filas; i++) {
        for (j=0; j < columnas; j++) {

            indexBuffer.push(this.calcularIndice(i, j, columnas+1))
            indexBuffer.push(this.calcularIndice(i+1, j, columnas+1))
            
            if (j == columnas - 1){
                indexBuffer.push(this.calcularIndice(i, j+1, columnas+1))
                indexBuffer.push(this.calcularIndice(i+1, j+1, columnas+1))
                if (i != filas - 1) {
                    indexBuffer.push(this.calcularIndice(i+1, j+1, columnas+1))
                    indexBuffer.push(this.calcularIndice(i+1, 0, columnas+1))
                }        
            }

            // completar la lógica necesaria para llenar el indexbuffer en funcion de filas y columnas
            // teniendo en cuenta que se va a dibujar todo el buffer con la primitiva "triangle_strip" 
            
        }
    }

    console.log("IMPRIMO INDEX BUFFER")
    console.log(indexBuffer)

    // Creación e Inicialización de los buffers

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
        /*
            Aqui es necesario modificar la primitiva por triangle_strip
        */
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}
