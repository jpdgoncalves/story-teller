
export default class Timer {

    /**
     * 
     * @param {number} timeDelta Time in seconds for each tick 
     */
    constructor(timeDelta) {
        this.lastTimeStamp = 0;
        this.timeAccumulator = 0;
        this.timeDelta = timeDelta * 1000;
        this.started = false;
    }

    /**
     * 
     * @param {number} timeDelta Delta time in miliseconds 
     */
    update(timeDelta) {
        console.log(`${this.lastTimeStamp} ${this.timeAccumulator} ${timeDelta}`);
    }

    start() {
        const update = (time) => {
            if (this.started) {
                this.timeAccumulator += time - this.lastTimeStamp;
                this.lastTimeStamp = time;
                while (this.timeAccumulator > this.timeDelta) {
                    this.update(this.timeDelta);
                    this.timeAccumulator -= this.timeDelta;
                }
                window.requestAnimationFrame(update);
            }
        };
        this.started = true;
        window.requestAnimationFrame(update);
    }

    stop() {
        this.started = false;
    }

}