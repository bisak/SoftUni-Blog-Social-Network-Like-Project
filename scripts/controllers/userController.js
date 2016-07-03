class UserController {
    constructor(userView, requester, baseUrl, appKey) {
        this._userView = userView;
        this._requester = requester;
        this._appkey = appKey;
        this._baseServiceUrl = baseUrl + "/user/" + appKey + "/";
    }

    showLoginPage(isLoggedIn) {
        this._userView.showLoginPage(isLoggedIn);
    }

    showRegisterPage(isLoggedIn) {
        this._userView.showRegisterPage(isLoggedIn);
    }

    login(requestData) {
        let requestUrl = this._baseServiceUrl + "login";

        this._requester.post(requestUrl, requestData,
            function success(data) {
                showPopup('success', "Bravo logna se.");

                sessionStorage['_authToken'] = data._kmd.authtoken;
                sessionStorage['username'] = data.username;
                sessionStorage['fullname'] = data.fullname;

                redirectUrl("#/");
            },
            function error(data) {
                showPopup('error', "Error pri logina.");
            });

    }

    register(requestData) {
        if (requestData.username.length < 5) {
            showPopup('error', "Trqbva pone 5km. dulag username.");
            return;
        }

        if (requestData.fullname.length < 8) {
            showPopup('error', "Trqbva imeto ti da e pone 8km dulgo.");
            return;
        }

        if (requestData.password.length < 6) {
            showPopup('error', "Trqbva pone 6km. dulga parola.");
            return;
        }

        if (requestData.password !== requestData.confirmPassword) {
            showPopup('error', "Ne ti suvpadat parolite.");
            return;
        }

        delete requestData['confirmPassword'];

        let requestUrl = this._baseServiceUrl;

        this._requester.post(requestUrl, requestData,
            function success(data) {
                showPopup('success', "Bravo registrira se.");
                redirectUrl("#/login");
            },
            function error(data) {
                showPopup('error', "Error pri registraciqta.");
            });
    }

    logout() {
        sessionStorage.clear();
        redirectUrl("#/");
    }
}