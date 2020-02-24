
export default class ImageSwitcher {

    constructor() {
        this.container = document.createElement("div");
        /**
         * @type {HTMLImageElement}
         */
        this.currentImage = undefined;
                /**
         * @type {HTMLImageElement}
         */
        this.nextImage = undefined;
                /**
         * @type {HTMLImageElement[]}
         */
        this.imageStack = [];

        this.container.style.position = "relative";
        this.container.style.height = "100%";
        this.container.style.width = "100%";

        this.container.classList.add("image-switcher");
    }

    /**
     * 
     * @param {HTMLImageElement[]} imageStack 
     */
    setImages(imageStack) {
        imageStack.reverse();
        this.currentImage = imageStack.pop();
        this.nextImage = imageStack.pop();
        this.imageStack = imageStack;

        this.setImageStyles();
        this.setEventListeners();
        this.container.appendChild(this.currentImage);
        this.container.appendChild(this.nextImage);

        this.switching = false;
    }

    /**
     * 
     * @param {HTMLElement} container 
     */
    append(container) {
        container.appendChild(this.container);
    }

    showNextImage() {
        if(!this.switching) {
            this.nextImage.style.opacity = "1";
            this.switching = true;
        }
    }

    setNextImage() {
        const previousImage = this.currentImage;

        this.currentImage = this.nextImage;
        this.nextImage = this.imageStack.pop();

        this.setImageStyles();
        this.setEventListeners();
        this.container.removeChild(previousImage);
        this.container.appendChild(this.nextImage);
    }

    setImageStyles() {
        this.currentImage.style.position = "absolute";
        this.currentImage.style.margin = "auto";
        this.currentImage.style.maxHeight = "100%";
        this.currentImage.style.maxWidth = "100%";
        this.currentImage.style.top = "0";
        this.currentImage.style.bottom = "0";
        this.currentImage.style.left = "0";
        this.currentImage.style.right = "0";

        this.nextImage.style.position = "absolute";
        this.nextImage.style.margin = "auto";
        this.nextImage.style.maxHeight = "100%";
        this.nextImage.style.maxWidth = "100%";
        this.nextImage.style.top = "0";
        this.nextImage.style.bottom = "0";
        this.nextImage.style.left = "0";
        this.nextImage.style.right = "0";
        this.nextImage.style.opacity = "0";
        this.nextImage.style.transitionProperty = "opacity";
        this.nextImage.style.transitionDuration = "3s";
        this.nextImage.style.transitionTimingFunction = "linear";
    }

    setEventListeners() {
        this.nextImage.addEventListener("transitionend", () => {
            console.log("transition end");
            this.switching = false;
            this.onTransitionEnd();
            if(this.imageStack.length > 0) {
                this.setNextImage();
            }
        });
    }

    onTransitionEnd() {
        console.log("Switch of image over");
    }

}