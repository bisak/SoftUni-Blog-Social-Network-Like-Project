class HomeController {
    constructor(homeView, requester, baseServiceUrl, appkey) {
        this._homeView = homeView;
        this._requester = requester;
        this._appkey = appkey;
        this._baseServiceUrl = baseServiceUrl;
    }

    showGuestPage() {
        let _that = this;
        let recentPosts = [];
        let requestUrl = this._baseServiceUrl + /appdata/ + this._appkey + "/posts";
        /*GET request to server to get posts*/
        this._requester.get(requestUrl,
            function success(data) {
                data.sort(function (elem1, elem2) {
                    let date1 = new Date(elem1.votes);
                    let date2 = new Date(elem2.votes);
                    return date2 - date1;
                });
                /*Sidebar data*/
                for (let i = 0; i < data.length; i++) {
                    data[i].postId = i;
                    recentPosts.push(data[i]);
                }
                _that._homeView.showGuestPage(recentPosts, data)
            },/*Handle errors*/
            function error(data) {
                showPopup('error', "Error getting posts from server.");
            }
        );
    }

    showUserPage(sorting) {
        let _that = this;
        let recentPosts = [];
        let requestUrl = this._baseServiceUrl + /appdata/ + this._appkey + "/posts";
        /*Default sorting*/
        if (sorting === undefined) {
            sorting = "votes-high";
        }
        /*GET request to server to get posts*/
        this._requester.get(requestUrl,
            function success(data) {
            /*Select sorting*/
                if (sorting == "votes-high") {
                    data.sort(function (elem1, elem2) {
                        let date1 = new Date(elem1.votes);
                        let date2 = new Date(elem2.votes);
                        return date2 - date1;
                    });
                } else if (sorting == "votes-low") {
                    data.sort(function (elem1, elem2) {
                        let date2 = new Date(elem1.votes);
                        let date1 = new Date(elem2.votes);
                        return date2 - date1;
                    });
                }
                else if (sorting == "newest") {
                    data.sort(function (elem1, elem2) {
                        let date1 = new Date(elem1._kmd.ect);
                        let date2 = new Date(elem2._kmd.ect);
                        return date2 - date1;
                    });
                } else if (sorting == "oldest") {
                    data.sort(function (elem1, elem2) {
                        let date2 = new Date(elem1._kmd.ect);
                        let date1 = new Date(elem2._kmd.ect);
                        return date2 - date1;
                    });
                }
                /*Sidebar data*/
                for (let i = 0; i < data.length; i++) {
                    data[i].postId = i;
                    recentPosts.push(data[i]);
                }
                _that._homeView.showUserPage(recentPosts, data)
            },/*Handle errors*/
            function error(data) {
                showPopup('error', "Error loading posts.");
            }
        );
    }

    /*Handle post deleting*/
    deletePost(postId) {
        let requestUrl = this._baseServiceUrl + /appdata/ + this._appkey + "/posts/?query={\"_id\":" + "\"" + postId + "\"" + "}";
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
        let requestUrlPost = this._baseServiceUrl + /appdata/ + this._appkey + "/posts/" + postId;
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

        /*If userId is correct, vote post*/
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