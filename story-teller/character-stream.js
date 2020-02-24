
export default class CharacterStream {

    constructor() {
        this.word = "";
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
     * @param {string} word 
     */
    setWord(word) {
        this.word = word;
        this.stack = word.split("").reverse();
    }

    nextCharacter() {
        return this.stack.pop();
    }

}