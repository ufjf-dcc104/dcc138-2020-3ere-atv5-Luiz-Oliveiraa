export default class Mapa{

    constructor(linhas = 8, colunas = 12, tamanho = 32){
        this.LINHAS = linhas;
        this.COLUNAS = colunas;
        this.SIZE = tamanho;
        this.tiles = [];
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles [l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = 0;
                
            }
        }
        this.cena = null;
    }

    desenhar(ctx){
        var fundo = new Image();
        // fundo.src = "../assets/base_out_atlas.png";
        fundo = this.cena.assets.img("cenario");
        // console.log(this.cena.assets.img("cenario"));
        let coluna = 0;
        let linha = 0;

        for (let l = 0; l < this.LINHAS; l++) {
            for (let c = 0; c < this.COLUNAS; c++) {
                switch (this.tiles[l][c]){
                    case 1:
                        coluna = 0;
                        linha = 25;
                        break;
                    case 2:
                        coluna = 15;
                        linha = 11;
                        break;
                    default:
                        coluna = 24;
                        linha = 5;
                        break;
                }

                ctx.drawImage(fundo,
                    // sx sy sw sh
                    coluna*this.SIZE, linha*this.SIZE, this.SIZE, this.SIZE, //Posicao em que sera cortado
                    // dx dy dw dh
                    c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE //Posicao em que sera desenhado
                    );
                
            }
        }
    }

    carregaMapa(modelo){
        this.LINHAS = modelo.length;
        this.COLUNAS = modelo[0]?.length ?? 0;
        this.tiles = [];
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles [l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = modelo[l][c];
                
            }
        }
    }
}