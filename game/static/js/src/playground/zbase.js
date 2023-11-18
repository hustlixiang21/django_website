class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="ac-game-playground"></div>
        `);
        this.hide();
        this.root.$ac_game.append(this.$playground);

        this.start();
    }

    restrict() // 把小球的初始位置限定在画面内
    {
        let random = Math.random();
        while (random < 0.05 || random > 0.95) {
            random = Math.random();
        }
        return random;
    }

    get_random_color() {
        let colors = ["deepskyblue", "yellow", "Lime", "deeppink", "fuchsia", "red", "aqua", "coral", "gold"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    start() {
        let outer = this;
        $(window).resize(function () {
            outer.resize();
        });
    }

    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if (this.game_map) this.game_map.resize();
    }

    show(mode) { // 显示playground界面
        let outer = this;
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.resize();

        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, this.height / 2 / this.scale, this.height * 0.05 / this.scale, "white", this.height * 0.30 / this.scale, "me", this.root.settings.username, this.root.settings.photo));


        this.mode = mode; // single mode or multi mode
        if (mode === "single mode") {
            for (let i = 0; i < 5; i++) {
                this.players.push(new Player(this, this.width * this.restrict() / this.scale, this.height * this.restrict() / this.scale, this.height * 0.05 / this.scale, this.get_random_color(), this.height * 0.30 / this.scale, "robot"));
            }
        }
        else if (mode === "multi mode") {
            this.mps = new MutiPlayerSocket(this); // Create a socket for a multiplayer game
            this.mps.uuid = this.players[0].uuid;  // Set the uuid of the socket to the uuid of the player

            this.mps.ws.onopen = function () {
                // use the api to create a player with a username and avatar
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
        }
    }

    hide() { // 隐藏playground界面
        this.$playground.hide();
    }
}
