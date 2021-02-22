import Cena from "./Cena.js";
import Sprite from "./Sprite.js";
console.log("Hello world!!!");

const canvas = document.querySelector("canvas"); //Primeiro elemento da classe canvas
const ctx = canvas.getContext("2d");
console.log(canvas);

const cena1 = new Cena(canvas);
cena1.desenhar();

const pc = new Sprite({});
const en1 = new Sprite({x:14, w:30, color:"red"});

pc.desenhar(ctx);
en1.desenhar(ctx);