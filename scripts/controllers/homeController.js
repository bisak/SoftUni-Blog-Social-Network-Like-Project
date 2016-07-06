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

        this._requester.get(requestUrl,
            function success(data) {
                data.sort(function (elem1, elem2) {
                    let date1 = new Date(elem1.votes);
                    let date2 = new Date(elem2.votes);
                    return date2 - date1;
                });

                for (let i = 0; i < data.length; i++) {
                    data[i].postId = i;
                    recentPosts.push(data[i]);
                }

                _that._homeView.showGuestPage(recentPosts, data)
            },
            function error(data) {
                showPopup('error', "Error loading posts.");
            }
        );
    }

    showUserPage() {
        let _that = this;
        let recentPosts = [];

        let requestUrl = this._baseServiceUrl + /appdata/ + this._appkey + "/posts";

        this._requester.get(requestUrl,
            function success(data) {
                data.sort(function (elem1, elem2) {
                    let date1 = new Date(elem1.votes);//_kmd.ect //TODO SORTING
                    let date2 = new Date(elem2.votes);
                    return date2 - date1;
                });

                for (let i = 0; i < data.length; i++) {
                    data[i].postId = i;
                    recentPosts.push(data[i]);
                }

                _that._homeView.showUserPage(recentPosts, data)
            },
            function error(data) {
                showPopup('error', "Error loading posts.");
            }
        );
    }

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

    ratePost(updateData) {
        let votes = updateData.votes;
        let postId = updateData._id;
        let requestUrlPost = this._baseServiceUrl + /appdata/ + this._appkey + "/posts/" + postId;

        let currentPostData;
        $.ajaxSetup({async: false}); //This is incredibly stupid but hey it's something. (probably better than disabling it full-time!)
        this._requester.get(requestUrlPost,
            function success(data) {
                currentPostData = data;
            },
            function error(data) {
                alert(data);
            }
        );

        let hasVoted = false;
        let indexOfVoter;

        if (!currentPostData.voters) {
            currentPostData.voters = [];
        } else {
            for (let i = 0; i < currentPostData.voters.length; i++) {
                if (currentPostData.voters[i] == sessionStorage['userId']) {
                    hasVoted = true;
                    currentPostData.voters.splice(i, 1);
                    break;
                } else {
                    hasVoted = false;
                }
            }
        }

        if (hasVoted == true) {
            currentPostData.votes -= 1;
        } else {
            currentPostData.votes += 1;
            currentPostData.voters.push(sessionStorage['userId']);
        }


        this._requester.put(requestUrlPost, currentPostData,
            function success(data) {
                document.getElementById("display-" + postId).innerHTML = "Rating: " + data.votes;
                showPopup('success', "You have successfully rated a post.");
            },
            function error(data) {
                showPopup('error', "Error rating a post. Error message => " + JSON.stringify(data));
            }
        );
        $.ajaxSetup({async: true});
    }
}