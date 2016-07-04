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
                showPopup('success', "Successfull login.");
                sessionStorage['_authToken'] = data._kmd.authtoken;
                sessionStorage['username'] = data.username;
                sessionStorage['fullname'] = data.fullname;
                sessionStorage['userId'] = data._id;
                redirectUrl("#/");
            },
            function error(data) {
                showPopup('error', "Login error.");
            });

    }

     register(requestData) {
        if (requestData.username.length < 6) {
            showPopup('error', "Username too short");
            return;
        }

        if (requestData.fullname.length < 6) {
            showPopup('error', "Full name too short");
            return;
        }

        if (requestData.password.length < 6) {
            showPopup('error', "Password too short");
            return;
        }

        if (requestData.password !== requestData.confirmPassword) {
            showPopup('error', "Passwords don't mach");
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