class PostView {
    constructor(wrapperSelector, mainContentSelector) {
        this._wrapperSelector = wrapperSelector;
        this._mainContentSelector = mainContentSelector;
    }

    showCreatePostPage(data, isLoggedIn) {
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
            $.get('templates/create-post.html', function (template) {
                var renderedContent = Mustache.render(template, null);
                $(_that._mainContentSelector).html(renderedContent);
                $('#author').val(data.fullname);
                /*Run HTML Editor*/
                initHtmlEditor();
                $('#create-new-post-request-button').on('click', function (ev) {
                    let title = $('#title').val();
                    let author = $('#author').val();
                    title = escapeHtml(title);
                    author = escapeHtml(author);
                    let content = tinyMCE.get('content').getContent();
                    let date = moment().format("MMMM Do YYYY");
                    /*Set permissions to global write/read to enable other users to like posts later*/
                    let permissions = {
                        creator: sessionStorage['userId'],
                        gr: true,
                        gw: true
                    };
                    let data = {
                        _acl: permissions,
                        title: title,
                        author: author,
                        content: content,
                        date: date,
                        votes: 0,
                        voters: [],
                        comments: []
                    };
                    triggerEvent('createPost', data);
                });
            })
        })
    }

    showEditPostPage(data, isLoggedIn) {
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
            $.get('templates/create-post.html', function (template) {
                var renderedContent = Mustache.render(template, null);
                $(_that._mainContentSelector).html(renderedContent);
                $('#author').val(data.author);
                $('#title').val(data.title);
                $('#content').html(data.content);
                /*Run HTML Editor*/
                initHtmlEditor();
                $('#create-new-post-request-button').on('click', function (ev) {
                    let title = $('#title').val();
                    let content = tinyMCE.get('content').getContent();
                    let date = moment().format("MMMM Do YYYY");
                    title = escapeHtml(title);
                    data.title = title;
                    data.content = content;
                    data.date = date;
                    triggerEvent('editPostRequest', data);
                });
            })
        })
    }
}