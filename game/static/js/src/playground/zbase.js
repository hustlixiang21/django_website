class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="ac-game-playground"></div>
        `);
        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.30, true));

        for(let i = 0; i < 5; i++)
        {
            this.players.push(new Player(this, this.width * this.restrict(), this.height * this.restrict(), this.height * 0.05, this.get_random_color(), this.height * 0.30, false))
        }

        this.start()
    }

    restrict() // 把小球的初始位置限定在画面内
    {
        let random = Math.random();
        while (random < 0.05 || random > 0.95) {
            random = Math.random();
        }
        return random;
    }

    get_random_color()
    {
        let colors = ["deepskyblue", "yellow", "Lime", "deeppink", "fuchsia", "red", "aqua", "coral", "gold"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    start() {

    }

    show() { // 显示playground界面
        this.$playground.show();
    }

    hide() { // 隐藏playground界面
        this.$playground.hide();
    }
}
