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
                $(".likeBtn").hide();
                $(".downvoteBtn").hide();
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


                for (let i = 0; i < mainData.length; i++) { //THIS WILL SLEEP!
                    let userId = mainData[i]._acl.creator;

                    if (userId == sessionStorage['userId']) {
                        $('#del-' + i).attr('id', mainData[i]._id);
                    } else {
                        $('#del-' + i).hide();
                    }
                    $('#like-' + i).attr('id', mainData[i]._id);
                    $('#display-' + i).attr('id', "display-" + mainData[i]._id);
                }

                $('.deleteBtn').on('click', function (e) {
                    let buttonId = this.id;
                    vex.dialog.confirm({
                        message: 'Delete post?',
                        callback: function(value) {
                            if(value){
                                triggerEvent('deletePost', buttonId);
                            }
                        }
                    });
                });

                $('.likeBtn').on('click', function (ev) {
                    let postId = this.id;
                    for (let i = 0; i < mainData.length; i++) {  //WILL SLEEP!
                        if (mainData[i]._id == postId) {
                            var updateData = mainData[i];
                            updateData.votes += 1;
                            break;
                        }
                    }
                    triggerEvent('ratePost', updateData);
                });

                $("#sort-selector").on('change', function () {
                    triggerEvent('sortPosts', this.value)
                });
            });
        });
    }
}

