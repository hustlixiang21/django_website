class MutiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://strivelee.com/wss/mutiplayer/");
        this.uuid = null;

        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        // Receive messages from the server
        let outer = this;

        // When the server sends a message, the client receives and processes it
        this.ws.onmessage = function (e) {
            let data = JSON.parse(e.data); // Parse the message sent by the server
            let uuid = data.uuid;
            // If the uuid of the message is the same as the uuid of the client,
            // It means that the message is sent by the client itself, so it is not processed
            if (uuid === outer.uuid) return false;

            let event = data.event;

            // this.players.push(new Player(this, this.width / 2 / this.scale, this.height / 2 / this.scale, this.height * 0.05 / this.scale, "white", this.height * 0.30 / this.scale, "me", this.root.settings.username, this.root.settings.photo));
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            }
            else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            }
            else if (event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            }
        };
    }

    get_player(uuid) {
        // Get the player object by uuid
        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i].uuid === uuid) {
                return this.playground.players[i];
            }
        }
    }

    send_create_player(username, photo) {
        // Send a message to the server for others to create you with some information
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo) {
        // Receive a message from the server to create another player with some information
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            this.playground.height / 2 / this.playground.scale,
            this.playground.height * 0.05 / this.playground.scale,
            "white",
            this.playground.height * 0.30 / this.playground.scale,
            "enemy",
            username,
            photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx, ty) {
        // Send a message to the server to move the player to a certain position
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_move_to(uuid, tx, ty) {
        // Receive a message from the server to move the other player to a certain position
        let player = this.get_player(uuid);

        // if the player is not found, oversee it
        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        // Send a message to the server to shoot a fireball
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        // Receive a message from the server to shoot a fireball
        let player = this.get_player(uuid);

        // if the player is not found, oversee it
        if (player) {
            let fireball = player.shoot_fireball(tx, ty, ball_uuid);
            fireball.uuid = ball_uuid;
        }
    }
}