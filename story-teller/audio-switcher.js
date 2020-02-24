export default class AudioSwitcher {

    /**
     * 
     * @param {number} transitionTime Transition time between 2 songs
     */
    constructor(transitionTime = 5) {
        this.transitionTime = transitionTime * 1000;
        /**
         * @type {Object.<string, HTMLAudioElement>}
         */
        this.audios = {};
        /**
         * @type {HTMLAudioElement}
         */
        this.currentlyPlaying = undefined;
        this.switching = false;
    }

    /**
     * 
     * @param {string} name 
     * @param {HTMLAudioElement} audio 
     */
    addAudio(name, audio) {
        this.audios[name] = audio;
        audio.loop = true;
    }

    play(name) {
        if (!this.currentlyPlaying) {
            this.currentlyPlaying = this.audios[name];
            this.currentlyPlaying.play();
        } else if(!this.switching) {
            const previousVolume = this.currentlyPlaying.volume;
            const smoothLowering = () => {
                if(this.currentlyPlaying.volume != 0) {
                    setTimeout(() => {
                        const currentVolume = this.currentlyPlaying.volume - 0.01;
                        this.currentlyPlaying.volume = currentVolume < 0 ? 0 : currentVolume;
                    }, 0.01 * this.transitionTime);
                } else {
                    this.currentlyPlaying.pause();
                    this.currentlyPlaying.currentTime = 0;
                    this.currentlyPlaying.volume = previousVolume;
                    this.currentlyPlaying.onvolumechange = undefined;
                    
                    this.currentlyPlaying = this.audios[name];
                    this.currentlyPlaying.volume = previousVolume;
                    this.currentlyPlaying.play();

                    this.switching = false;
                    this.onSwitchEnd();
                }
            }
            this.currentlyPlaying.onvolumechange = smoothLowering;
            this.currentlyPlaying.volume -= 0.01;
        }
    }

    stopCurrentlyPlaying() {
        if(this.currentlyPlaying) {
            const previousVolume = this.currentlyPlaying.volume;
            const smoothLowering = () => {
                if(this.currentlyPlaying.volume != 0) {
                    setTimeout(() => {
                        const currentVolume = this.currentlyPlaying.volume - 0.01;
                        this.currentlyPlaying.volume = currentVolume < 0 ? 0 : currentVolume;
                    }, 0.01 * this.transitionTime);
                } else {
                    this.currentlyPlaying.pause();
                    this.currentlyPlaying.currentTime = 0;
                    this.currentlyPlaying.volume = previousVolume;
                    this.currentlyPlaying.onvolumechange = undefined;
                    
                    this.currentlyPlaying = undefined;
                    this.switching = false;
                    this.onCurrentAudioStopped();
                }
            }
            this.currentlyPlaying.onvolumechange = smoothLowering;
            this.currentlyPlaying.volume -= 0.01;
        }
    }

    onSwitchEnd() {
        console.log("Switch end");
    }

    onCurrentAudioStopped() {
        console.log("Current audio stopped");
    }

}