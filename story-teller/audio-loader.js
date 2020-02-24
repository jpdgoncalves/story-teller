
export default class AudioLoader {

    /**
     * 
     * @param {string[]} audioUrls 
     */
    load(audioUrls) {
        return Promise.all(
            audioUrls.map( audioUrl => this._load(audioUrl))
        )
        .catch(this.onLoadError);
    }

    /**
     * 
     * @param {string} audioUrl 
     */
    _load(audioUrl) {
        return new Promise((resolve, reject) => {
            let audio = new Audio(audioUrl);
            audio.addEventListener("canplaythrough", () => {
                this.onAudioLoaded(audioUrl);
                resolve(audio);
            }, {once : true});
            audio.addEventListener("error", () => {
                reject(new Error(`Failed to load ${audioUrl}`))
            }, {once: true})
        });
    }

    /**
     * 
     * @param {string} audioUrl 
     */
    onAudioLoaded(audioUrl) {
        console.log(`Loaded audio ${audioUrl}`);
    }

    onLoadError(error) {
        console.error(error);
    }

}