class TGame extends TStage {
    constructor(element, width, height, countX, countY, victoryLineLength, undoEmptyMoves) {
        super()
        this.undoEmptyMoves = undoEmptyMoves
        this.countX = countX
        this.countY = countY
        this.positionX = Math.floor(countX / 2)
        this.positionY = Math.floor(countY / 2)
        this.victoryLineLength = victoryLineLength
        this.renderer = new TRenderer(element, width, height, countX, countY)

        this.map = new Array(countX).fill(undefined).map(() => new Array(countY).fill(undefined));
        this.currentMark = true //krestik
        this.moves = []

        document.addEventListener('keydown', (evt) => {
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
                    this.setMark()
                    break
                case 'Backspace':
                    this.undoMove()
                    break
            }
        })
    }
    show() {
        this.renderer.show()
        this.draw()
    }
    hide() {
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
        requestAnimationFrame(this.draw.bind(this))
    }
    setMark() {
        if (this.map[this.positionX][this.positionY] === undefined) {
            this.moves.push({
                x: this.positionX,
                y: this.positionY
            })
            this.map[this.positionX][this.positionY] = this.currentMark
            this.currentMark = !this.currentMark
        }
    }
    undoMove() {
        if (!this.moves.length) {
            if(this.undoZeroMoves && typeof this.undoZeroMoves === 'function') {
                this.hide()
                this.undoEmptyMoves()
            }
        } else {
            let { x, y } = this.moves.pop()
            this.map[x][y] = undefined
            this.currentMark = !this.currentMark
        }
    }
}