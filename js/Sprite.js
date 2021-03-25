export default class Sprite{
    /*Eh responsável por desenhar elementos na tela em animação*/
    constructor({x=100, y=100, w=20, h=20, color = "white", vx=0, vy=0} = {}){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.w = w;
        this.h = h;
        //Posicao das extremidades dos sprites
        this.ladoDireito = this.x + this.w/2;
        this.ladoEsquerdo = this.x - this.w/2;
        this.cima = this.y - this.h/2;
        this.baixo = this.y + this.h/2;
        //indice e coluna da localização das extremidades dos sprites
        this.posLadoDireito = 0;
        this.posLadoEsquerdo = 0;
        this.posCima = 0;
        this.posBaixo = 0;

        this.alteracao = false;

        this.color = color;
        this.cena = null;
        this.mx = 0;
        this.my = 0;
    }
    desenhar(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.w/2 , this.y - this.h/2, this.w, this.h);
        ctx.strokeStyle = "blue";
        this.desenhaContorno(ctx);
    }
    desenhaContorno(ctx){
        ctx.strokeStyle = "blue";
        this.verificaQuadro();
        ctx.strokeRect(
            this.mx*this.cena.mapa.SIZE,
            this.my*this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
        );
        //Desenhando Direita:
        ctx.strokeRect(
            this.posLadoDireito*this.cena.mapa.SIZE,
            this.posCima*this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
        );
        ctx.strokeRect(
            this.posLadoDireito*this.cena.mapa.SIZE,
            this.posBaixo*this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
        );
        //Desenhando Esquerda:
        ctx.strokeRect(
            this.posLadoEsquerdo*this.cena.mapa.SIZE,
            this.posCima*this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
        );
        ctx.strokeRect(
            this.posLadoEsquerdo*this.cena.mapa.SIZE,
            this.posBaixo*this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
            this.cena.mapa.SIZE,
        );
    }
    passo(dt){
        this.atualizaLaterais();

        this.x = this.x + this.vx*dt;
        this.y = this.y + this.vy*dt;
        this.mx = Math.floor(this.x / this.cena.mapa.SIZE);
        this.my = Math.floor(this.y / this.cena.mapa.SIZE);
        // console.log("mx: "+this.mx);
        // console.log("my: "+this.my);
        this.aplicaRestricoes(dt);
    }
    colidiuCimaCom(outro){
        return!(this.y -this.h/2> outro.y + outro.h/2);
    }
    colidiuBaixoCom(outro){
        return!(this.y + this.h/2 < outro.y - outro.h/2);
    }
    colidiuEsquerdaCom(outro){
        return!(this.x - this.w/2> outro.x + outro.w/2);
    }
    colidiuDireitaCom(outro){
        return!(this.x + this.w/2 < outro.x - outro.w/2);
    }
    colidiuCom(outro){
        return!(
            (this.x - this.w/2> outro.x + outro.w/2)
            ||(this.x + this.w/2 < outro.x - outro.w/2)
            ||(this.y -this.h/2> outro.y + outro.h/2)
            ||(this.y + this.h/2 < outro.y - outro.h/2)
            );
        }
    aplicaRestricoes(dt){

        this.aplicaRestricoesVerticalBaixo();
        this.aplicaRestricoesVerticalCima();

        this.aplicaRestricoesHorizontalDir();
        this.aplicaRestricoesHorizontalEsq();
        
        // this.aplicaRestricoesDireita(this.mx+1, this.my-1);
        // this.aplicaRestricoesDireita(this.mx+1, this.my);
        // this.aplicaRestricoesDireita(this.mx+1, this.my+1);

        // this.aplicaRestricoesEsquerda(this.mx-1, this.my-1);
        // this.aplicaRestricoesEsquerda(this.mx-1, this.my);
        // this.aplicaRestricoesEsquerda(this.mx-1, this.my+1);

        // this.aplicaRestricoesBaixo(this.mx-1, this.my+1);
        // this.aplicaRestricoesBaixo(this.mx, this.my+1);
        // this.aplicaRestricoesBaixo(this.mx+1, this.my+1);

        // this.aplicaRestricoesCima(this.mx-1, this.my-1);
        // this.aplicaRestricoesCima(this.mx, this.my-1);
        // this.aplicaRestricoesCima(this.mx+1, this.my-1);
    }

    aplicaRestricoesHorizontalDir(){
        //Restricao para direita

        if(this.vx>0){
            this.verificaQuadro();
            let posColisaoX = this.posLadoDireito;
            if(posColisaoX < this.cena.mapa.COLUNAS){

                let posColisaoY1 = this.posCima;
                let posColisaoY2 = this.posBaixo;
                const SIZE = this.cena.mapa.SIZE;

                if(this.cena.mapa.tiles[posColisaoY1][posColisaoX] != 0){
                    const tile = new Sprite({
                        x: posColisaoX*SIZE + SIZE/2,
                        y: posColisaoY1*SIZE + SIZE/2,
                        w: SIZE,
                        h: SIZE
                    });
                    this.cena.ctx.strokeStyle = "red";
                    this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y - SIZE/2, SIZE, SIZE);
                    if(this.colidiuDireitaCom(tile) && this.alteracao == false){
                        let aux = this.vy;
                        this.vy = 0;
                        this.vx = 0;
                        this.alteracao = true;
                        this.x = tile.x - tile.w/2 - this.w/2 - 1;
                        // this.vx =this.vx*(-1);
                        this.verificaQuadro();
                        // this.vy = aux;
                        this.alteracao = false
                    }
                }

                else if(this.cena.mapa.tiles[posColisaoY2][posColisaoX] != 0 && posColisaoY2!=posColisaoY1){
                    const tile = new Sprite({
                        x: posColisaoX*SIZE + SIZE/2,
                        y: posColisaoY2*SIZE + SIZE/2,
                        w: SIZE,
                        h: SIZE
                    });
                    this.cena.ctx.strokeStyle = "red";
                    this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y - SIZE/2, SIZE, SIZE);
                    if(this.colidiuDireitaCom(tile) && this.alteracao == false){
                        let aux = this.vy;
                        this.vy = 0;
                        this.vx = 0;
                        this.alteracao = true;
                        this.x = tile.x - tile.w/2 - this.w/2 - 1;
                        // this.vx =this.vx*(-1);
                        this.verificaQuadro();
                        // this.vy = aux;
                        this.alteracao = false;

                    }
                }
            }
        }
    }

    aplicaRestricoesHorizontalEsq(){
        //Restricao para esquerda

        if(this.vx<0){
            this.verificaQuadro();
            let posColisaoX = this.posLadoEsquerdo;
            if(posColisaoX < this.cena.mapa.COLUNAS && posColisaoX>=0){

                let posColisaoY1 = this.posCima;
                let posColisaoY2 = this.posBaixo;
                const SIZE = this.cena.mapa.SIZE;

                if(this.cena.mapa.tiles[posColisaoY1][posColisaoX] != 0){
                    const tile = new Sprite({
                        x: posColisaoX*SIZE + SIZE/2,
                        y: posColisaoY1*SIZE + SIZE/2,
                        w: SIZE,
                        h: SIZE
                    });
                    this.cena.ctx.strokeStyle = "red";
                    this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y - SIZE/2, SIZE, SIZE);
                    if(this.colidiuEsquerdaCom(tile) && this.alteracao == false){
                        let aux = this.vy;
                        this.vy = 0;
                        this.vx = 0;
                        this.alteracao = true;
                        this.x = tile.x + tile.w/2 + this.w/2 + 1;
                        // this.vx =this.vx*(-1);
                        this.verificaQuadro();
                        // this.vy = aux;
                        this.alteracao = false;
                    }
                }

                else if(this.cena.mapa.tiles[posColisaoY2][posColisaoX] != 0  && posColisaoY2!=posColisaoY1){
                    const tile = new Sprite({
                        x: posColisaoX*SIZE + SIZE/2,
                        y: posColisaoY2*SIZE + SIZE/2,
                        w: SIZE,
                        h: SIZE
                    });
                    this.cena.ctx.strokeStyle = "red";
                    this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y - SIZE/2, SIZE, SIZE);
                    if(this.colidiuEsquerdaCom(tile) && this.alteracao == false){
                        let aux = this.vy;
                        this.vy = 0;
                        this.vx = 0;
                        this.alteracao = true;
                        this.x = tile.x + tile.w/2 + this.w/2 + 1;
                        // this.vx =this.vx*(-1);
                        this.verificaQuadro();
                        // this.vy = aux;
                        this.alteracao = false;
                    }
                }
            }
        }
    }

    aplicaRestricoesVerticalBaixo(){
        //Restricao para baixo

        if(this.vy>0){
            this.verificaQuadro();
            let posColisaoY = this.posBaixo;
            if(posColisaoY < this.cena.mapa.LINHAS){

                let posColisaoX1 = this.posLadoEsquerdo;
                let posColisaoX2 = this.posLadoDireito;
                const SIZE = this.cena.mapa.SIZE;

                if(this.cena.mapa.tiles[posColisaoY][posColisaoX1] != 0){
                    const tile = new Sprite({
                        x: posColisaoX1*SIZE + SIZE/2,
                        y: posColisaoY*SIZE + SIZE/2,
                        w: SIZE,
                        h: SIZE
                    });
                    this.cena.ctx.strokeStyle = "red";
                    this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y - SIZE/2, SIZE, SIZE);
                    if(this.colidiuBaixoCom(tile) && this.alteracao == false){
                        let aux = this.vx;
                        this.vx = 0;
                        this.vy = 0;
                        this.alteracao = true;
                        this.y = tile.y - tile.h/2 - this.h/2 - 1;
                        // this.vy =this.vy*(-1);
                        // // this.verificaQuadro();
                        // this.vx = aux;
                        this.alteracao = false;
                    }
                }

                if(this.cena.mapa.tiles[posColisaoY][posColisaoX2] != 0 && posColisaoX2!=posColisaoX1){
                    const tile = new Sprite({
                        x: posColisaoX2*SIZE + SIZE/2,
                        y: posColisaoY*SIZE + SIZE/2,
                        w: SIZE,
                        h: SIZE
                    });
                    this.cena.ctx.strokeStyle = "red";
                    this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y - SIZE/2, SIZE, SIZE);
                    if(this.colidiuBaixoCom(tile) && this.alteracao == false){
                        let aux = this.vx;
                        this.vx = 0;
                        this.vy = 0;
                        this.alteracao = true;
                        this.y = tile.y - tile.h/2 - this.h/2 - 1;
                        // this.vy =this.vy*(-1);
                        // // this.verificaQuadro();
                        // this.vx = aux;
                        this.alteracao = false;
                    }
                }
            }
        }
    }

    aplicaRestricoesVerticalCima(){
        //Restricao para cima

        if(this.vy<0){
            this.verificaQuadro();
            let posColisaoY = this.posCima;
            if(posColisaoY < this.cena.mapa.LINHAS && posColisaoY>=0){

                let posColisaoX1 = this.posLadoEsquerdo;
                let posColisaoX2 = this.posLadoDireito;
                const SIZE = this.cena.mapa.SIZE;

                if(this.cena.mapa.tiles[posColisaoY][posColisaoX1] != 0){
                    const tile = new Sprite({
                        x: posColisaoX1*SIZE + SIZE/2,
                        y: posColisaoY*SIZE + SIZE/2,
                        w: SIZE,
                        h: SIZE
                    });
                    this.cena.ctx.strokeStyle = "red";
                    this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y - SIZE/2, SIZE, SIZE);
                    if(this.colidiuCimaCom(tile) && this.alteracao == false){
                        let aux = this.vx;
                        this.vx = 0;
                        this.vy = 0;
                        this.alteracao = true;
                        this.y = tile.y + tile.h/2 + this.h/2 - 1;
                        // this.vy =this.vy*(-1);
                        // // this.verificaQuadro();
                        // this.vx = aux;
                        this.alteracao = false;
                    }
                }

                if(this.cena.mapa.tiles[posColisaoY][posColisaoX2] != 0 && posColisaoX2!=posColisaoX1){
                    const tile = new Sprite({
                        x: posColisaoX2*SIZE + SIZE/2,
                        y: posColisaoY*SIZE + SIZE/2,
                        w: SIZE,
                        h: SIZE
                    });
                    this.cena.ctx.strokeStyle = "red";
                    this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y - SIZE/2, SIZE, SIZE);
                    if(this.colidiuCimaCom(tile) && this.alteracao == false){
                        let aux = this.vx;
                        this.vx = 0;
                        this.vy = 0;
                        this.alteracao = true;
                        this.y = tile.y + tile.h/2 + this.h/2 - 1;
                        // this.vy =this.vy*(-1);
                        // // this.verificaQuadro();
                        // this.vx = aux;
                        this.alteracao = false;
                    }
                }
            }
        }
    }


    
    

    aplicaRestricoesDireita(pmx, pmy){
        if(this.vx>0 && pmx<this.cena.mapa.COLUNAS && pmx>=0  && pmy<this.cena.mapa.LINHAS && pmy>=0 ){
            const SIZE = this.cena.mapa.SIZE;
            if(this.cena.mapa.tiles[pmx][pmy] != 0){
                const tile = {
                    x: pmx*SIZE + SIZE/2,
                    y: pmy*SIZE + SIZE/2,
                    w: SIZE,
                    h: SIZE,
                }
                // console.log(tile);
                this.cena.ctx.strokeStyle = "white";
                this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y-SIZE/2, SIZE, SIZE);
                if(this.colidiuCom(tile)){
                    this.vy =0;
                    this.vx =0;
                    this.x = tile.x - tile.w/2 - this.w/2 - 1;
                }
            }
        }
    }

    aplicaRestricoesEsquerda(pmx, pmy){
        if(this.vx<0 && pmx<this.cena.mapa.COLUNAS && pmx>=0  && pmy<this.cena.mapa.LINHAS && pmy>=0 ){
            const SIZE = this.cena.mapa.SIZE;
            if(this.cena.mapa.tiles[pmx][pmy] != 0){
                const tile = {
                    x: pmx*SIZE + SIZE/2,
                    y: pmy*SIZE + SIZE/2,
                    w: SIZE,
                    h: SIZE,
                }
                // console.log(tile);
                this.cena.ctx.strokeStyle = "white";
                this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y-SIZE/2, SIZE, SIZE);
                if(this.colidiuCom(tile)){
                    this.vy =0;
                    this.vx =0;
                    this.x = tile.x + tile.w/2 + this.w/2 + 1;
                }
            }
        }
    }

    aplicaRestricoesBaixo(pmx, pmy){
        if(this.vy>0 && pmx<this.cena.mapa.COLUNAS && pmx>=0  && pmy<this.cena.mapa.LINHAS && pmy>=0 ){
            const SIZE = this.cena.mapa.SIZE;
            if(this.cena.mapa.tiles[pmx][pmy] != 0){
                const tile = {
                    x: pmx*SIZE + SIZE/2,
                    y: pmy*SIZE + SIZE/2,
                    w: SIZE,
                    h: SIZE,
                }
                // console.log(tile);
                this.cena.ctx.strokeStyle = "white";
                this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y-SIZE/2, SIZE, SIZE);
                if(this.colidiuCom(tile)){
                    this.vy =0;
                    this.vx =0;
                    this.y = tile.y - tile.h/2 - this.h/2 - 1;
                }
            }
        }
    }

    aplicaRestricoesCima(pmx, pmy){
        if(this.vy<0 && pmx<this.cena.mapa.COLUNAS && pmx>=0  && pmy<this.cena.mapa.LINHAS && pmy>=0 ){
            const SIZE = this.cena.mapa.SIZE;
            if(this.cena.mapa.tiles[pmx][pmy] != 0){
                const tile = {
                    x: pmx*SIZE + SIZE/2,
                    y: pmy*SIZE + SIZE/2,
                    w: SIZE,
                    h: SIZE,
                }
                // console.log(tile);
                this.cena.ctx.strokeStyle = "white";
                this.cena.ctx.strokeRect(tile.x - SIZE/2,tile.y-SIZE/2, SIZE, SIZE);
                if(this.colidiuCom(tile)){
                    this.vy =0;
                    this.vx =0;
                    this.y = tile.y + tile.h/2 + this.h/2 - 1;
                }
            }
        }
    }

    verificaQuadro(){    
        this.atualizaLaterais();

        this.posLadoDireito = this.retornaQuadro(this.ladoDireito, true);
        this.posLadoEsquerdo = this.retornaQuadro(this.ladoEsquerdo, true);
        this.posCima = this.retornaQuadro(this.cima, false);
        this.posBaixo = this.retornaQuadro(this.baixo, false);
        // console.log("--|!Anotacao3!|--------------");
        // console.log(this.cena.mapa.SIZE);
        // console.log(this.ladoDireito);
        // console.log(this.ladoEsquerdo);
        // console.log(this.cima);
        // console.log(this.baixo);
        // console.log("--|!Anotacao4!|--------------");
    }

    retornaQuadro(posicao, coluna){
        let index;
        if(coluna){
            for (index = 0; index < this.cena.mapa.COLUNAS && (posicao > index*this.cena.mapa.SIZE); index++) {
            
        }
        }else{
            for (index = 0; index < this.cena.mapa.LINHAS && (posicao > index*this.cena.mapa.SIZE); index++) {

            }
        }
        
        return index-1;
    }
    
    atualizaLaterais(){
        this.ladoDireito = this.x + this.w/2;
        this.ladoEsquerdo = this.x - this.w/2;
        this.cima = this.y - this.h/2;
        this.baixo = this.y + this.h/2;

        // console.log("--Anotacao1--------------");
        // console.log(this.x);
        // console.log(this.y);
        // console.log(this.ladoDireito);
        // console.log(this.ladoEsquerdo);
        // console.log(this.cima);
        // console.log(this.baixo);
        // console.log("--Anotacao2--------------");
    }
}