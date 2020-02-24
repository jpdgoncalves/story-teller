import ImageLoader from "./image-loader.js";
import AudioLoader from "./audio-loader.js";

/**
 * 
 * @param {Iterator} iterator 
 */
function iteratorToList(iterator) {
    const list = [];

    for(let element of iterator) {
        list.push(element);
    }

    return list;
}

export default class StoryTellerLoader {

    constructor() {
        this.imageLoader = new ImageLoader();
        this.audioLoader = new AudioLoader();
        this.totalItems = 0;
        this.itemsLoaded = 0;
        this.imageLoader.onImageLoaded = (url) => this._onResourceLoaded(url);
        this.audioLoader.onAudioLoaded = (url) => this._onResourceLoaded(url);
    }

    /**
     * 
     * @param {string} jsonUrl 
     */
    load(jsonUrl) {
        const imageUrls = [];
        const audioNames = [];
        let audioUrls = new Set();
        const paragraphGroups = [];

        const promise = fetch(jsonUrl)
            .then((response) => response.json())
            .then((json) => {

                for(const part of json) {
                    imageUrls.push(part.bgImageUrl);
                    audioNames.push(part.audioUrl);
                    audioUrls.add(part.audioUrl);
                    paragraphGroups.push(part.paragraphs);
                }

                audioUrls = iteratorToList(audioUrls);
                this.totalItems = imageUrls.length + audioUrls.length;

                return Promise.all([
                    this.imageLoader.load(imageUrls),
                    this.audioLoader.load(audioUrls),
                    paragraphGroups
                ]);
            })
            .then((resources) => {
                const json = {
                    "images": [],
                    "audioNames" : [],
                    "audios": {},
                    "paragraphGroups": []
                };
                json.images = resources[0];
                json.audioNames = audioNames;
                json.paragraphGroups = paragraphGroups;
                
                for(let i = 0; i < resources[1].length; i++) {
                    json.audios[audioUrls[i]] = resources[1][i];
                }

                return json;
            })
            .catch((error) => this.onLoadError(error));
        
        return promise;
    }

    /**
     * 
     * @param {string} url 
     */
    onResourceLoaded(url) {
        console.log(`Loaded resource: ${url}, ${this.itemsLoaded} out of ${this.totalItems}`);
    }

    /**
     * 
     * @param {string} url 
     */
    _onResourceLoaded(url) {
        this.itemsLoaded++;
        this.onResourceLoaded(url);
    }

    onLoadError(error) {
        console.error(error);
    }

}