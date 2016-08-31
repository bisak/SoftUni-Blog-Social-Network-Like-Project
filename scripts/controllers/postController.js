class PostController {
    constructor(postView, requester, baseUrl, appId) {
        this._postView = postView;
        this._requester = requester;
        this._appId = appId;
        this._baseServiceUrl = baseUrl + "/appdata/" + appId + "/posts/";
    }

    showCreatePostPage(data, isLoggedIn) {
        this._postView.showCreatePostPage(data, isLoggedIn);
    }

    showEditPostPage(data, isLoggedIn) {
        this._postView.showEditPostPage(data, isLoggedIn);
    }

    createPost(requestData) {
        /*Verify posts*/
        let requestUrl = this._baseServiceUrl;
        if (requestData.title.length > 50) {
            showPopup('error', "Post title must consist of less than 50 symbols.");
            return;
        }
        if (requestData.title.length < 6) {
            showPopup('error', "Post title must consist of atleast 6 symbols.");
            return;
        }
        if (requestData.content.length < 10) {
            showPopup('error', "Post content must consist of atleast 10 symbols.");
            return;
        }

        /*Request to create post*/
        this._requester.post(requestUrl, requestData,
            function success(data) {
                showPopup('success', "You have successfully created a new post.");
                /*Redirect to homepage on success*/
                redirectUrl("#/");
            },
            function error(data) {
                showPopup('error', "An error has occurred while attempting to create a new post.");
            });
    }

    editPost(requestData) {
        /*Verify edits*/
        let requestUrl = this._baseServiceUrl + requestData._id;
        if (requestData.title.length > 50) {
            showPopup('error', "Post title must consist of less than 60 symbols.");
            return;
        }
        if (requestData.title.length < 6) {
            showPopup('error', "Post title must consist of atleast 6 symbols.");
            return;
        }
        if (requestData.content.length < 10) {
            showPopup('error', "Post content must consist of atleast 10 symbols.");
            return;
        }
        delete requestData.postId;

        /*Request to update the data*/
        this._requester.put(requestUrl, requestData,
            function success(data) {
                showPopup('success', "You have successfully edited a post.");
                /*Redirect to homepage on success*/
                redirectUrl("#/");
            },
            function error(data) {
                showPopup('error', "An error has occurred while attempting to edit a post.");
            });
    }

    commentPost(requestData) {
        let requestUrl = this._baseServiceUrl + requestData._id;
        $("#comm-" + requestData._id).prop('disabled', true);
        console.log(requestData);
        delete requestData.postId;
        let commentContent = requestData.comments[requestData.comments.length - 1].content;
        let commentAuthor = requestData.comments[requestData.comments.length - 1].author;
        if (commentContent < 2 || commentContent > 50) {
            showPopup('error', "Post content must consist of between 2 and 50 symbols.");
            return;
        }
        this._requester.put(requestUrl, requestData,
            function success(data) {
                showPopup('success', "You have successfully commented a post.");
                $("#commentsContainer-" + requestData._id).append("<p class='subtitle'>" + commentContent + " by: " + commentAuthor + "</p>");
                $("#commentText-" + requestData._id).val('');
                $("#comm-" + requestData._id).prop('disabled', false);
            },
            function error(data) {
                showPopup('error', "An error has occurred while attempting to comment.");
                $("#comm-" + requestData._id).prop('disabled', false);
            });
    }

    /*Handle post deleting*/
    deletePost(postId) {
        let requestUrl = this._baseServiceUrl + "?query={\"_id\":" + "\"" + postId + "\"" + "}";
        this._requester.delete(requestUrl,
            function data(data) {
            },
            function success(data) {
                showPopup('success', "Successfully deleted " + data.count + " post");
                redirectUrl("#/");
            },
            function error(data) {
                showPopup('error', "Error when deleting. Error message => " + JSON.stringify(data));
                redirectUrl("#/");
            }
        );
    }

    /*Handle post rating*/
    ratePost(updateData) {
        /*Settign AJAX to run synchronously because to temporary solve some problems*/
        $.ajaxSetup({async: false});
        let votes = updateData.votes;
        let postId = updateData._id;
        let requestUrlPost = this._baseServiceUrl + postId;
        let currentPostData;
        let verifyUserId;

        /*Request to verify that userId is not changed in session storage*/
        this._requester.get("https://baas.kinvey.com/user/kid_rJCVNesB/" + sessionStorage['userId'],
            function success(data) {
                verifyUserId = true;
            },
            function error(data) {
                verifyUserId = false;
            }
        );

        /*If userId is correct, vote post (in case someone changes sessionstorage's values*/
        if (verifyUserId) {
            currentPostData = updateData;
            /*Check if user has already voted for post*/
            let hasVoted = false;
            for (let i = 0; i < currentPostData.voters.length; i++) {
                if (currentPostData.voters[i] == sessionStorage['userId']) {
                    hasVoted = true;
                    currentPostData.voters.splice(i, 1);
                    break;
                } else {
                    hasVoted = false;
                }
            }

            /*If voted, unvote and vice-versa*/
            if (hasVoted == true) {
                currentPostData.votes -= 1;
                document.getElementById("like-" + postId).innerHTML = "Like";
            } else {
                currentPostData.votes += 1;
                currentPostData.voters.push(sessionStorage['userId']);
                document.getElementById("like-" + postId).innerHTML = "Unlike";
            }

            /*Update data on server*/
            this._requester.put(requestUrlPost, currentPostData,
                function success(data) {
                    document.getElementById("display-" + postId).innerHTML = "Rating: " + data.votes;
                    showPopup('success', "You have successfully rated a post.");
                },
                function error(data) {
                    showPopup('error', "Error rating a post. Error message => " + JSON.stringify(data));
                }
            );
            /*Return AJAX to normal asynchronous operation*/
            $.ajaxSetup({async: true});
        }
    }
}
