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
                $(".editBtn").hide();
                $(".commentBtn").hide();
                $(".commentTextarea").hide();
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
            $('.pagination').hide();

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
                    if (userId == sessionStorage['userId']) {
                        $('#del-' + i).attr('id', "del-" + mainData[i]._id);
                        $('#like-' + i).attr('id', "like-" + mainData[i]._id);
                        $('#edit-' + i).attr('id', "edit-" + mainData[i]._id);
                        for (let c = 0; c < mainData[i].voters.length; c++) {
                            if (mainData[i].voters[c] == sessionStorage['userId']) {
                                document.getElementById("like-" + mainData[i]._id).innerHTML = "Unlike";
                                break;
                            }
                        }
                    } else {
                        $('#del-' + i).hide();
                        $('#edit-' + i).hide();
                    }
                    $('#display-' + i).attr('id', "display-" + mainData[i]._id);
                    $('#content-' + i).attr('id', "content-" + mainData[i]._id);
                    $('#comm-' + i).attr('id', "comm-" + mainData[i]._id);
                    $('#commentText-' + i).attr('id', "commentText-" + mainData[i]._id);
                    $('#commentsContainer-' + i).attr('id', "commentsContainer-" + mainData[i]._id);
                }

                vex.defaultOptions.className = 'vex-theme-default';
                $('.deleteBtn').on('click', function (e) {
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

                $('.likeBtn').on('click', function (ev) {
                    let updateData;
                    let postId = this.id;
                    postId = postId.split("-")[1];
                    for (let i = 0; i < mainData.length; i++) {
                        if (mainData[i]._id == postId) {
                            updateData = mainData[i];
                            break;
                        }
                    }
                    triggerEvent('ratePost', updateData);
                });

                $('.editBtn').on('click', function (ev) {
                    let updateData;
                    let postId = this.id;
                    postId = postId.split("-")[1];
                    for (let i = 0; i < mainData.length; i++) {
                        if (mainData[i]._id == postId) {
                            updateData = mainData[i];
                            break;
                        }
                    }
                    triggerEvent('editPost', updateData);
                });


                $("#sort-selector").on('change', function () {
                    triggerEvent('sortPosts', this.value)
                });

                $('.commentBtn').on('click', function (ev) {
                    let updateData;
                    let postId = this.id;
                    postId = postId.split("-")[1];
                    for (let i = 0; i < mainData.length; i++) {
                        if (mainData[i]._id == postId) {
                            updateData = mainData[i];
                            break;
                        }
                    }
                    let content = $('#commentText-' + postId).val();
                    let author = sessionStorage['fullname'];
                    let newComment = {
                        content: content,
                        author: author
                    };
                    updateData.comments.push(newComment);
                    triggerEvent('commentPost', updateData);
                });
            });
        });
    }
}

