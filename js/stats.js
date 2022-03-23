class TStatistics {
    constructor() {
        this.victories = 0
        this.defeats = 0
        this.draws = 0
        this.gameCount = 0
        this.text = 'Вы хотите сыграть в игру?'
    }
    score(score) {
        if(score !== undefined) {
            this.gameCount++
            if (score == 1) this.victories++
            else if(score == 0) this.defeats++
            else this.draws++
        }
        this.prepareText()
    }
    prepareText() {
        this.text = `
            Всего сыграно ${this.gameCount}<br>
            побед: ${this.victories}, поражений: ${this.defeats}, ничьи: ${this.draws}<br><br>
            Вы хотите сыграть в игру ещё?
        `
    }
    getText() {
        return this.text
    }
}