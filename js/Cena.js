import Sprite from "./Sprite.js";

export default class Cena {
    /*Essa classe eh responsavel por desenhar elementos na tela em uma animação*/
    constructor(canvas, assets = null){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.sprites = [];
        this.aRemover = [];
        this.t0 = 0;
        this.dt = 0;
        this.idAnim = null;
        this.assets = assets;
        this.mapa = null;
        this.tempo = 0;
    }
    desenhar(){
        this.ctx.fillStyle = "lightblue";
        this.ctx.fillRect(0 ,0, this.canvas.width, this.canvas.height);

        this.mapa?.desenhar(this.ctx);

        if(this.assets.acabou()){
            for (let s = 0; s < this.sprites.length; s++) {
                const sprite = this.sprites[s];
                sprite.desenhar(this.ctx);
                sprite.aplicaRestricoes();            
            }

        }
        this.ctx.fillStyle = "blue";
        this.ctx.fillText(this.assets?.progresso(), 10, 20)
    }
    adicionar(sprite){
        sprite.cena = this;
        this.sprites.push(sprite); 
    }
    passo(dt){
        if(this.assets.acabou()){
            for (const sprite of this.sprites) {
                sprite.passo(dt);
            }

        }
    }
    quadro(t){
        this.t0 = this.t0 ?? t;
        this.dt = (t - this.t0)/1000;
        this.tempo += this.dt;

        if(this.tempo>=4){

            let hpos = 20;
            let wpos = 20;

            this.tempo = 0;
            let linhaS = Math.round((Math.random()*this.canvas.height)/this.mapa?.SIZE); 
            let colunaS = Math.round((Math.random()*this.canvas.width)/this.mapa?.SIZE);
            let posicaoValida = false;

            while (!posicaoValida) {

                if(linhaS >= this.mapa.LINHAS){
                    linhaS = (this.mapa.LINHAS-1);
                }
                if(colunaS >= this.mapa.COLUNAS){
                    colunaS = (this.mapa.COLUNAS-1);
                }

                if(this.mapa.tiles[linhaS][colunaS] == 0){
                    let xpos = Math.round((colunaS * this.mapa.SIZE)+this.mapa.SIZE/2);
                    let ypos = Math.round((linhaS * this.mapa.SIZE)+this.mapa.SIZE/2);
                    let direcao;

                    let vxS = Math.round((Math.random()*11));
                    let vyS = Math.round((Math.random()*11));
                    direcao = Math.round((Math.random()*3 +1));

                    if(direcao>=2){
                        direcao = 1;
                    }else{
                        direcao = -1;
                    }
                    vxS *=direcao;
                    if(direcao>=2){
                        direcao = 1;
                    }else{
                        direcao = -1;
                    }
                    vyS *=direcao;

                    let spr = new Sprite({x:xpos, y:ypos, vx:vxS, vy:vyS, color:"red"});
                    let colidiu = false;

                    for (let a = 0; a < this.sprites.length-1; a++){
                        if(spr.colidiuCom(this.sprites[a])){
                            colidiu = true;
                            break;
                        }
                    }

                    if(!colidiu){
                        this.adicionar(spr);
                        posicaoValida = true;
                    }else{
                        linhaS = Math.round((Math.random()*this.canvas.height)/this.mapa?.SIZE); 
                        colunaS = Math.round((Math.random()*this.canvas.width)/this.mapa?.SIZE);
                    }
                }else{
                    linhaS = Math.round((Math.random()*this.canvas.height)/this.mapa?.SIZE); 
                    colunaS = Math.round((Math.random()*this.canvas.width)/this.mapa?.SIZE); 
                }
            }
        }


        this.passo(this.dt);
        this.desenhar();
        this.checaColisao();
        this.removerSprites();

        this.iniciar();
        this.t0 = t;
    }
    iniciar(){
        this.idAnim = requestAnimationFrame(
            (t) => {this.quadro(t);}
            );
    }
    parar(){
        cancelAnimationFrame(this.idAnim);
        this.t0 = null;
        this.dt = 0;
    }
    checaColisao(){
        for (let a = 0; a < this.sprites.length-1; a++) {
            const spriteA = this.sprites[a];
            for (let b = a+1; b < this.sprites.length; b++) {
                const spriteB = this.sprites[b];
                if(spriteA.colidiuCom(spriteB)){
                    this.quandoColidir(spriteA,spriteB);
                }
            }
        }
    }
    quandoColidir(a,b){
        this.assets.play("boom");
        if(!this.aRemover.includes(a)){
            this.aRemover.push(a);
        }
        if(!this.aRemover.includes(b)){
            this.aRemover.push(b);
        }

        console.log(this.aRemover);
    }
    removerSprites(){
        for (const alvo of this.aRemover) {
            const idx = this.sprites.indexOf(alvo);
            if(idx>=0){
                this.sprites.splice(idx,1);
            }  
        }
        this.aRemover = [];
    }

    configuraMapa(mapa){
        this.mapa = mapa;
        this.mapa.cena = this;
    }
}