class TGame {
    constructor(elem, width = 1280, height = 720) {
        let canvas = document.createElement('canvas')
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        let element = document.getElementById(elem)
        if(element) {
            element.appendChild(canvas)
        }
    }
}

new TGame('game')