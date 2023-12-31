class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start() {

    }

    update() {
        if (this.move_length < this.eps || this.x < 0 || this.x > this.playground.width || this.y < 0 || this.y > this.playground.height) {
            this.destroy();
            return false;
        }

        this.update_move();
        this.fireball_collision();
        
        // 判断放在自己的窗口里，敌人不进行判断
        if (this.player.character !== "enemy") {
            this.update_attack();
        }

        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    fireball_collision() {
        // fireball collides with other fireballs, it will destroy both of them
        for (let i = 0; i < AC_GAME_OBJECTS.length; i++)
        {
            let gameobject = AC_GAME_OBJECTS[i];
            if (gameobject instanceof FireBall && this !== gameobject && this.is_collision(gameobject))
            {
                this.destroy();
                gameobject.destroy();
                for (let i = 0; i < 10 + Math.random() * 10; i ++ ) {
                    let x = (this.x + gameobject.x) / 2, y = (this.y + gameobject.x) / 2;
                    let radius = this.radius * Math.random() * 0.5;
                    let angle = Math.PI * 2 * Math.random();
                    let v_x = Math.cos(angle), v_y = Math.sin(angle);
                    let color = this.color;
                    let speed = this.speed * 10;
                    let move_length = this.radius * Math.random() * 10;
                    new Particle(this.playground, x, y, radius, v_x, v_y, color, speed, move_length);
                }
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(obj) {
        let distance =  this.get_dist(this.x, this.y, obj.x, obj.y);
        return distance < this.radius + obj.radius;

    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);

        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }

        this.destroy();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let fireballs = this.player.fireballs;
        for (let i = 0; i < fireballs.length; i ++ ) {
            if (fireballs[i] === this) {
                fireballs.splice(i, 1);
                break;
            }
        }
    }
}
