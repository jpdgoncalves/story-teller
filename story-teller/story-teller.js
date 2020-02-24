import ImageSwitcher from "./image-switcher.js";
import ParagraphViewer from "./paragraph-viewer.js";
import AudioSwitcher from "./audio-switcher.js";
import StoryTellerLoader from "./story-teller-loader.js";


export default class StoryTeller {

    /**
     * 
     * @param {HTMLElement} container 
     */
    constructor() {

        this.container = document.createElement("div");
        this.background = document.createElement("div");
        this.text = document.createElement("div");
        this.overlay = document.createElement("div");

        this.loader = new StoryTellerLoader();
        this.imageSwitcher = new ImageSwitcher();
        this.paragraphViewer = new ParagraphViewer();
        this.audioSwitcher = new AudioSwitcher(3);
        /**
         * @type {string[][]}
         */
        this.paragraphGroups = [];
        /**
         * @type {string[]}
         */
        this.audiosToPlay = [];
        this.lastTick = 0;
        this.delayBetweenCharacter = 125;
        this.started = false;
        this.tapBlocked = false;

        this.tick = this.tick.bind(this);

        this._setupComponents();
    }

    _setupComponents() {
        //Styles
        this.container.style.position = "relative";
        this.container.style.width = "100%";
        this.container.style.height = "100%";

        this.background.style.position = "absolute";
        this.background.style.width = "100%";
        this.background.style.height = "100%";

        this.text.style.position = "absolute";
        this.text.style.width = "100%";
        this.text.style.height = "100%";

        this.overlay.style.position = "absolute";
        this.overlay.style.width = "100%";
        this.overlay.style.height = "100%";
        this.overlay.style.transitionProperty = "opacity";
        this.overlay.style.transitionDuration = "3s";
        this.overlay.style.transitionTimingFunction = "linear";
        this.overlay.style.opacity = "1";

        //Classes
        this.container.classList.add("story-teller");
        this.background.classList.add("story-teller-background");
        this.text.classList.add("story-teller-text");
        this.overlay.classList.add("story-teller-overlay");

        //Event listener
        this.container.addEventListener("click", () => this._onClickOrTap());
        this.container.addEventListener("touchend", () => this._onClickOrTap());
        this.overlay.addEventListener("transitionend", () => {
            this.started = this.overlay.style.opacity == "0";
        }); 

        //UI Elements appending
        this.imageSwitcher.append(this.background);
        this.paragraphViewer.append(this.text);
        this.container.appendChild(this.background);
        this.container.appendChild(this.text);
        this.container.appendChild(this.overlay);
    }

    /**
     * 
     * @param {HTMLElement} container 
     */
    append(container) {
        container.appendChild(this.container);
    }

    /**
     * 
     * @param {string} jsonUrl 
     */
    start(jsonUrl) {
        this.loader.load(jsonUrl)
            .then((json) => {
                this.prepare(json);
                window.requestAnimationFrame(this.tick);
            });
    }

    prepare(json) {
        this.imageSwitcher.setImages(json.images);

        const audios = json.audios
        for(const name in audios) {
            this.audioSwitcher.addAudio(name, audios[name]);
        }

        this.paragraphGroups = json.paragraphGroups.reverse();
        this.audiosToPlay = json.audioNames.reverse();

    }

    tick(time) {
        if(!this.isStoryFinished()) {
            if(this._checkTimeStamp(time) && this._isReady() && this.started) {
                this.tapBlocked = false;
                this.paragraphViewer.displayNextCharacter();
            }
            window.requestAnimationFrame(this.tick);
        }
    }

    isStoryFinished() {
        return this.paragraphGroups.length == 0 && this.paragraphViewer.isFinished();
    }

    /**
     * 
     * @param {number} time 
     */
    _checkTimeStamp(time) {
        if(this.delayBetweenCharacter <  time - this.lastTick) {
            this.lastTick = time;
            return true;
        }
        return false;
    }

    _isReady() {
        return !this.paragraphViewer.isFinished() 
            && !this.audioSwitcher.switching 
            && !this.imageSwitcher.switching;
    }

    _onClickOrTap() {

        if(!this.isStoryFinished() && !this._isReady() && !this.tapBlocked) {
            const nextParagraphs = this.paragraphGroups.pop();
            const nextAudio = this.audiosToPlay.pop();
            this.paragraphViewer.setParagraphs(nextParagraphs);
            if(!this.started) {
                this.overlay.style.opacity = 0;
            } else {
                this.imageSwitcher.showNextImage();
            }
            this.audioSwitcher.play(nextAudio);
            this.tapBlocked = true;
        } else if (this.isStoryFinished() && this.started && !this.tapBlocked) {
            this.started = false;
            this.audioSwitcher.stopCurrentlyPlaying();
            this.overlay.style.opacity = "1";
            this.tapBlocked = true;
        }
    }
}