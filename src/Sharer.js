
export default class Sharer {

    static staticOpenNewWindow(urlString) {
        if (window.self !== window.top) {
            window.open(urlString, '_blank');
        } else {
            window.open(urlString, '_self');
        }
    }

    static paramsToUrl(params, includeParamSymbol = false) {
        let url = '';
        for (const key in params) {
            if (params[key]) {
                url += `&${key}=${encodeURIComponent(params[key])}`;
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

}