export default class Sprite{
    /*Eh responsável por desenhar elementos na tela em animação*/
    constructor({x=100, y=100, w=20, h=20, color = "white", vx=0, vy=0} = {}){
        this.x = x;
        this.y = y;
        this.vx = x;
        this.vy = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }
    desenhar(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x , this.y, this.w, this.h);
    }
    passo(dt){
        this.x = this.x + this.vx*dt;
        this.y = this.y + this.vy*dt;
    }
}