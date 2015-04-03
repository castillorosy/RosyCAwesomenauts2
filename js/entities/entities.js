// because it is a class it is allowed to have both letters capital
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper();
        this.setPlayerTimers();
        this.setAttributes();
        
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
        this.addAnimation();
//       this helps the animation to mmove the figure while walking
        this.renderable.addAnimation("idle", [78]);
        
    },
    
    setSuper: function (){
        
    },
    setPlayerTimers: function(){
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
    },
    setAttributes: function(){
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
        
    },
    setFlags: function(){
        this.type = "PlayerEntity";
        this.setFlags();      
//        keeps track of which direction your character is going
        this.facing = "right";
        
        this.dead = false;
        
    },
    addAnimation: function(){
      this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        //reach into the constructer of entity  
    },
    
    update: function(delta) {
        this.now = new Date().getTime();
        
        if(this.health <=0){
          this.dead = true;
      }
        if (me.input.isKeyPressed("right")) {
//        sets the position of my x by the velocity defined
//       setVelocity() and multiplying it by me.timer.tick.
//      me.timer.tick makes the movent look smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);


        } else if (me.input.isKeyPressed("left")) {
            this.facing = "left";
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.flipX(false);
        } else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("jump") && !this.jump && !this.falling) {
            this.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }
        if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }
        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                console.log(!this.renderable.isCurrentAnimation);
//                sets the current animation to attack and once that is over
//                  goes back to the idle amnimation
                this.renderable.setCurrentAnimation("attack", "idle");
//               makes it so the next time we start this sequence we begin
//               from the first animation, not wherever we left off
//               switched to another animation 
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        //this if statement will check whats wrong with the character
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
        updaate: function(delta){
            console.log(this.health);
            if(this.health<=0){
            me.game.world.removeChild(this);
        }
        this.now = new Date().getTime();
        
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        if (response.b.type === "EnemyBaseEntity") {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

           console.log("xdif " + xdif + " ydif " + ydif);
            if (ydif < -40 && xdif < 70 && xdif > -35) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if (xdif > -35 && this.facing === 'right' && (xdif < 0)) {
                this.body.vel.x = 0;
                //this.body.x = this.pos.x - 1;
            } else if (xdif < 60 && this.facing === 'left' && xdif > 0) {
                this.body.vel.x = 0;
               // this.pos.x = this.pos.x + 1;
            }
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                console.log("tower Hit");
                this.lastHit = this.now;
//                if the creeps health is less than our attack, execute code in if statement
                if(response.b.health <= game.data.playerAttack){
//                  adds one gold for a creep kill
                    game.data.gold +=1;
                    console.log("Current gold:" + game.data.gold);
                }
                response.b.loseHealth(game.data.playerAttack);
            }
        }
    }
});