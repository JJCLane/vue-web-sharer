
const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 400;

export default class Sharer {

    static staticOpenNewWindow(urlString) {
        if (window.self !== window.top) {
            window.open(urlString, '_blank');
        } else {
            window.open(urlString, '_self');
        }
    }

    static convertToSnakeCase(string) {
        return string.replace(/\.?([A-Z]+)/g, function (x, y) { return "_" + y.toLowerCase() }).replace(/^_/, "");
    }

    static paramsToUrl(params, includeParamSymbol = false, toSnakeCase = false) {
        let url = '';
        for (const key in params) {
            if (params[key]) {
                url += `&${toSnakeCase ? this.convertToSnakeCase(key) : key}=${encodeURIComponent(params[key])}`;
            }
        }
        return includeParamSymbol ? url : url.substring(1);
    }

    static email(attrs) {
        const { to } = attrs;
        delete attrs.to;
        let urlString = 'mailto:';

        if (to) {
            urlString += encodeURIComponent(to) + '?';
        }

        urlString += this.paramsToUrl(attrs);

        this.staticOpenNewWindow(urlString);
    }

    static copy({ url }) {
        try {
            navigator.clipboard.writeText(url || window ? window.location.href : '');
        } catch (err) {
            console.error("Copy isn't supported by this browser.");
        }
    }

    static facebook(attrs) {
        const { shareType, url, popupWidth, popupHeight } = attrs;
        delete attrs.shareType;
        delete attrs.url;
        delete attrs.popupWidth;
        delete attrs.popupHeight;
        const curPopupWidth = popupWidth ? popupWidth : POPUP_WIDTH;
        const curPopupHeight = popupHeight ? popupHeight : POPUP_HEIGHT;
        let urlString;

        if (shareType && shareType === 'feed') {
            // if user specifies that they want to use the Facebook feed dialog
            //(https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.4)
            urlString = 'https://www.facebook.com/dialog/feed?';

            if (url) {
                urlString += '&link=' + encodeURIComponent(url);
            }

            urlString += this.paramsToUrl(attrs, false, true);

        } else if (shareType && shareType === 'share') {
            // if user specifies that they want to use the Facebook share dialog
            //(https://developers.facebook.com/docs/sharing/reference/share-dialog)
            urlString = 'https://www.facebook.com/dialog/share?';

            if (url) {
                urlString += '&href=' + encodeURIComponent(url);
            }

            urlString += this.paramsToUrl(attrs, false, true);

        } else if (shareType && shareType === 'send') {
            // if user specifies that they want to use the Facebook send dialog
            //(https://developers.facebook.com/docs/sharing/reference/send-dialog)
            urlString = 'https://www.facebook.com/dialog/send?';

            if (attrs.url) {
                urlString += '&link=' + encodeURIComponent(url);
            }

            urlString += this.paramsToUrl(attrs, false, true);

        } else {
            //otherwise default to using sharer.php
            urlString = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url || window.location.href);
        }

        window.open(
            urlString,
            'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + curPopupWidth + ',height=' + curPopupHeight
            + ',top=' + (window.innerHeight - curPopupHeight) / 2 + ',left=' + (window.innerWidth - curPopupWidth) / 2);
    }

}