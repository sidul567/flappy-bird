//SELECT CVS

let cvs = document.getElementById('game')
let ctx = cvs.getContext('2d')

//GAME VARIABLE AND CONSTANT

let frames = 0
let DEGREE = Math.PI/180;

hack = prompt("Type 1")
//LOAD IMAGE

let sprite = new Image()
sprite.src = "img/sprite.png"

//AUDIO

let swooshing = new Audio
swooshing.src = "music/sfx_swooshing.wav"
swooshing.volume = 0.1

let flap = new Audio
flap.src = "music/sfx_flap.wav"
flap.volume = 0.1

let die = new Audio
die.src = "music/sfx_die.wav"
die.volume = 0.1

let hit = new Audio
hit.src = "music/sfx_hit.wav"
hit.volume = 0.1

let point = new Audio
point.src = "music/sfx_point.wav"
point.volume = 0.1

//GAME STATE

let state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

let startBtn = {
    x : 120,
    y : 263,
    w : 83,
    h : 29
}

cvs.addEventListener('click',(e)=>{
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            swooshing.play()
            break;
        case state.game : 
            bird.flap();
            flap.play()
            break;
        case state.over :
            let rect = cvs.getBoundingClientRect()
            let clickX = e.clientX - rect.left
            let clickY = e.clientY - rect.top
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y+startBtn.h){
                bird.speed = 0
                pipes.position = []
                score.value = 0
                state.current = state.getReady;
            }
            break;
    }
})

//BG

let bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,

    draw : function(){
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h)
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h)
    }
}

//FOREGROUND

let fg = {
    sX : 276,
    sY : 0,
    w : 224,
    h : 112,
    x : 0,
    dx : 2,
    y : cvs.height - 112,

    draw : function(){
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h)
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h)
    },

    update : function(){
        if(state.current==state.game){
            this.x = (this.x-this.dx)%(this.w/2)
        }  
    }
}

//BIRD

let bird = {
    animation : [
        {sX : 276,sY:112},
        {sX : 276,sY:139},
        {sX : 276,sY:164},
        {sX : 276,sY:139}
    ],
    w : 34,
    h : 26,
    x : 50,
    y : 150,
    radius  : 12,
    frame : 0,
    speed : 0,
    gravity : 0.25,
    jump : 4.6,
    rotation : 0,
    draw : function(){
        let bird = this.animation[this.frame]
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite,bird.sX,bird.sY,this.w,this.h,-this.w/2,-this.h/2,this.w,this.h)
        ctx.restore()
    },

    flap : function(){
        this.speed = -this.jump;
    },

    update : function(){
        this.period = state.current===state.getReady?10:5;
        this.frame += frames%this.period===0?1:0;
        this.frame %= this.animation.length;
        if(state.current===state.getReady){
            this.y = 150
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            if(this.y+this.h/2 >= cvs.height-fg.h){
                this.y = cvs.height-fg.h-this.h/2;
                if(state.current==state.game){
                    state.current = state.over;
                    die.play()
                }
            }
            if(this.speed>=this.jump){
                this.rotation = 90 * DEGREE;
            }else{
                this.rotation = -25 * DEGREE;
            }
        }
    }
}

//PIPES

let pipes = {
    position : [],
    top : {
        sX : 553,
        sY : 0
    },
    bottom : {
        sX : 502,
        sY : 0
    },
    w : 53,
    h : 400,
    gap : 140,
    maxYPos : -180,
    dx : 2,

    draw : function(){
        for(let i=0;i<this.position.length;i++){
            let p = this.position[i]

            let topYPos = p.y
            let bottomYPos = p.y + this.h + this.gap

            ctx.drawImage(sprite,this.top.sX,this.top.sY,this.w,this.h,p.x,topYPos,this.w,this.h)

            ctx.drawImage(sprite,this.bottom.sX,this.bottom.sY,this.w,this.h,p.x,bottomYPos,this.w,this.h)
        }
    },

    update : function(){
        if(state.current!==state.game)return;
        if(frames%100==0){
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * (Math.random()+1)
            })
        }
        for(let i=0;i<this.position.length;i++){
            let p = this.position[i];

            let bottomPipeYPos = p.y+this.h+this.gap

            if(bird.x+bird.radius > p.x && bird.x-bird.radius < p.x+this.w && bird.y+bird.radius > p.y && bird.y-bird.radius < p.y + this.h){
                if(hack==1){
                    ;
                }else{
                    state.current = state.over
                    hit.play()
                }          
            }

            if(bird.x+bird.radius > p.x && bird.x-bird.radius < p.x+this.w && bird.y+bird.radius > bottomPipeYPos && bird.y-bird.radius < bottomPipeYPos + this.h){
                if(hack==1){
                    ;
                }else{
                    state.current = state.over
                    hit.play()
                }  
            }

            p.x -= this.dx
            if(p.x+this.w <= 0){
                this.position.shift()

                score.value += 1
                point.play()
                score.best = Math.max(score.value,score.best)
                localStorage.setItem("best",score.best)
            }
        }
    }
}

//GET READY

let getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : 80,

    draw : function(){
        if(state.current==state.getReady){
            ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h)
        } 
    }
}

//GAME OVER

let gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 90,

    draw : function(){
        if(state.current==state.over){
            ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h)
        } 
    }
}

//SCORE

let score = {
    value : 0,
    best : parseInt(localStorage.getItem("best"))||0,

    draw : function(){
        ctx.fillStyle = "#fff"
        ctx.strokeStyle = "#000"

        if(state.current == state.game){
            ctx.linewidth = 10
            ctx.font = "35px Teko"
            ctx.fillText(this.value,cvs.width/2,50)
            ctx.strokeText(this.value,cvs.width/2,50)
        }else if(state.current == state.over){

            ctx.fillStyle = "#000"
            ctx.font = "25px Teko"
           
            ctx.fillText(this.value,225,186)
            ctx.strokeText(this.value,225,186)

            ctx.fillText(this.best,225,228)
            ctx.strokeText(this.best,225,228)
        }
    }
}

//DRAW
function draw(){
    ctx.fillStyle = "#70c5ce"
    ctx.fillRect(0,0,cvs.width,cvs.height)

    bg.draw()
    pipes.draw()
    fg.draw()
    bird.draw()
    getReady.draw()
    gameOver.draw()
    score.draw()
}

//UPDATE

function update(){
    bird.update()
    fg.update()
    pipes.update()
}

//LOOP

function loop(){
    update();
    draw();
    frames++;
    requestAnimationFrame(loop)
}
loop()
