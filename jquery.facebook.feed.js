
(function ($) {

	var fbfeed = 'fbfeed',
		fbuser = 'fbuser',
		settings_user = {},
		settings_feed = {},
		defaults_user = {
			template: '#template-' + fbuser
		},
		defaults_feed = {
			items: 3,
			template: '#template-' + fbfeed
		},
		API_BASE = 'https://graph.facebook.com/',
		FB_PAGE_BASE = 'https://www.facebook.com/pages/',
		POST_BASE = 'https://www.facebook.com/permalink.php';

	function showError(message) {
		console.log(message);
	}

	function fbResponseUser(response) {
		if (response.error) {
			return showError(response.error.message);
		}

		showUser(response);
	}

	function showUser(user) {
		$(settings_user.template).tmpl(user).appendTo(settings_user.$target);
	}

	function fbResponseFeed(response) {
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

				if (typeof item.message === 'undefined') {
					item.message = item.story;
				}

			items.push(item);
		}

		showItems(items);
	}

	function showItems(items) {
		var data = {
				POST_BASE: POST_BASE,
				items: items
			};

		$(settings_feed.template).tmpl(data).appendTo(settings_feed.$target);
	}

	$.fn[fbuser] = function (options) {
		settings_user = $.extend({}, defaults_user, options);

		settings_user.$target = this;
		settings_user.$target.empty();

		$.ajax({
			url: API_BASE + settings_user.id + '/?fields=name,picture,link',
			dataType: 'jsonp',
			success: fbResponseUser
		});
	}

	$.fn[fbfeed] = function (options) {
		settings_feed = $.extend({}, defaults_feed, options);

		settings_feed.$target = this;
		settings_feed.$target.empty();

		$.ajax({
			url: API_BASE + settings_feed.id + '/feed/?limit=' + settings_feed.items + '&access_token=' + settings_feed.token,
			dataType: 'jsonp',
			success: fbResponseFeed
		});
	}

}(jQuery));
