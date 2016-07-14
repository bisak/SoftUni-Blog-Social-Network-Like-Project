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

    showUsersPage() {
        let _that = this;
        let recentPosts = [];
        let requestUrl = this._baseServiceUrl;

        this._requester.get(requestUrl,
            function success(data) {
                data.sort(function (elem1, elem2) {
                    let date1 = new Date(elem1._kmd.ect);
                    let date2 = new Date(elem2._kmd.ect);
                    return date2 - date1;
                });

                for (let i = 0; i < data.length && i < 5; i++) {
                    recentPosts.push(data[i]);
                }

                for (let i = 0; i < data.length; i++) {
                    data[i].postId = i;
                }

                _that._userView.showUsersPage(recentPosts, data)
            },
            function error(data) {
                showPopup('error', "Error loading users.");
            }
        );
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
            showPopup('error', "Username too short.");
            return;
        }

        if (requestData.fullname.length < 6) {
            showPopup('error', "Full name too short.");
            return;
        }

        if (requestData.password.length < 6) {
            showPopup('error', "Password too short.");
            return;
        }

        if (requestData.interests.length > 100) {
            showPopup('error', "Too many interests");
            return;
        }

        if (requestData.age < 14) {
            showPopup('error', "Should be 14 or older to register");
            return;
        }

        if (requestData.password !== requestData.confirmPassword) {
            showPopup('error', "Passwords don't mach.");
            return;
        }


        delete requestData['confirmPassword'];

        let requestUrl = this._baseServiceUrl;

        this._requester.post(requestUrl, requestData,
            function success(data) {
                showPopup('success', "Successfull registration.");
                triggerEvent('login', data);
            },
            function error(data) {
                showPopup('error', "Registration error.");
            });
    }

    logout() {
        sessionStorage.clear();
        redirectUrl("#/");
    }
}