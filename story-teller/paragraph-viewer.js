import WordStream from "./word-stream.js";
import CharacterStream from "./character-stream.js";

/**
 * It receives a bunch of paragraphs and displays them without causing overflow.
 * When it does cause overflow it will clear the paragraphs and start displaying the unfinished one before continuing with the next ones.
 * When there is no more paragraphs left it should signal as such and not do anything until it has more paragraphs to display.
 */
export default class ParagraphViewer {

    constructor() {

        this.wordStream = new WordStream();
        this.characterStream = new CharacterStream();
        /**
         * @type {string[]}
         */
        this.paragraphs = [];

        //Wrapper to contain the UI remaining elements
        this.container = document.createElement("div");
        //Invisible element to measure the text
        this.ruler = document.createElement("div");
        //Visible element that contains the paragraphs
        this.displayer = document.createElement("div");
        
        this._setupComponents();
    }

    /**
     * 
     * @param {string[]} paragraphs 
     */
    setParagraphs(paragraphs) {
        this._clearDisplayer();
        this.paragraphs = paragraphs.reverse();
        this.wordStream.stack = [];
        this.characterStream.stack = [];
    }

    displayNextCharacter() {
        //Were all paragraphs fully displayed.
        if(!this.isFinished()) {
            //Updates streams and ruler
            this._update();
            //Renders the text
            this._render();
        }
    }

    /**
     * 
     * @param {HTMLElement} container 
     */
    append(container) {
        container.appendChild(this.container);
    }

    _setupComponents() {
        //Styling
        this.container.style.position = "relative";
        this.container.style.height = "100%";
        this.container.style.width = "100%";

        this.ruler.style.position = "absolute";
        this.ruler.style.height = "100%";
        this.ruler.style.width = "100%";
        this.ruler.style.overflow = "hidden";
        this.ruler.style.visibility = "hidden";

        this.displayer.style.position = "absolute";
        this.displayer.style.height = "100%";
        this.displayer.style.width = "100%";
        this.displayer.style.overflow = "hidden";

        //Classes and appending
        this.container.classList.add("paragraph-viewer-container");
        this.ruler.classList.add("paragraph-viewer-ruler");
        this.displayer.classList.add("paragraph-viewer-displayer");
        this.container.appendChild(this.ruler);
        this.container.appendChild(this.displayer);
    }

    _clearDisplayer() {
        this._clearElement(this.ruler);
        this._clearElement(this.displayer);
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    _clearElement(element) {
        while(element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    _createParagraph() {
        const p = document.createElement("p");
        p.classList.add("paragraph-viewer-p");
        return p;
    }

    _insertParagraph() {
        const pRuler = this._createParagraph();
        const pDisplayer = this._createParagraph();
        this.ruler.appendChild(pRuler);
        this.displayer.appendChild(pDisplayer);
    }

    /**
     * 
     * @param {string} str 
     */
    _addStringToRuler(str) {
        this.ruler.lastChild.textContent += str;
    }

    /**
     * 
     * @param {string} str 
     */
    _addStringToDisplayer(str) {
        this.displayer.lastChild.textContent += str;
    }

    _paragraphOverflow() {
        return this.hasOverflowed() && this.displayer.lastChild.textContent.length == 0;
    }

    _hasEndingDots() {
        return this.displayer.lastChild.textContent.endsWith("...");
    }

    _update() {
        if(this.reachedParagraphEnd()) {
            this.wordStream.setText(this.paragraphs.pop());
            this.characterStream.setWord(this.wordStream.nextWord() + " ");
            this._insertParagraph();
            this._addStringToRuler(this.characterStream.word);
        } else if(this.characterStream.empty) {
            this.characterStream.setWord(this.wordStream.nextWord() + " ");
            this._addStringToRuler(this.characterStream.word);
        }
    }

    _render() {
        if(this._paragraphOverflow()) {
            this._clearDisplayer();
            this._insertParagraph();
            this._addStringToRuler(this.characterStream.word);
            this._addStringToDisplayer(this.characterStream.nextCharacter());
        } else if(this.hasOverflowed()) {
            if(this._hasEndingDots()) {
                this._clearDisplayer();
                this._insertParagraph();
                this._addStringToRuler("..." + this.characterStream.word);
                this._addStringToDisplayer("...");
            } else {
                this._addStringToDisplayer("...");
            }
        } else {
            this._addStringToDisplayer(this.characterStream.nextCharacter());
        }
    }

    hasOverflowed() {
        return this.ruler.scrollHeight > this.ruler.clientHeight;
    }

    isFinished() {
        return this.paragraphs.length == 0 && this.wordStream.empty && this.characterStream.empty;
    }

    reachedParagraphEnd() {
        return this.wordStream.empty && this.characterStream.empty;
    }
}