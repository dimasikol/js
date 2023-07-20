const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;

class Game{
    constructor(){
        this.upload = new Upload(this);
        this.background = new Background(this);
        this.width = canvas.width;
        this.height = canvas.height;
        this.player = new Player(this);
        this.controler = new Controller(this);
        this.bullet_width = 0; //update
        this.bullet_height = 0; //update
        this.bullet_speed = 0; //update
        this.speedXX = 0; //update
        this.speedYY = 0; //update
        this.ammo = 10;  // патроны
        this.ammo_max = 10;
        this.timer = 0; // таймер 
        this.ammo_refresher = 50; // таймер регенирации пуль  
        this.bullets = []; // пули player
        this.bullets_enemys = []; // пули enemy
        this.controler_key = []; // нажатые клавиши
        this.enemys = [];  //противники 
        this.enemys_suiced = []; // противники суицидники
        this.upgrade = []; // улучшения
        console.log('game started');
        this.gameover = false;
    }

    update(){
        this.background.update();
        this.player.update();
        this.timer += 1;
        
        if (this.ammo!=this.ammo_max && this.timer % this.ammo_refresher === 0) // патроны refresh 
            this.ammo+=1;
        if (this.timer%70==0)                     // создание Врага
            this.enemys.push(new Enemy(this)); 
        if (this.timer%70==0)                     // создание Врага
            this.enemys_suiced.push(new EnemySuicide(this));       
        if (this.timer%120==0)                    // создание Улучшений
            this.upgrade.push(new Upgrade(this));

        this.bullets.map(bullet=>bullet.update());   
        this.enemys.map(enemy=>enemy.update()); // update врагов
        this.enemys_suiced.map(enemy=>enemy.update()); //  update врагов sucide
        this.upgrade.map(upg=>upg.update()); // update upgrade
        this.bullets_enemys.map(bullet_enemys=>bullet_enemys.update()); // патроны вранов
        
        if (this.player.heath<=0)
            this.gameover = true;       
    }
        
    draw(){
        this.background.draw();
        this.upload.draw();
        this.player.draw();
        this.bullets.map(bull=>bull.draw()); // отрисовка всех пуль игрока    
        this.upgrade.map(upgrad=>upgrad.draw()); // отрисовка улучшений
        this.enemys.map(enemy=>enemy.draw());  // отрисовка врага  
        this.enemys_suiced.map(enemy=>enemy.draw());  // отрисовка суицидников

        if (this.gameover){
            //ctx.textAlign = 'center'; //выравнивание текста по центру
            ctx.font = 'bold 50px Arial';
            ctx.strokeText('вы проиграли',120,this.height*0.5);
        }
    }

    check_inner(left,right){    // проверка наезда одного блока на другой
        if (((left.x+left.width>=right.x) && left.x <= (right.x+right.width)) && ( (left.y+left.height)>=right.y) && ((right.y+right.height)>= left.y))
            return true
    }
}
class Player{
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
        this.weanon_lvl = 0;
    }
    update(){
        if ((game.controler_key.includes('ArrowUp') || game.controler_key.includes('KeyW')) && this.y>0)
            this.speedY = -1 - this.game.speedYY;
        else if ((game.controler_key.includes('ArrowDown') || this.game.controler_key.includes('KeyS')) && this.y<this.game.height-this.height)
            this.speedY = 1 + this.game.speedYY;
        else 
            this.speedY = 0;
        if ((game.controler_key.includes('ArrowLeft') || game.controler_key.includes('KeyA')) && this.x>1)
            this.speedX = -1 - this.game.speedXX;
        else if ((game.controler_key.includes('ArrowRight') || this.game.controler_key.includes('KeyD')) && this.x<this.game.width-this.width)
            this.speedX = 1 + this.game.speedXX;
        else 
            this.speedX = 0;

        this.x += this.speedX;
        this.y += this.speedY;
}
    draw(){
        ctx.drawImage(this.game.upload.image_space_ship,this.x,this.y,this.width,this.height);

    }
    
}
class Controller{
    
