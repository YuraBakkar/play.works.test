class TStage {
    constructor() {
        this.type = 'stage'
    }
    show() {
        console.error('Need to define method show()!')
    }
    hide() {
        console.error('Need to define method hide()!')
    }
}

class TStages {
    constructor(stages) {
        this.stages = []
        this.stageIndex = 0
        if (Array.isArray(stages)) {
            stages.forEach(stage => {
                if (stage && stage.type === 'stage') this.stages.push(stage)
            })
        }
        this.show()
    }
    next() {
        if (this.stages.length) {
            this.stages[this.stageIndex].hide()
            this.stageIndex++
            if (this.stageIndex > this.stages.length - 1) this.stageIndex = 0
            this.show()
        }
    }
    show() {
        if (this.stages.length) this.stages[this.stageIndex].show()
    }
}