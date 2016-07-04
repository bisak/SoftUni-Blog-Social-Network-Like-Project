class HomeView {
    constructor(wrapperSelector, mainContentSelector) {
        this._wrapperSelector = wrapperSelector;
        this._mainContentSelector = mainContentSelector;
    }


    showGuestPage(sideBarData, mainData) {
        Mustache.escape = function (value) {
            return value;
        };
        let _that = this;

        $.get('templates/welcome-guest.html', function (template) {
            let renderedWrapper = Mustache.render(template, null);

            $(_that._wrapperSelector).html(renderedWrapper);

            $.get('templates/recent-posts.html', function (template) {
                let recentPosts = {
                    recentPosts: sideBarData
                };

                let renderedRecentPosts = Mustache.render(template, recentPosts);
                $('.recent-posts').html(renderedRecentPosts);
            });

            $.get('templates/posts.html', function (template) {
                let blogPosts = {
                    blogPosts: mainData
                };

                let renderedPosts = Mustache.render(template, blogPosts);
                $('.articles').html(renderedPosts);
                $(".deleteBtn").hide();
            });
        });
    }

    showUserPage(sideBarData, mainData) {
        Mustache.escape = function (value) {
            return value;
        };

        let _that = this;

        $.get('templates/welcome-user.html', function (template) {
            let renderedWrapper = Mustache.render(template, null);

            $(_that._wrapperSelector).html(renderedWrapper);

            $.get('templates/recent-posts.html', function (template) {
                let recentPosts = {
                    recentPosts: sideBarData
                };

                let renderedRecentPosts = Mustache.render(template, recentPosts);
                $('.recent-posts').html(renderedRecentPosts);
            });

            $.get('templates/posts.html', function (template) {
                let blogPosts = {
                    blogPosts: mainData
                };
                let renderedPosts = Mustache.render(template, blogPosts);
                $('.articles').html(renderedPosts);

                for (let i = 0; i < mainData.length; i++) {
                    let userId = mainData[i]._acl.creator;
                    if (!(userId == sessionStorage['userId'])) {
                        $('#del-' + i).hide();
                    } else {
                        $('#del-' + i).attr('id', mainData[i]._id);
                    }
                }

                $('.deleteBtn').on('click', function (ev) {
                    let postId = this.id;
                    triggerEvent('deletePost', postId);
                });
            });

        });
    }
}

