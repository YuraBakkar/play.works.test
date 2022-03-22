class TManageGame{
    constructor(elem, width = 1280, height = 720, countX = 3, countY = 3, victoryLineLength = 3, urlOut = 'https://google.com') {
        //this.render = new TRenderer(elem, width, height)
        this.urlOut = urlOut
        //start
        this.stats = new TStatistics
        this.stages = new TStages([
            new TModal('Крестики-нолики', this.stats.getText.bind(this.stats), this.startGame.bind(this), this.cancelGame.bind(this)),
            new TGame(elem, width, height, countX, countY, victoryLineLength, this.stopGame.bind(this))
        ])
    }

    startGame() {
        this.stages.next()
        /*this.stats.victory()
        this.stages.stages[0].updateQuestion()
        setTimeout(this.stages.next.bind(this.stages), 2000)*/
    }

    stopGame() {
        this.stages.next()
    }

    cancelGame() {
        window.location.href = this.urlOut
    }
}

new TManageGame('game')