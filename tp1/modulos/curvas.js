class Curva{
    constructor(puntos){
        this.puntos = puntos
    }
    
    getTg(u, normalize=true){
        var delta_u = 0.01;
        var ui = (u - delta_u) < 0 ? u: u - delta_u;
        var uf = (u + delta_u) > this.getCantidadTramos() ? u: u + delta_u;
        var vec_a = this.getPos(ui);
        var vec_b = this.getPos(uf);
        var res = vec3.create();
        vec3.subtract(res,vec_b,vec_a);
        if (normalize){
            vec3.normalize(res, res);
        }
        return res;
    }

    getNormal(u, normalize=true){
        var tg1 = this.getTg(u);
		var tg2 = this.getTg(u + 0.01);

		var normal = vec3.create();
        vec3.cross(normal,tg1,tg2);
        vec3.cross(normal,normal,tg1);
        vec3.normalize(normal, normal);
        return normal;
    }

    getBinormal(u, normalize=true){
        var binormal = vec3.create();
        vec3.cross(binormal,this.getNormal(u),this.getTg(u));
        return binormal;
    }

    obtenerNumeroDeTramo(u){
        // empiezo a contar desde cero
        var parte_entera = Math.floor(u);
        if (parte_entera == this.getCantidadTramos()){
            return parte_entera - 1;
        }else{
            return parte_entera;
        }
    }
    
    obtenerULocal(u){
        return u - this.obtenerNumeroDeTramo(u);
    }
}

class CurvaBezierCuadratica extends Curva{
    getPos(u){
        var numero_tramo = this.obtenerNumeroDeTramo(u);
        var u = this.obtenerULocal(u);

        var puntos_control = this.puntos.slice(numero_tramo*3, numero_tramo*3 + 3);
        
        var x_u = Math.pow((1-u), 2)*puntos_control[0][0] + 2*u*(1-u)*puntos_control[1][0] + Math.pow(u, 2)*puntos_control[2][0];
        var y_u = Math.pow((1-u), 2)*puntos_control[0][1] + 2*u*(1-u)*puntos_control[1][1] + Math.pow(u, 2)*puntos_control[2][1];
        var z_u = Math.pow((1-u), 2)*puntos_control[0][2] + 2*u*(1-u)*puntos_control[1][2] + Math.pow(u, 2)*puntos_control[2][2];

        return vec3.fromValues(x_u,y_u,z_u);
    }

    getCantidadTramos(){
        return this.puntos.length / 3;
    }
}

class CurvaBezierCubica extends Curva{
    getPos(u){
        var numero_tramo = this.obtenerNumeroDeTramo(u);
        var u = this.obtenerULocal(u);

        var puntos_control = this.puntos.slice(numero_tramo*4, numero_tramo*4 + 4);
        
        var b_0 = Math.pow((1-u), 3);
        var b_1 = 3*Math.pow((1-u), 2)*u;
        var b_2 = 3*(1-u)*Math.pow(u, 2);
        var b_3 = Math.pow(u, 3);
        
        var x_u = b_0*puntos_control[0][0] + b_1*puntos_control[1][0] + b_2*puntos_control[2][0] + b_3*puntos_control[3][0];
        var y_u = b_0*puntos_control[0][1] + b_1*puntos_control[1][1] + b_2*puntos_control[2][1] + b_3*puntos_control[3][1];
        var z_u = b_0*puntos_control[0][2] + b_1*puntos_control[1][2] + b_2*puntos_control[2][2] + b_3*puntos_control[3][2];

        return vec3.fromValues(x_u,y_u,z_u);
    }

    getCantidadTramos(){
        return this.puntos.length / 4;
    }
}

class CurvaBSplineCuadratica extends Curva{
    getPos(u){
        var numero_tramo = this.obtenerNumeroDeTramo(u);
        var u = this.obtenerULocal(u);

        var puntos_control = this.puntos.slice(numero_tramo, numero_tramo + 3);

        var x_u = (1/2)*Math.pow((1-u), 2)*puntos_control[0][0] + ((1/2) + (1-u)*u)*puntos_control[1][0] + (1/2)*Math.pow(u, 2)*puntos_control[2][0];
        var y_u = (1/2)*Math.pow((1-u), 2)*puntos_control[0][1] + ((1/2) + (1-u)*u)*puntos_control[1][1] + (1/2)*Math.pow(u, 2)*puntos_control[2][1];
        var z_u = (1/2)*Math.pow((1-u), 2)*puntos_control[0][2] + ((1/2) + (1-u)*u)*puntos_control[1][2] + (1/2)*Math.pow(u, 2)*puntos_control[2][2];

        return vec3.fromValues(x_u,y_u,z_u);
    }

    getCantidadTramos(){
        return this.puntos.length - 2;
    }
}

class CurvaBSplineCubica extends Curva{
    getPos(u){
        var numero_tramo = this.obtenerNumeroDeTramo(u);
        var u = this.obtenerULocal(u);

        var puntos_control = this.puntos.slice(numero_tramo, numero_tramo + 4);

        var b_0 = (1/6)*Math.pow((1-u), 3);
        var b_1 = (1/2)*Math.pow(u, 3) - Math.pow(u, 2) + (2/3);
        var b_2 = (-1/2)*Math.pow(u, 3) + (1/2)*Math.pow(u, 2) + (1/2)*u + (1/6);
        var b_3 = (1/6)*Math.pow(u, 3);

        var x_u = b_0*puntos_control[0][0] + b_1*puntos_control[1][0] + b_2*puntos_control[2][0] + b_3*puntos_control[3][0];
        var y_u = b_0*puntos_control[0][1] + b_1*puntos_control[1][1] + b_2*puntos_control[2][1] + b_3*puntos_control[3][1];
        var z_u = b_0*puntos_control[0][2] + b_1*puntos_control[1][2] + b_2*puntos_control[2][2] + b_3*puntos_control[3][2];

        return vec3.fromValues(x_u,y_u,z_u);
    }

    getCantidadTramos(){
        return this.puntos.length - 3;
    }
}