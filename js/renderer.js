class TRenderer {
    constructor(elem, width, height, countX, countY, backgroundColor = 'rgb(165 202 158)', positionColorR = 208, positionColorG = 65, positionColorB = 65, markXColor = 'rgb(255, 0, 0)', markOColor = 'rgb(255, 255, 0)') {
        let canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        //canvas.style.backgroundColor = backgroundColor
        let element = document.getElementById(elem)
        if (element) {
            this.canvas = canvas
            element.appendChild(canvas)
        } else {
            console.log(`Element "${elem}" does not exist`)
        }
        canvas.addEventListener('click', () => {
            this.context.beginPath()
            this.context.moveTo(0, 0)
            this.context.lineTo(this.countX * this.size1, this.countY * this.size1)
            this.context.stroke()
        })
        this.context = this.canvas.getContext("2d")
        this.context.fillStyle = backgroundColor

        let margin = 100
        let xratio = Math.floor((width - margin) / countX)
        let yratio = Math.floor((height - margin) / countY)
        let ratio = xratio / yratio
        if (ratio > 1) {
            this.size1 = yratio
        } else {
            this.size1 = xratio
        }
        this.countX = countX
        this.countY = countY
        this.width = width
        this.height = height

        this.hide()

        this.markXColor = markXColor
        this.markOColor = markOColor 

        this.positionColorR = positionColorR
        this.positionColorG = positionColorG
        this.positionColorB = positionColorB
        this.positionAlpha = 1
        this.positionAlphaDelta = 0.1
        this.positionAlphaDeltaSign = -1

        setInterval(this.changePositionAlpha.bind(this), 100)
    }
    changePositionAlpha() {
        this.positionAlpha += this.positionAlphaDelta * this.positionAlphaDeltaSign
        if (this.positionAlpha <= 0) {
            this.positionAlpha = 0
            this.positionAlphaDeltaSign = 1
        }
        if (this.positionAlpha >= 1) {
            this.positionAlpha = 1
            this.positionAlphaDeltaSign = -1
        }
    }
    show() {
        if (this.canvas) this.canvas.style.display = 'block'
    }
    hide() {
        if (this.canvas) this.canvas.style.display = 'none'
    }
    clearField() {
        this.context.fillRect(0, 0, this.width, this.height)
    }
    drawField() {
        this.context.strokeStyle = 'rgb(0,0,0)'
        this.context.lineWidth = 1
        this.context.beginPath()
        for (let i = 0; i <= this.countX; i++) {
            this.context.moveTo(i * this.size1, 0)
            this.context.lineTo(i * this.size1, this.countY * this.size1)
        }
        for (let i = 0; i <= this.countY; i++) {
            this.context.moveTo(0, i * this.size1)
            this.context.lineTo(this.countX * this.size1, i * this.size1)
        }
        this.context.stroke()
    }
    drawPosition(x, y) {
        this.context.strokeStyle = `rgb(${this.positionColorR}, ${this.positionColorG}, ${this.positionColorB}, ${this.positionAlpha})`
        this.context.lineWidth = 2
        this.context.beginPath()
        this.context.moveTo(x * this.size1 + 5, y * this.size1 + this.size1 / 2)
        this.context.lineTo((x + 1) * this.size1 - 5, y * this.size1 + this.size1 / 2)
        this.context.moveTo(x * this.size1 + this.size1 / 2, y * this.size1 + 5)
        this.context.lineTo(x * this.size1 + this.size1 / 2, (y + 1) * this.size1 - 5)
        this.context.stroke()
    }
    drawMark(x, y, mark) {
        if (mark) {
            this.context.strokeStyle = this.markXColor
            this.context.lineWidth = 5
            this.context.beginPath()
            this.context.moveTo(x * this.size1 + 5, y * this.size1 + 5)
            this.context.lineTo((x + 1) * this.size1 - 5, (y + 1) * this.size1  - 5)
            this.context.moveTo(x * this.size1 + 5, (y + 1) * this.size1 - 5)
            this.context.lineTo((x + 1) * this.size1 - 5, y * this.size1 + 5)
            this.context.stroke()
        } else {
            this.context.strokeStyle = this.markOColor
            this.context.lineWidth = 5
            this.context.beginPath()
            this.context.arc(x * this.size1 + this.size1 / 2, y * this.size1 + this.size1 / 2, this.size1 / 3, 0, 2 * Math.PI);
            this.context.stroke()
        }
    }
}