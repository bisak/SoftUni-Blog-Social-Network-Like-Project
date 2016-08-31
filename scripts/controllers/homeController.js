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
}