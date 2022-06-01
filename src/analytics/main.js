// Constant variables
const NO_CONTAINER_FOUND = "No container was found. Please create one and try again.";
const NO_LOCATION_DEFINED = "No location definition was found. You can use 'exact_loc' or 'host_only'.";
const NO_CALLBACK_DEFINED = "No callback function was defined.";
const LOCATION_EXACT = "exact_loc";
const LOCATION_HOST = "host_only";

// Settings
var configuration = {
    'API_URL': YOUR_API_ENDPOINT, // for testing purposes, use file provided in /php
    'FALLBACK_CONTAINER': "visitor-count"
}

// Gather current page information
let exact_location = window.location.href;
let hostname = window.location.hostname;

/**
 * Class VisitorCounter
 * 
 * This is where all the magic happens!
 */
class VisitorCounter {
    /**
     * Constructor
     * 
     * @callback callback 
     * @param {string} location 
     * @param {boolean} test 
     * @param {callback} callback
     */
    constructor(location, callback, test = false) {
        if(location == null || location == undefined) throw NO_LOCATION_DEFINED;
        if(callback == null || callback == undefined) throw NO_CALLBACK_DEFINED;
        this.location = location;
        this.test = test;
        this.callback = callback;
        this.container = null;
    }

    /**
     * Use a container to display count in DOM Container
     * 
     * @param {external:Node} container 
     */
    useContainer(container = null) {
        let DOMContainer = document.getElementById(configuration.FALLBACK_CONTAINER);
        this.container = (container !== null && container !== undefined) ? container : DOMContainer;
        if(this.container == null || this.container == undefined) throw NO_CONTAINER_FOUND;
    }

    /**
     * Update container, if selected
     * 
     * @param {string} loc 
     */
    updateContainer(loc) {
        if(this.container !== null && this.container !== undefined) {
            ajax.get(configuration.API_URL, {fetch: '', site: loc, location: this.location}, (e) => {this.container.innerHTML = (parseInt(e) + 1).toString();});
        }
    }

    /**
     * Make API Call
     */
    async make() {
        let loc;
        if(this.location == LOCATION_EXACT) loc = exact_location;
        if(this.location == LOCATION_HOST) loc = hostname;
        await ajax.get(configuration.API_URL, {site: loc, count: !this.test}, this.callback);
        await this.updateContainer(loc);
    }
}
