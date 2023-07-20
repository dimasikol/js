const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width=500;
canvas.height=500;
class Controller{
    constructor(game){
        this.game = game;
        document.addEventListener('keypress',(event)=>{
            if (event.code==='KeyS'|| event.code==='KeyW'|| event.code==='KeyD'|| event.code==='KeyA')
                this.game.add_elem();    
            console.log(event.code);


        })
    }
}

class Game{
    constructor(type){
        this.controller = new Controller(this); 
        this.width_block = 80;
         this.height_block = 80;
        this.x = 1;
        this.y = 1;
        this.val = 1;
        this.data=[];
        this.type = type;

        for (let i=0;i<this.type;i++){
            this.data.push(0);
        }
    }
    add_elem(){
        console.log(this.data)
        console.log(this.data.filter(x=>x==0))
        if (this.data.filter(x=>x===0).length>0){
            this.generate_num = Math.round(Math.random()*this.game.type)
            if (this.data[this.generate_num/3+this.generate_num%3]===0)
                this.data[this.generate_num/3+this.generate_num%3] = 2 ? Math.random()>0.5:4;
        }
        else return false
    }


    update(){
    
    }
    draw(context){
        context.clearRect(0,0,canvas.width,canvas.height);
        this.default_draw(context);

    }

    default_draw(context){
        context.fillStyle = 'white';
        for (let x=0; x<this.type; x++){
            context.fillRect(Math.round(x%3)*100,Math.round(x/3)*100,40,40)
            if (this.data[x/3+(x%3)]!==0){
                    ctx.font = 'bold 80px Arial';
                    ctx.strokeText(this.data[x/3+(x%3)],(x/3)*160,100+(x%3)*160);
                }
        }
    }
}
var game = new Game(9,ctx);

function animation(){
    game.update();
    game.draw(ctx);


    requestAnimationFrame(animation)
}

animation()
