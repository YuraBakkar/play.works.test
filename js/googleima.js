class TGoogleIMA extends TStage {
    constructor(element, width, height, nextStage) {
        super()
        this.nextStage = nextStage
        this.width = 640
        this.height = 480
        this.videoElement = document.createElement('video')
        this.videoElement.style.width = width + 'px'
        this.videoElement.style.height = height + 'px'
        this.videoElement.style.position = 'absolute'
        this.elem = document.createElement('div')
        this.elem.style.width = width + 'px'
        this.elem.style.height = height + 'px'
        //elem.style.position = 'absolute'
        this.containerElement = document.getElementById(element)
        this.containerElement.appendChild(this.videoElement)
        this.containerElement.appendChild(this.elem)

        //this.adsRequest = new google.ima.AdsRequest();
        //this.adsLoader.requestAds(this.adsRequest);

        //this.hide()
    }
    onAdsManagerLoaded(adsManagerLoadedEvent) {
        // Get the ads manager.
        var adsRenderingSettings = new google.ima.AdsRenderingSettings();
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        // videoContent should be set to the content video element.
        this.adsManager =
            adsManagerLoadedEvent.getAdsManager(this.videoElement, adsRenderingSettings);

        // Add listeners to the required events.
        this.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError.bind(this));
        this.adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested.bind(this));
        this.adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            this.onContentResumeRequested.bind(this));
        this.adsManager.addEventListener(
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED, this.onAdEvent.bind(this));

        // Listen to any additional events, if necessary.
        this.adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, this.onAdEvent.bind(this));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, this.onAdEvent.bind(this));
        this.adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, this.onAdEvent.bind(this));

        this.containerElement.style.display = 'block'
        this.videoElement.load();
        this.adDisplayContainer.initialize();

        try {
            // Initialize the ads manager. Ad rules playlist will start at this time.
            this.adsManager.init(this.width, this.height, google.ima.ViewMode.NORMAL);
            // Call play to start showing the ad. Single video and overlay ads will
            // start at this time; the call will be ignored for ad rules.
            this.adsManager.start();
        } catch (adError) {
            // An error may be thrown if there was a problem with the VAST response.
            console.log(adError)
            this.next()
        }
    }
    next() {
        this.hide()
        this.adsManager.destroy()
        this.adsRequest = null
        this.adsLoader.destroy()
        this.nextStage()
    }
    onAdEvent(adEvent) {
        // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
        // don't have ad object associated.
        var ad = adEvent.getAd();
        switch (adEvent.type) {
            case google.ima.AdEvent.Type.LOADED:
                // This is the first event sent for an ad - it is possible to
                // determine whether the ad is a video ad or an overlay.
                if (!ad.isLinear()) {
                    // Position AdDisplayContainer correctly for overlay.
                    // Use ad.width and ad.height.
                    this.videoElement.play();
                }
                break;
            case google.ima.AdEvent.Type.STARTED:
                break;
            case google.ima.AdEvent.Type.COMPLETE:
                console.log('complete')
                this.next()
                break;
        }
    }
    onAdError(adErrorEvent) {
        // Handle the error logging.
        console.log(adErrorEvent.getError());
        //this.adsManager.destroy();
        this.next()
    }
    onContentPauseRequested() {
        this.videoElement.pause();
        // This function is where you should setup UI for showing ads (e.g.
        // display ad timer countdown, disable seeking etc.)
        // setupUIForAds();
    }
    onContentResumeRequested() {
        this.videoElement.play();
        // This function is where you should ensure that your UI is ready
        // to play content. It is the responsibility of the Publisher to
        // implement this function when necessary.
        // setupUIForContent();
    }
    show() {
        this.adDisplayContainer = new google.ima.AdDisplayContainer(
            this.elem, this.videoElement);
        this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);
        this.adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            this.onAdsManagerLoaded.bind(this), false);
        this.adsLoader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError.bind(this), false);
        this.adsRequest = new google.ima.AdsRequest();
        this.adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
            'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
            'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
            'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';
        this.adsRequest.linearAdSlotWidth = this.width;
        this.adsRequest.linearAdSlotHeight = this.height;
        this.adsLoader.requestAds(this.adsRequest);
        console.log(this.adsRequest)
    }
    hide() {
        this.containerElement.style.display = 'none'
    }
}