
const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 400;

export default class Sharer {
    /* Helpers */
    static staticOpenNewWindow(urlString) {
        if (window.self !== window.top) {
            window.open(urlString, '_blank');
        } else {
            window.open(urlString, '_self');
        }
    }

    static isMobile() {
        if (!window) {
            return false;
        }

        const a = navigator.userAgent || navigator.vendor || (window).opera;

        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)));
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

    /* Providers */
    static email(attrs) {
        const { to } = attrs;
        delete attrs.to;
        let urlString = 'mailto:';

        if (to) {
            urlString += encodeURIComponent(to);
        }

        urlString += '?' + this.paramsToUrl(attrs);

        this.staticOpenNewWindow(urlString);
    }

    static copy({ url }) {
        try {
            navigator.clipboard.writeText(url || (window ? window.location.href : ''));
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

    static twitter(attrs) {
        const { popupWidth, popupHeight } = attrs;
        delete attrs.popupWidth;
        delete attrs.popupHeight;
        const curPopupWidth = popupWidth ? popupWidth : POPUP_WIDTH;
        const curPopupHeight = popupHeight ? popupHeight : POPUP_HEIGHT;
        let urlString = 'https://www.twitter.com/intent/tweet?';

        urlString += this.paramsToUrl(attrs);

        if (this.isMobile()) {
            this.staticOpenNewWindow(urlString);
        } else {
            window.open(
                urlString,
                'Twitter', 'toolbar=0,status=0,resizable=yes,width=' + curPopupWidth + ',height=' + curPopupHeight
                + ',top=' + (window.innerHeight - curPopupHeight) / 2 + ',left=' + (window.innerWidth - curPopupWidth) / 2);
        }
    }

    static linkedIn(attrs) {
        const { popupWidth, popupHeight } = attrs;
        delete attrs.popupWidth;
        delete attrs.popupHeight;
        const curPopupWidth = popupWidth ? popupWidth : POPUP_WIDTH;
        const curPopupHeight = popupHeight ? popupHeight : POPUP_HEIGHT;
        let urlString = 'https://www.linkedin.com/shareArticle?mini=true&';

        urlString += this.paramsToUrl(attrs);

        window.open(
            urlString,
            'Linkedin', 'toolbar=0,status=0,resizable=yes,width=' + curPopupWidth + ',height=' + curPopupHeight
            + ',top=' + (window.innerHeight - curPopupHeight) / 2 + ',left=' + (window.innerWidth - curPopupWidth) / 2);
    }

    static whatsApp(attrs) {
        const { url, popupWidth, popupHeight } = attrs;
        delete attrs.url;
        delete attrs.popupWidth;
        delete attrs.popupHeight;
        const curPopupWidth = popupWidth ? popupWidth : POPUP_WIDTH;
        const curPopupHeight = popupHeight ? popupHeight : POPUP_HEIGHT;
        const isMobile = this.isMobile();
        let urlString = 'https://wa.me/?';

        urlString += this.paramsToUrl(attrs);

        if (url) {
            urlString += encodeURIComponent(url);
        }

        if (isMobile) {
            this.staticOpenNewWindow(urlString);
        } else {
            window.open(
                urlString,
                'WhatsApp', 'toolbar=0,status=0,resizable=yes,width=' + curPopupWidth + ',height=' + curPopupHeight
                + ',top=' + (window.innerHeight - curPopupHeight) / 2 + ',left=' + (window.innerWidth - curPopupWidth) / 2);;
        }
    }

}
