game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "creep1",
                width: 32,
                height: 64,
                spritewidth: "32",
                spriteheight: "64",
                getShape: function() {
                    return (new me.Rect(0, 0, 32, 64)).toPolygon();
                }

            }]);
        this.health = game.data.enemyCreepHealth;
        this.alwaysUpdate = true;
//        this.attacking lets us know if the enemy is currently attacking 
        this.attacking = false;
//        keeps track of whenour creep hit anything
        this.lastAttaacking = new Date().getTime;
//        keep track of the last time our creep hit anything 
        this.lastHit = new Date().getTime();
        this.now = new Date.getTime();
        this.body.setVelocity(3, 20);

        this.type = "EnemyCreep";

        this.renderable.AddAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
    },
    update: function(delta) {
        this.now = new Date().getTime();

        me.collision.check(this, true, this, this.collideHandler.bind(this), true);

        this.body.vel.x -= this.body.accel.x * me.timer.tick;
//        this helps get the character walking


        this.body.update(delta);



        this._super(me.Entity, "update", [delta]);

        return true;
    },
    collideHandler: function(response) {
        if (response.b.type === 'PlayerBase') {
            this.attacking = true;
//         this.lastAttacking=this.now;
            this.body.vel.x = 0;
//        keeps moving the creep to the right to maintain its position
            this.pos.x = this.pos.x + 1;
//         chacks that it has been at least 1 second since this creep hit base
            if ((this.now - this.lastMit >= 1000)) {
//       update the last hit timer
                this.lastHit = this.now;
//        makes the player base calls its losehealth function and passes
//        damaage of 1
                response.b.loseHealth(game.data.enemyCreepAttack);

            }
        } else if (response.b.type === 'PlayerEntity') {
            var xdif = this.pos.x - response.b.pos.x;
            this.attacking = true;
//         this.lastAttacking=this.now;


            if (xdif > 0) {
                this.pos.x = this.pos.x + 1;
                this.body.vel.x = 0;
//        keeps moving the creep to the right to maintain its position
            }
//         chacks that it has been at least 1 second since this creep hit something
            if ((this.now - this.lastMit >= 1000 && xdif > 0)) {
//       update the last hit timer
                this.lastHit = this.now;
//        makes the player calls its losehealth function and passes
//        damaage of 1
                response.b.loseHealth(game.data.enemyCreepAttack);

            }
        }
    }
});
