class TModal extends TStage {
    constructor (title, questionFunction, okFunction, cancelFunction, okText = 'Да', cancelText = 'Нет') {
        super()
        this.title = title
        this.question = questionFunction
        this.okText = okText
        this.cancelText = cancelText
        this.okFunction = okFunction
        this.cancelFunction = cancelFunction
        this.create()
    }
    create() {
        let wrapper = document.createElement('div')
        wrapper.classList.add('modal')
        
        let titleWrapper = document.createElement('div')
        titleWrapper.classList.add('title')
        let titleElement = document.createElement('span')
        titleElement.innerHTML = this.title
        titleWrapper.appendChild(titleElement)

        let questionWrapper = document.createElement('div')
        questionWrapper.classList.add('question')
        let questionElement = document.createElement('span')
        questionElement.innerHTML = this.question()
        this.questionElement = questionElement
        questionWrapper.appendChild(questionElement)
        
        let buttonsWrapper = document.createElement('div')
        buttonsWrapper.classList.add('buttons')
        let okButton = document.createElement('button')
        okButton.classList.add('ok')
        okButton.innerHTML = this.okText
        okButton.addEventListener('click', () => {
            if(this.okFunction && typeof this.okFunction === 'function') this.okFunction()
            this.hide()
        })
        buttonsWrapper.appendChild(okButton)
        let cancelButton = document.createElement('button')
        cancelButton.classList.add('cancel')
        cancelButton.innerHTML = this.cancelText
        cancelButton.addEventListener('click', () => {
            if(this.cancelFunction && typeof this.cancelFunction === 'function') this.cancelFunction()
            this.hide()
        })
        buttonsWrapper.appendChild(cancelButton)

        wrapper.appendChild(titleWrapper)
        wrapper.appendChild(questionWrapper)
        wrapper.appendChild(buttonsWrapper)

        document.body.appendChild(wrapper)
        
        this.wrapper = wrapper
        this.hide()
    }
    updateQuestion() {
        this.questionElement.innerHTML = this.question()
    }
    hide() {
        this.wrapper.style.display = 'none'
    }
    show() {
        this.wrapper.style.display = 'block'
    }
    destroy() {
        if(this.wrapper) this.wrapper.remove()
    }
}