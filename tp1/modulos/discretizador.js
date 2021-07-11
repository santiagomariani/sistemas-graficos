class DiscretizadorCurvas{
    constructor(curva){
        this.curva = curva;
    }

    discretizarPosiciones(delta_u){
        var u_act = 0;
        var cant_tramos = this.curva.getCantidadTramos();
        var posiciones = [];
        while(u_act<=cant_tramos){
            posiciones.push(this.curva.getPos(u_act));
            u_act += delta_u;
        }
        return posiciones
    }

    discretizarNormales(delta_u){
        var u_act = 0;
        var cant_tramos = this.curva.getCantidadTramos();
        var normales = [];
        while(u_act<=cant_tramos){
            normales.push(this.curva.getNormal(u_act));
            u_act += delta_u;
        }
        return normales
    }

    discretizarTangentes(delta_u){
        var u_act = 0;
        var cant_tramos = this.curva.getCantidadTramos();
        var tangentes = [];
        while(u_act<=cant_tramos){
            tangentes.push(this.curva.getTg(u_act));
            u_act += delta_u;
        }
        return tangentes;
    }
    
    discretizarMatricesNormales(delta_u){
        var u_act = 0;
        var cant_tramos = this.curva.getCantidadTramos();
        var matricesNormales = []
        while(u_act<=cant_tramos){
            var columnaNormal = vec4.fromValues(...this.curva.getNormal(u_act), 0);
            var columnaBinormal = vec4.fromValues(...this.curva.getBinormal(u_act), 0);
            var columnaTg = vec4.fromValues(...this.curva.getTg(u_act), 0);
            var ultimaColumna = vec4.fromValues(0,0,0,1);

            var matrizNormal = mat4.fromValues(...columnaNormal, ...columnaBinormal, ...columnaTg, ...ultimaColumna);
            matricesNormales.push(matrizNormal)
            u_act += delta_u
        }
        return matricesNormales;
    }
}
