
(function ($) {

	var fbfeed = 'fbfeed';
		settings = {},
		defaults = {
			items: 1
		},
		API_BASE = 'https://graph.facebook.com/',
		FB_PAGE_BASE = 'https://www.facebook.com/pages/',
		POST_BASE = 'https://www.facebook.com/permalink.php';

	function showError(message) {
		console.log(message);
		alert(message);
	}

	function fbResponse(response) {
		if (response.error) {
			return showError(response.error.message);
		}

		var items = [];
		for (var i = 0; post = response.data[i]; i++) {
			var date = /([\d-]+)T([\d:]+)\+(.+)/.exec(post.created_time),
				ids = /(\d+)_(\d+)/.exec(post.id),
				item = $.extend({}, post, {
					date: date[1],
					time: date[2],
					user_id: ids[1],
					post_id: ids[2]
				});

			items.push(item);
		}

		var user = items[0].from;
		user.page_link = FB_PAGE_BASE + settings.page + '/' + user.id;

		showItems(user, items);
	}

	function showItems(user, items) {
		var data = {
				API_BASE: API_BASE,
				POST_BASE: POST_BASE,
				user: user,
				items: items
			};

		console.log(items);

		$(settings.template).tmpl(data).appendTo(settings.$target);
	}

	$.fn[fbfeed] = function (options) {
		settings = $.extend({}, defaults, options);
		settings.$target = this;

		settings.$target.empty();

		$.ajax({
			url: API_BASE + settings.id + '/feed/?limit=' + settings.items + '&access_token=' + settings.token,
			dataType: 'jsonp',
			success: fbResponse
		});
	}

}(jQuery));
