class MutiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app5745.acapp.acwing.com.cn/wss/mutiplayer/");
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
        };
    }
    
    send_create_player(username, photo) {
        // Send a message to the server to create a player with some information
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo) {
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
}