    constructor(game){
        this.game = game;

        document.addEventListener('keydown',(event)=>{
            if ((event.code==='KeyS' || event.code ==='ArrowDown' || event.code === 'ArrowUp' || event.code === "KeyW" || event.code === "ArrowLeft" || event.code === "KeyA" || event.code === "ArrowRight" || event.code === "KeyD" ) && game.controler_key.indexOf(event.code)===-1) 
                game.controler_key.push(event.code);
            if (event.code == 'Space' && game.bullets.indexOf(event.code)===-1 && game.ammo>0 && this.game.player.weanon_lvl===0){    
                game.ammo-=1;   
                game.bullets.push(new Bullet(game));
            }
            else if (event.code == 'Space' && game.bullets.indexOf(event.code)===-1 && game.ammo>0 && this.game.player.weanon_lvl===1){    
                game.ammo-=2;   
                game.bullets.push(new Bullet(game));
                game.bullets.push(new Bullet(game,this.game.player.x,this.game.player.y+30));
            }
            else if (event.code == 'Space' && game.bullets.indexOf(event.code)===-1 && game.ammo>0 && this.game.player.weanon_lvl===2){    
                game.ammo-=3;   
                game.bullets.push(new Bullet(game));
                game.bullets.push(new Bullet(game,this.game.player.x+10,this.game.player.y+15));
                game.bullets.push(new Bullet(game,this.game.player.x,this.game.player.y+30));
            }
        });

        document.addEventListener('keyup',(event)=>{
            if (game.controler_key.indexOf(event.code)>-1)
                game.controler_key.splice(game.controler_key.indexOf(event.code),1)
            //if (game.bullets.indexOf(event.code)>-1)
            //    game.bullet.splice(game.bullet.indexOf(event.code),1);
        })
    }
}
class Bullet{
    constructor(game,x,y){
        this.game = game;
        this.x = x || game.player.x;
        this.y = y || game.player.y;
        this.width = 6 + game.bullet_width;
        this.height = 3 + game.bullet_height;
        this.speed = 5 + game.bullet_speed;
        this.forDelete = false;
        this.damage = 1;
    }

    update(){
        this.x+=this.speed
        if (this.x>this.game.width || this.y>this.game.height) // добавить пересечение
            this.forDelete = true;
        for (let i=0;i<this.game.enemys.length;i++){
            if (this.game.check_inner(this.game.enemys[i],this)){
                this.game.enemys[i].heath -= this.damage;
                this.forDelete=true;
            }
        }
        for (let i=0;i<this.game.enemys_suiced.length;i++){
            if (this.game.check_inner(this.game.enemys_suiced[i],this)){
                this.game.enemys_suiced[i].heath -= this.damage;
                this.forDelete=true;
            }
        }

        this.game.bullets = this.game.bullets.filter(bullet=>!bullet.forDelete);
    }

