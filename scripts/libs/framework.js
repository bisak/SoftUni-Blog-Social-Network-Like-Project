//DOCUMENTATION https://github.com/SoftUni-ES-BlackBox-Framework/blackbox

class Requester {
    /*Handle requests*/
    constructor(authorizationService) {
        this.authorizationService = authorizationService;
    }

    get(url, successCallback, errorCallback) {
        let requestHeaders = this._getHeaders(true);
        this._makeRequest('GET', url, null, requestHeaders, successCallback, errorCallback);
    }

    post(url, data, successCallback, errorCallback) {
        let requestHeaders = this._getHeaders(false);
        this._makeRequest('POST', url, data, requestHeaders, successCallback, errorCallback);
    }

    put(url, data, successCallback, errorCallback) {
        let requestHeaders = this._getHeaders(false);
        this._makeRequest('PUT', url, data, requestHeaders, successCallback, errorCallback);
    }

    delete(url, data, successCallback, errorCallback) {
        let requestHeaders = this._getHeaders(false);
        this._makeRequest('DELETE', url, data, requestHeaders, successCallback, errorCallback);
    }

    _makeRequest(method, url, data, headers, successCallBack, errorCallBack) {
        $.ajax({
            method: method,
            url: url,
            headers: headers,
            data: JSON.stringify(data) || null,
            /*ANIMATIONS are commented*/
            /*beforeSend: function () {
             if ($("#loader-modal").length) {
             $("#loader-modal").css("display", "block");
             // $(".wrapper").css("display", "none");

             }
             },*/
            success: successCallBack,
            error: errorCallBack
            /*Animation*/
            /*,
             complete: function () {
             if ($("#loader-modal").length) {
             $("#loader-modal").css("display", "none");
             $(".wrapper").css("display", "inline-block");
             $(".body").css("background-color", "FFF");
             }
             },
             //async: false*/
        });
    }

    _getHeaders(isGuest) {
        let headers = this.authorizationService.getAuthorizationHeaders(isGuest);
        return headers;
    }
}

let _guestCredentials;
let _appCredentials;

class AuthorizationService {
    constructor(baseServiceUrl, appId, appSecret, guestUserCredentials) {
        this.baseServiceUrl = baseServiceUrl;
        this.appId = appId;
        this.appSecret = appSecret;
        _guestCredentials = guestUserCredentials;
        _appCredentials = btoa(appId + ":" + appSecret);
    }

    initAuthorizationType(authType) {
        this.authType = authType;
    }

    getCurrentUser() {
        return sessionStorage['username'];
    }

    isLoggedIn() {
        return this.getCurrentUser() != undefined;
    }

    getAuthorizationHeaders(isGuest) {
        let headers = {};

        if (this.isLoggedIn()) {
            headers = {
                'Authorization': this.authType + ' ' + sessionStorage['_authToken']
            };
        } else if (!this.isLoggedIn() && isGuest) {
            headers = {
                'Authorization': this.authType + ' ' + _guestCredentials
            };
        } else if (!this.isLoggedIn() && !isGuest) {
            headers = {
                'Authorization': 'Basic' + ' ' + _appCredentials
            };
        }

        headers['Content-Type'] = 'application/json';

        return headers;
    }
}

function showPopup(type, text, position) {
    /*Handle notifications*/
    function _showSuccessPopup(text, position) {
        noty({
            text: text,
            timeout: 1500,
            layout: 'top',
            type: 'success'
        });
    }

    function _showInfoPopup(text, position) {
        noty({
            text: text,
            timeout: 1500,
            layout: 'top',
            type: 'information'
        });
    }

    function _showWarningPopup(text, position) {
        noty({
            text: text,
            timeout: 1500,
            layout: 'top',
            type: 'warning'
        });
    }

    function _showErrorPopup(text, position) {
        noty({
            text: text,
            timeout: 1500,
            layout: 'top',
            type: 'error'
        });
    }

    switch (type) {
        case 'success':
            _showSuccessPopup(text, position);
            break;
        case 'info':
            _showInfoPopup(text, position);
            break;
        case 'warning':
            _showWarningPopup(text, position);
            break;
        case 'error':
            _showErrorPopup(text, position);
            break;
    }
}

/*Handle events*/

let _isInstanced = false;
let _router;

function initEventServices() {
    if (_isInstanced) {
        return;
    }
    _router = Sammy(function () {
        //Here we put all pre-initialized functions, event handlers, and so on...
        this.bind('redirectUrl', function (ev, url) {
            this.redirect(url);
        });
    });
    _isInstanced = true;
}

function redirectUrl(url) {
    Sammy(function () {
        this.trigger('redirectUrl', url);
    });
}
function bindEventHandler(event, eventHandler) {
    Sammy(function () {
        this.bind(event, eventHandler);
    });
}
function onRoute(route, routeHandler) {
    Sammy(function () {
        this.get(route, routeHandler);
    });
}
function triggerEvent(event, data) {
    Sammy(function () {
        this.trigger(event, data);
    });
}
function run(rootUrl) {
    _router.run(rootUrl);
}

/*HTML Editor options/handling*/
function initHtmlEditor() {
    if (tinymce.editors.length > 0) {
        tinymce.remove();
    }
    tinymce.init({
        selector: '.content-field',
        theme: 'modern',
        plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools'
        ],
        toolbar1: 'insertfile undo redo | styleselect | bold italic | bullist numlist outdent indent | link image',
        toolbar2: 'print preview media | forecolor backcolor emoticons',
        image_advtab: true,
        templates: [
            {title: 'Test template 1', content: 'Test 1'},
            {title: 'Test template 2', content: 'Test 2'}
        ],
        content_css: '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        forced_root_block: '',
    });
}

/*Function to calculate user's age*/
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

/*Important for escaping html (scripts)*/
let entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}