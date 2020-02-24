export default class WordStream {

    constructor() {
        this.text = "";
        /**
         * @type {string[]}
         */
        this.stack = [];
    }

    get empty() {
        return this.stack.length == 0;
    }

    /**
     * 
     * @param {string} text 
     */
    setText(text) {
        const regex = / |\n/gm;
        let words = text.split(regex).reverse();

        this.text = text;
        this.stack = words;
    }

    nextWord() {
        return this.stack.pop();
    }
}