    draw(){
        ctx.drawImage(this.game.upload.image_bullet,this.x,this.y,Math.round(this.width),Math.round(this.height));
    }
}
class EnemyBullet {
    constructor(bullet){
        this.bullet = bullet
        this.x = bullet.x-20
        this.y = bullet.y
        this.width = 3;
        this.height = 3;
        this.speed = 3;
        this.damage = 1;
        this.forDelete = false;
    }
    update(){
        this.x -= this.speed;
        if (this.x < 0  || this.y <0 || (this.y>this.bullet.game.height+100)){
            this.forDelete = true
            
        }
        if (this.bullet.game.check_inner(this.bullet.game.player,this)){ // тут правка 1
            if ( this.bullet.game.player.armor>this.damage)
                this.bullet.game.player.armor-=this.damage
            else if (this.bullet.game.player>0){
                this.bullet.game.player.heath -= (this.damage-this.armor);
                this.bullet.fillRect.player.armor = 0;
            }
            else
                this.bullet.game.player.heath-=this.damage;
            this.forDelete = true
        }

        this.bullet.game.bullets_enemys = this.bullet.game.bullets_enemys.filter(bull => !bull.forDelete)
    }
    draw(){
        ctx.fillRect(this.x,this.y,this.width,this.height);
        //ctx.drawImage(image_bullet,this.x,this.y,Math.round(this.width),Math.round(this.height));
    }
}
class Enemy{
    constructor(game){
        this.game = game;
        this.heath = Math.round(Math.random()*20);
        this.width = Math.round(50+Math.random()*this.heath);
        this.height = Math.round(this.width-10);
        this.x = this.game.width;
        this.y = Math.round(Math.random()*game.height);
        this.image = this.game.upload.image_enemys[Math.round(Math.random()*6)];
        this.move = 100+Math.round(Math.random()*200); // для перемещение enemy   
        this.forDelete = false;
        this.speed_ammo = 50;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.font = 'bold 14px Arial';
        //ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        ctx.strokeText(this.heath,this.x,this.y+12);
        for (let i=0; i<this.game.bullets_enemys.length;i++){
            this.game.bullets_enemys[i].draw();
        }
        
    }
    update(){
        this.x -= 1;

        if (this.game.timer%this.speed_ammo==0){
            this.game.bullets_enemys.push(new EnemyBullet(this)) // создание пуль 
        }
        
        if ((this.x)%this.move>this.move/2)
            this.y+=1;                      // перемещение врага
        else
            this.y-=1;
        if (this.heath < 0 || this.x<(0-this.width)){
            this.forDelete = true;
        }
       // for (let i = 0; i<this.game.bullets.length;i++){    // chek for bullet inner enemy проверка на попадания пули по enemy             
       //     if (this.game.check_inner(this.game.bullets[i],this)) 
       //         this.heath-=0.5;
       // }
        if (this.game.check_inner(this.game.player,this)){  // если враг наезжает на игрока // тут прака 3
            if (this.game.player.armor > this.heath)
                this.game.player.armor -= this.heath
            else if (this.game.player.armor === 0)
                this.game.player.heath -= this.heath
            else {
                this.game.player.heath -= (this.heath-this.game.player.armor);//?
                this.game.player.armor = 0;
            }
            this.forDelete=true
        }

    this.game.enemys = this.game.enemys.filter(enemy=>!enemy.forDelete);
    }
}
class EnemySuicide extends Enemy{
    constructor(game){
        super(game)
    }
    update(){
        this.x -= 4;
        if (this.game.player.y>this.y) this.y += 1;
        else this.y -=1;

        if (this.heath < 0 || this.x<(0-this.width))
            this.forDelete = true;
        if (this.game.check_inner(this.game.player,this)){  // если враг наезжает на игрока // тут прака 3
            if (this.game.player.armor > this.heath)
                this.game.player.armor -= this.heath
            else if (this.game.player.armor === 0)
                this.game.player.heath -= this.heath
            else{
                this.game.player.heath -= (this.heath-this.game.player.armor);//
                this.game.player.armor = 0;
            }
            this.forDelete=true
        }
        this.game.enemys_suiced = this.game.enemys_suiced.filter(enemy=>!enemy.forDelete);
    }
}
class Upgrade{
    constructor(game){
        this.game = game;
        this.x = game.width;
        this.y = Math.round(Math.random()*game.height);
        this.width = 30;
        this.height = 35;
        this.type = Math.round(Math.random()*5);
        this.image = this.game.upload.image_upgrades[this.type];
        this.forDelete = false;
    }
    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);        
    }

    update(){
        this.x-=3;
        if (this.game.bullet_height>19 && this.game.bullet_speed>5 && this.game.player.weanon_lvl<2){
            console.log('lvl up');
            this.game.player.weanon_lvl+=1;
            this.game.bullet_height = 3;
            this.game.bullet_width = 4;
            this.game.bullet_speed = 0;
        }
        if (this.game.check_inner(this.game.player,this)){ //тут правка 4
            this.forDelete = true
            switch (this.type) {
                case 0:
                    if (this.game.ammo_max<50);
                        this.game.ammo_max+= 10;
                    break;
                case 1:
                    if (this.game.bullet_height<40){
                    this.game.bullet_height += 3;
                    this.game.bullet_width += 4;
                }
                    break;
                case 2:
                    if (this.game.bullet_speed<15)
                        this.game.bullet_speed+=1;
                    break;
                case 3:
                    if (this.game.speedYY<30 || this.game.speedXX<30){
                        this.game.speedXX +=0.5;
                        this.game.speedYY +=0.5;
                    }
                    break;
                case 4:
                    if (this.game.player.heath+50 <= 200)    
                        this.game.player.heath =(this.game.player.heath+50);
                    else this.game.player.heath = 200;
                    break;
                case 5:
                    if (this.game.player.armor+50 <= 200)    
                        this.game.player.armor =(this.game.player.armor+50);
                    else this.game.player.armor = 200;
                    break;    
                default:
                    break;
                }
        }
        if (this.x <(0-this.width) || this.y<(0-this.height) || this.y>this.game.height)
            this.forDelete = true; 
        this.game.upgrade = this.game.upgrade.filter(upg=>!upg.forDelete);
    }
}
class Upload{
    constructor(game){
        this.game = game;
        this.heath_x = 25;
        this.heath_y = 5;
        this.image_bullet = new Image();
        this.image_heath = new Image();
        this.image_armor = new Image();
        this.image_bullets = new Image();
        this.image_space_ship = new Image();
        this.image_enemys = [];
        for (let i=0;i<7;i++){
            this.image_enemys.push(new Image());
            this.image_enemys[i].src = `./media/enemy/enemy${1+i}.png`
        }
        this.image_upgrades = [];
        for (let i=0;i<6;i++){
            this.image_upgrades.push(new Image());
            this.image_upgrades[i].src = `./media/upgrade/upgrade${1+i}.png`
        }
        this.image_bullet.src = './media/bull.png'
        this.image_heath.src = './media/heath.png';
        this.image_armor.src = './media/armor.png';
        this.image_bullets.src = './media/bullets.png';
        this.image_space_ship.src = './media/space-ship.png';  
        
        
        
    }
    
