class TManageGame{
    constructor(elem, adElem, width = 1280, height = 720, countX = 3, countY = 3, victoryLineLength = 3, urlOut = 'https://google.com') {
        //this.render = new TRenderer(elem, width, height)
        this.urlOut = urlOut
        //start
        this.stats = new TStatistics
        this.stages = new TStages([
            new TModal('Крестики-нолики', this.stats.getText.bind(this.stats), this.nextStage.bind(this), this.cancelGame.bind(this)),
            new TGoogleIMA(adElem, width, height, this.nextStage.bind(this)),
            new TGame(elem, width, height, countX, countY, victoryLineLength, this.stopGame.bind(this))
        ])
    }

    nextStage() {
        this.stages.next()
        /*this.stats.victory()
        this.stages.stages[0].updateQuestion()
        setTimeout(this.stages.next.bind(this.stages), 2000)*/
    }

    stopGame(score) {
        this.stats.score(score)
        this.stages.stages[0].updateQuestion()
        this.stages.next()
    }

    cancelGame() {
        window.location.href = this.urlOut
    }
}

new TManageGame('game', 'ads')