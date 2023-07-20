export default class Player{
    constructor(game){
        this.game = game
        this.width = 50;
        this.height = 50;
        this.x = Math.round(game.width*0.02);
        this.y = Math.round(game.height/2);
        this.speedY = 0;
        this.speedX = 0;
        this.heath = 50;
        this.armor = 0;

    }
    update(){
        if ((game.controler_key.includes('ArrowUp') || game.controler_key.includes('KeyW')) && this.y>0)
            this.speedY = -1 - this.game.speedYY;
        else if ((game.controler_key.includes('ArrowDown') || this.game.controler_key.includes('KeyS')) && this.y<this.game.height-this.height)
            this.speedY = 1 + this.game.speedYY;
        else this.speedY = 0;
        if ((game.controler_key.includes('ArrowLeft') || game.controler_key.includes('KeyA')) && this.x>1)
            this.speedX = -1 - this.game.speedXX;
        else if ((game.controler_key.includes('ArrowRight') || this.game.controler_key.includes('KeyD')) && this.x<this.game.width-this.width)
            this.speedX = 1 + this.game.speedXX;
        else this.speedX = 0;

        this.x += this.speedX;
        this.y += this.speedY;

}
    draw(){
        ctx.drawImage(this.game.upload.image_space_ship,this.x,this.y,this.width,this.height);

    }

}
