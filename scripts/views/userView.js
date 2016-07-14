class UserView {
    constructor(wrapperSelector, mainContentSelector) {
        this._wrapperSelector = wrapperSelector;
        this._mainContentSelector = mainContentSelector;
    }

    showLoginPage(isLoggedIn) {
        let _that = this;

        let templateUrl;

        if (isLoggedIn) {
            templateUrl = "templates/form-user.html";
        } else {
            templateUrl = "templates/form-guest.html";
        }

        $.get(templateUrl, function (template) {
            let renderedWrapper = Mustache.render(template, null);
            $(_that._wrapperSelector).html(renderedWrapper);

            $.get('templates/login.html', function (template) {

                let rendered = Mustache.render(template, null);

                $(_that._mainContentSelector).html(rendered);

                $('#login-request-button').on('click', function (ev) {
                    let username = $('#username').val();
                    let password = $('#password').val();

                    let data = {
                        username: username,
                        password: password
                    };

                    triggerEvent('login', data);
                });
            });
        });
    }

    showRegisterPage(isLoggedIn) {
        let _that = this;

        let templateUrl;

        if (isLoggedIn) {
            templateUrl = "templates/form-user.html";
        } else {
            templateUrl = "templates/form-guest.html";
        }

        $.get(templateUrl, function (template) {

            let renderedWrapper = Mustache.render(template, null);

            $(_that._wrapperSelector).html(renderedWrapper);

            $.get('templates/register.html', function (template) {
                let rendered = Mustache.render(template, null);
                $(_that._mainContentSelector).html(rendered);

                $('#register-request-button').on('click', function (ev) {
                    let username = $('#username').val();
                    let password = $('#password').val();
                    let fullname = $('#full-name').val();
                    let confirmPassword = $('#pass-confirm').val();
                    let interests = $('#interests').val();
                    let birthday = $('#birthday').val();
                    let age = getAge(birthday);

                    let data = {
                        username: username,
                        password: password,
                        fullname: fullname,
                        interests: interests,
                        age: age,
                        confirmPassword: confirmPassword
                    };

                    triggerEvent('register', data);
                });
            });
        });
    }

    showUsersPage(sideBarData, mainData) {
        let _that = this;
        $.get('templates/welcome-user.html', function (template) {
            let renderedWrapper = Mustache.render(template, null);
            $(_that._wrapperSelector).html(renderedWrapper);
            $("#sort-selector").hide();
            document.getElementById("recentsName").innerHTML = "Recent Users";

            $.get('templates/recent-users.html', function (template) {
                let recentUsers = {
                    recentUsers: sideBarData
                };
                let renderedRecentUsers = Mustache.render(template, recentUsers);
                $('.recent-posts').html(renderedRecentUsers);
            });

            $.get('templates/users.html', function (template) {
                let blogUsers = {
                    blogUsers: mainData
                };
                let renderedUsers = Mustache.render(template, blogUsers);
                $('.articles').html(renderedUsers);

                for (let i = 3; i < mainData.length; i++) {
                    $("#user-" + i).hide();
                }

                let first = 3;
                let second = first + 3;
                $("#forward").on('click', function () {
                    if (first < mainData.length) {
                        for (let i = first; i < second; i++) {
                            $("#user-" + i).show();
                        }
                        for (let i = 0; i < first; i++) {
                            $("#user-" + i).hide();
                        }
                        first = second;
                        second = first + 3;
                    }
                });

                $("#backward").on('click', function () {
                    if (first > 3) {
                        for (let i = 0; i < mainData.length; i++) {
                            $("#user-" + i).hide();
                        }
                        for (let i = first - 6; i < first - 3; i++) {
                            $("#user-" + i).show();
                        }
                        first = first - 3;
                        second = second - 3;
                    }
                });
            });
        });
    }
}