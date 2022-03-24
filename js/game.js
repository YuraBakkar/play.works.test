class TGame extends TStage {
    constructor(element, width, height, countX, countY, victoryLineLength, undoEmptyMoves) {
        super()
        this.undoEmptyMoves = undoEmptyMoves
        this.countX = countX
        this.countY = countY
        this.victoryLineLength = victoryLineLength
        this.renderer = new TRenderer(element, width, height, countX, countY)

        document.addEventListener('keydown', (evt) => {
            if (!this.play && this.move) return
            //console.log(evt.key, this.positionX, this.positionY)
            switch (evt.key) {
                case 'ArrowLeft':
                    this.positionX--
                    if (this.positionX < 0) this.positionX = this.countX - 1
                    break
                case 'ArrowRight':
                    this.positionX++
                    if (this.positionX > this.countX - 1) this.positionX = 0
                    break
                case 'ArrowUp':
                    this.positionY--
                    if (this.positionY < 0) this.positionY = this.countY - 1
                    break
                case 'ArrowDown':
                    this.positionY++
                    if (this.positionY > this.countY - 1) this.positionY = 0
                    break
                case 'Enter':
                case ' ':
                    if (!this.victory) {
                        this.move = true
                        this.setMark(this.positionX, this.positionY)
                        this.computerMove()
                    }
                    break
                case 'Backspace':
                    if (!this.victory) {
                        this.move = true
                        this.undoMove()
                    } else {
                        this.exit()
                    }
                    break
            }
        })
    }
    clear() {
        this.positionX = Math.floor(this.countX / 2)
        this.positionY = Math.floor(this.countY / 2)
        this.map = new Array(this.countX).fill(undefined).map(() => new Array(this.countY).fill(undefined));
        this.currentMark = true //cross, false - zero
        this.moves = []
        this.play = true
        this.victory = false
        this.score = undefined

        this.buildChains()

        this.computerFirstPlay = !!Math.floor(Math.random() * 2)
        if (this.computerFirstPlay) {
            this.move = true
            this.computerMove()
        }
        this.texts = [`Игрок: ${this.computerFirstPlay ? 'O' : 'X'}`, `Компьютер: ${this.computerFirstPlay ? 'X' : 'O'}`, '  ']
    }
    show() {
        this.clear()
        this.renderer.show()
        this.draw()
    }
    hide() {
        this.play = false
        this.renderer.hide()
    }
    draw() {
        this.renderer.clearField()
        this.renderer.drawField()
        for (let i = 0; i < this.countX; i++) {
            for (let j = 0; j < this.countY; j++) {
                if (this.map[i][j] !== undefined) this.renderer.drawMark(i, j, this.map[i][j])
            }
        }
        this.renderer.drawPosition(this.positionX, this.positionY)
        this.renderer.drawTexts(this.texts)
        if (this.play) requestAnimationFrame(this.draw.bind(this))
    }
    setMark(x, y) {
        if (this.map[x][y] === undefined) {
            this.moves.push({ x, y })
            this.map[x][y] = this.currentMark
            this.currentMark = !this.currentMark

            this.checkVictory(x, y)
        }
    }
    exit() {
        this.hide()
        this.undoEmptyMoves(this.score)
    }
    undoMove() {
        if (!this.moves.length) {
            if (this.undoEmptyMoves && typeof this.undoEmptyMoves === 'function') {
                this.exit()
            }
        } else {
            if (this.moves.length > 1) {
                let move = this.moves.pop()
                this.map[move.x][move.y] = undefined
                this.checkVictory(move.x, move.y)
                move = this.moves.pop()
                this.map[move.x][move.y] = undefined
                this.checkVictory(move.x, move.y)
                //this.currentMark = !this.currentMark
            }
            this.move = false
        }
    }
    showVictory(mark) {
        this.victory = true
        let message
        switch (mark) {
            case this.computerFirstPlay:
                message = 'победил компьютер'
                this.score = 0
                break;
            case undefined:
                message = 'ничья'
                this.score = -1
                break;
            default:
                message = 'победил игрок'
                this.score = 1
        }
        this.texts.push(message, 'нажмите для продолжения "backspace"')
    }
    //for map nxnxn
    buildChains() {
        this.chains = []
        if (this.countX != this.countY && this.countX != this.victoryLineLength) return

        let line3 = [], line4 = []
        for (let x = 0; x < this.countX; x++) {
            let line1 = [], line2 = []
            for (let y = 0; y < this.countY; y++) {
                line1.push({ x, y })
                line2.push({ x: y, y: x })
            }
            this.chains.push(line1)
            this.chains.push(line2)
            line3.push({ x, y: x })
            line4.push({ x, y: this.countX - x - 1 })
        }
        this.chains.push(line3)
        this.chains.push(line4)
        //console.log(this.chains)
    }
    computerMove() {
        let x = 1, y = 1
        if (!this.moves.length) {
            x = Math.floor(this.countX / 2)
            y = Math.floor(this.countY / 2)
        } else {
            if (this.moves.length == 1) {
                x = Math.floor(this.countX / 2)
                y = Math.floor(this.countY / 2)
                if (this.map[x][y] !== undefined) {
                    let variants = [
                        { x: x - 1, y: y + 1 },
                        { x: x - 1, y: y - 1 },
                        { x: x + 1, y: y - 1 },
                        { x: x + 1, y: y + 1 },
                    ]
                    let index = random(variants.length)
                    x = variants[index].x
                    y = variants[index].y
                }
            } else {
                let victoryChains = this.chains.filter(chain => {
                    let a = !chain.find(cell => cell.value === !this.computerFirstPlay)
                    let b = chain.reduce((sum, cell) => {
                        if (cell.value === this.computerFirstPlay) return sum + 1
                        else return sum
                    }, 0) == this.victoryLineLength - 1
                    return a && b
                })
                if (victoryChains.length) {
                    let victoryChain = victoryChains[random(victoryChains.length)]
                    let cell = victoryChain.find(cell => cell.value === undefined)
                    //this.setMark(x, y)
                    x = cell.x
                    y = cell.y
                } else {
                    let humanVictoryChains = this.chains.filter(chain => {
                        let a = !chain.find(cell => cell.value === this.computerFirstPlay)
                        let b = chain.reduce((sum, cell) => {
                            if (cell.value === !this.computerFirstPlay) return sum + 1
                            else return sum
                        }, 0) == this.victoryLineLength - 1
                        return a && b
                    })
                    if (humanVictoryChains.length) {
                        let victoryChain = humanVictoryChains[random(victoryChains.length)]
                        let cell = victoryChain.find(cell => cell.value === undefined)
                        //this.setMark(x, y)
                        x = cell.x
                        y = cell.y
                    } else {
                        let chains = this.chains.filter(chain => {
                            let a = !chain.find(cell => cell.value === !this.computerFirstPlay)
                            return a
                        })
                        if (chains.length) {
                            let chain = chains[random(chains.length)]
                            let cells = chain.filter(cell => cell.value === undefined)
                            let cell = cells[random(cells.length)]
                            //this.setMark(x, y)
                            x = cell.x
                            y = cell.y
                        } else {
                            let chains = this.chains.filter(chain => {
                                let a = chain.find(cell => cell.value === undefined)
                                return a
                            })
                            if (chains) {
                                let chain = chains[random(chains.length)]
                                if (chain) {
                                    let cells = chain.filter(cell => cell.value === undefined)
                                    let cell = cells[random(cells.length)]
                                    //this.setMark(x, y)
                                    x = cell.x
                                    y = cell.y
                                }
                            }
                        }
                    }
                }
            }
        }
        if (this.map[x][y] === undefined)
            this.setMark(x, y)
        this.move = false
    }
    checkVictory(x, y) {
        let mark = this.map[x][y]
        for (let i = 0; i < this.chains.length; i++) {
            let chain = this.chains[i]
            let index = chain.findIndex(cell => cell.x == x && cell.y == y)
            if (index >= 0) {
                chain[index].value = mark
                let isAnotherMark = !!chain.find(cell => cell.value === !mark)
                if (isAnotherMark) {
                    console.log('bad chain')
                }
                let isEmptyMarks = !!chain.find(cell => cell.value === undefined)
                if (!isAnotherMark && !isEmptyMarks) {
                    this.showVictory(mark)
                    return
                }
            }
        }
        if (!this.chains.find(chain => chain.find(cell => cell.value === undefined))) {
            this.showVictory()
        }
    }
}