class TStatistics {
    constructor() {
        this.victories = 0
        this.defeats = 0
        this.gameCount = 0
        this.text = 'Вы хотите сыграть в игру?'
    }
    victory() {
        this.victories++
        this.gameCount++
        this.prepareText()
    }
    defeat() {
        this.defeats++
        this.gameCount++
        this.prepareText()
    }
    prepareText() {
        this.text = `
            Всего сыграно ${this.gameCount}<br>
            побед: ${this.victories}, поражений: ${this.defeats}<br><br>
            Вы хотите сыграть в игру ещё?
        `
    }
    getText() {
        return this.text
    }
}