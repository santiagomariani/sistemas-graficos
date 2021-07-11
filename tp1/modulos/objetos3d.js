class Objeto3D{
    constructor(){
        this.matrizModelado = mat4.create();
        this.mallaTriangulos = null
        var posicion = vec3.fromValues(0,0,0);
        var rotacion = vec3.fromValues(0,0,0);
        var escala = vec3.fromValues(1,1,1);
        
        this.hijos = [];
        
        this.crearModelo();
    }

    // este metodo lo van a redefinir los distintos objetos 3d
    crearModelo() {}

    dibujar(mPadre){
        this._actualizarMatrizModelado();
        var m = mat4.create();
        mat4.multiply(m, mPadre, this.matrizModelado);

        if (this.mallaTriangulos){
            this.mallaTriangulos.dibujar();
        }

        for (let hijo of this.hijos){
            hijo.dibujar(m);
        }
    }

    _actualizarMatrizModelado(){
        var m = mat4.create();
        mat4.translate(m,m,this.position);
        mat4.rotateZ(m,m,this.rotacion[2]);
        mat4.rotateY(m,m,this.rotacion[1]);
        mat4.rotateX(m,m,this.rotacion[0]);
        mat4.scale(m,m,this.escala);
    }

    agregarHijo(objeto){
        this.hijos.push(objeto);
    }
    
    agregarHijos(...objetos){
        this.hijos.push(...objetos)
    }

    quitarHijo(hijo){
        for(var i = 0;i < this.hijos.length;i++){
            if (this.hijos[i] === hijo) {
                this.hijos.splice(i, 1);
            }
        }
    }

    setPosicion(posicion){
        this.posicion = posicion;
    }
    setRotacion(rotacion){
        this.rotacion = rotacion;
    }
    setEscala(escala){
        this.escala = escala;
    }
}
