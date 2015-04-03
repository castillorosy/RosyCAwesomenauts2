game.GameManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();
        if(game.data.player.dead){
        me.game.world.removeChild(game.data.player);    
        me.state.current().resetPlayer(10, 0);
        }
        
        if (Math.round(this.now / 1000 % 20 === 0 && (this.now - this.lastCreep >= 1000))) {
            game.data.gold += 1;
            console.log("Current gold: " + game.data.gold);
        }
        
        if (Math.round(this.now / 1000 % 10 === 0 && (this.now - this.lastCreep >= 1000))) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.worl.addChild(creepe, 5);
        }
        return true;
    }
});
//not much is going to hapen set behide the scences 