    draw(){
        ctx.drawImage(this.image_heath,this.heath_x,this.heath_y,15,15); //иконка здоровья
        ctx.drawImage(this.image_armor,this.heath_x+50,this.heath_y-3,30,20);
        for (let i=0; i<this.game.ammo;i++)
            ctx.drawImage(this.image_bullets,10+i*6,15,4,10); // патроны
        ctx.font = 'bold 20px Arial';
        ctx.strokeText(this.game.player.heath,40,20);
        ctx.strokeText(this.game.player.armor,110,20);        
    }
}
class Layer{
    constructor(game,image,speedModifier){
        this.game = game;
        this.image = image;
        this.speed = speedModifier;
        this.width = 1600;
        this.height = game.height;
        this.x = 0;
        this.y = 0;
    }   
    update(){
        if (this.x<=-this.width) this.x = 0;
        else this.x -= this.speed;
    }   
    draw(){
        ctx.drawImage(this.image,this.x,this.y);
        ctx.drawImage(this.image,this.x+960,this.y);
    }
}
class Background{
    constructor(game){
        this.game = game;
        this.images=[];
        this.layers = [];
        for (let i=1; i<2;i++){
            this.images.push(new Image());  // добавление изображений
            this.images[i-1].src = `./media/background/Space00${i}.png`;
            this.layers.push(new Layer(game,this.images[i-1],1)); // добавление классов layer
        }    
    }
    update(){
        this.layers.forEach(layer=>layer.update());
    }
    draw(){
        this.layers.forEach(layer=>layer.draw());
    }

}

game = new Game();

function animation(){
    game.update();
    game.draw();   
    requestAnimationFrame(animation);
  }

animation();


