
export default class ImageLoader {

    /**
     * 
     * @param {string[]} imageUrls 
     */
    load(imageUrls) {
        return Promise.all(
            imageUrls.map( imageUrl => this._load(imageUrl))
        )
        .catch(this.onLoadError);
    }

    /**
     * 
     * @param {string} imageUrl 
     */
    _load(imageUrl) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = imageUrl;
            image.addEventListener("load", () => {
                this.onImageLoaded(imageUrl);
                resolve(image);
            }, {once : true});
            image.addEventListener("error", () => {
                reject(new Error(`Failed to load ${imageUrl}`))
            }, {once: true})
        });
    }

    /**
     * 
     * @param {string} imageUrl 
     */
    onImageLoaded(imageUrl) {
        console.log(`Loaded image ${imageUrl}`);
    }

    onLoadError(error) {
        console.error(error);
    }

}