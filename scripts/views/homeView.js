class HomeView {
    constructor(wrapperSelector, mainContentSelector) {
        this._wrapperSelector = wrapperSelector;
        this._mainContentSelector = mainContentSelector;
    }

    /*Render guests page*/
    showGuestPage(sideBarData, mainData) {
        Mustache.escape = function (value) {
            return value;
        };
        let _that = this;
        $.get('templates/welcome-guest.html', function (template) {
            let renderedWrapper = Mustache.render(template, null);
            $(_that._wrapperSelector).html(renderedWrapper);
            /*Render posts in sidebar*/
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
                /*Hide all  buttons that provide functionality for registered users*/
                $(".deleteBtn").hide();
                $(".likeBtn").hide();
                $(".editBtn").hide();
                $(".commentBtn").hide();
                $(".commentTextarea").hide();
            });
        });
    }

    /*Render registered users page*/
    showUserPage(sideBarData, mainData) {
        Mustache.escape = function (value) {
            return value;
        };
        let _that = this;
        $.get('templates/welcome-user.html', function (template) {
            let renderedWrapper = Mustache.render(template, null);
            $(_that._wrapperSelector).html(renderedWrapper);
            $('.pagination').hide();
            /*Render posts in sidebar*/
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
                /*Iterate through every post and assign IDs to buttons*/
                for (let i = 0; i < mainData.length; i++) {
                    $('#display-' + i).attr('id', "display-" + mainData[i]._id);
                    $('#content-' + i).attr('id', "content-" + mainData[i]._id);
                    $('#comm-' + i).attr('id', "comm-" + mainData[i]._id);
                    $('#commentText-' + i).attr('id', "commentText-" + mainData[i]._id);
                    $('#commentsContainer-' + i).attr('id', "commentsContainer-" + mainData[i]._id);
                    $('#like-' + i).attr('id', "like-" + mainData[i]._id);
                    let creatorId = mainData[i]._acl.creator;

                    /*If own post show delete and edit buttons*/
                    if (creatorId == sessionStorage['userId']) {
                        $('#del-' + i).attr('id', "del-" + mainData[i]._id);
                        $('#edit-' + i).attr('id', "edit-" + mainData[i]._id);
                    } else {
                        $('#del-' + i).hide();
                        $('#edit-' + i).hide();
                    }

                    /*Iterate posts and find liked ones*/
                    for (let c = 0; c < mainData[i].voters.length; c++) {
                        if (mainData[i].voters[c] == sessionStorage['userId']) {
                            document.getElementById("like-" + mainData[i]._id).innerHTML = "Unlike";
                        }
                    }
                }

                /*Delete buttons and confirmation dialogs*/
                vex.defaultOptions.className = 'vex-theme-default';
                $('.deleteBtn').on('click', function (ev) {
                    let postId = this.id;
                    postId = postId.split("-")[1];
                    vex.dialog.confirm({
                        message: 'Delete post?',
                        callback: function (value) {
                            if (value) {
                                triggerEvent('deletePost', postId);
                            }
                        }
                    });
                });

                /*Like buttons handling*/
                $('.likeBtn').on('click', function (ev) {
                    let updateData;
                    let postId = this.id;
                    postId = postId.split("-")[1];
                    /*Iterate every post and find the corresponding one.!*/
                    for (let i = 0; i < mainData.length; i++) {
                        if (mainData[i]._id == postId) {
                            updateData = mainData[i];
                            break;
                        }
                    }
                    triggerEvent('ratePost', updateData);
                });

                /*Edit buttons handling*/
                $('.editBtn').on('click', function (ev) {
                    let updateData;
                    let postId = this.id;
                    postId = postId.split("-")[1];
                    /*Iterate every post and find the corresponding one.!*/
                    for (let i = 0; i < mainData.length; i++) {
                        if (mainData[i]._id == postId) {
                            updateData = mainData[i];
                            break;
                        }
                    }
                    triggerEvent('editPost', updateData);
                });

                /*Posts sorting handling*/
                $("#sort-selector").on('change', function () {
                    triggerEvent('sortPosts', this.value)
                });

                /*Comments handling*/
                $('.commentBtn').on('click', function (ev) {
                    let updateData;
                    let postId = this.id;
                    postId = postId.split("-")[1];
                    /*Iterate every post and find the corresponding one.!*/
                    for (let i = 0; i < mainData.length; i++) {
                        if (mainData[i]._id == postId) {
                            updateData = mainData[i];
                            break;
                        }
                    }
                    let content = $('#commentText-' + postId).val();
                    let author = sessionStorage['username'];
                    let newComment = {
                        content: content,
                        author: author
                    };
                    /*Add new comment to comments array*/
                    updateData.comments.push(newComment);
                    triggerEvent('commentPost', updateData);
                });
            });
        });
    }
}

