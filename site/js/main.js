/*global $ */
(function () {
	'use strict';

	$.fn.gittip = function (username) {
		var $this = $(this);
		$.getJSON('https://www.gittip.com/' + username + '/public.json', function (response) {
			$this.text(response.receiving);
		});
	};

	$.fn.persistantPopover = function (options) {
		var popoverTimeout;
		var disablePopover = options.minWidth > $(window).width();

		function delay() {
			popoverTimeout = setTimeout(function () {
				$('.popover').hide();
			}, 100);
		}

		var links = this.each(function () {
			var $this = $(this);
			var learnKey = $this.data('learn-key');

			if (disablePopover) {
				if (learnKey) {
					$this.attr('data-learn', learnKey);
				}
				return;
			}

			$this.popover({
				trigger: 'manual',
				placement: 'left',
				animation: false,
				html: true,
				title: this.firstChild.textContent + '<a href="' + $this.data('source') + '">Website</a>',
				content: function () {
					if ($this.data('learn-key')) {
						return $this.data('description') + '<p><a href="#' + $this.data('learn-key') + '" data-learn="' + $this.data('learn-key') + '">Learn More...</a></p>';
					} else {
						return $this.data('description');
					}
				}
			});
		});

		if (disablePopover) {
			return;
		}

		links.mouseenter(function () {
			clearTimeout(popoverTimeout);
			$('.popover').remove();
			$(this).popover('show');
		});

		links.mouseleave(function () {delay();
			$('.popover').mouseenter(function () {
				clearTimeout(popoverTimeout);
			}).mouseleave(function () {
				delay();
			});
		});

		return links;
	};

	function redirect() {
		if (location.hostname === 'addyosmani.github.io') {
			location.href = location.href.replace('addyosmani.github.io/todomvc', 'todomvc.com');
		}
	}

	var Quotes = {};
	Quotes.build = function (quotes, template) {
		var quoteContainer = document.createElement('q');
		var quoteElemCount = 0;
		var quoteCount = quotes.length;

		var createQuoteElems = function () {
			var quote = quotes[quoteElemCount];
			var el = $(template).hide();

			el.children('p').text(quote.quote);
			el.find('a').text(quote.person.name).attr('href', quote.person.link);
			el.find('img').attr('src', quote.person.gravatar);

			quoteContainer.appendChild(el[0]);

			if (quoteCount > ++quoteElemCount) {
				createQuoteElems();
			}

			return quoteContainer.innerHTML;
		};
		return createQuoteElems();
	};

	Quotes.random = function (quotes) {
		var quoteCount = quotes.length;
		var randomQuotes = [];

		var randomQuote = function () {
			var randomQuoteIndex = Math.floor(Math.random() * quoteCount);

			if ($.inArray(randomQuoteIndex, randomQuotes) > -1) {
				return randomQuote();
			}

			if (randomQuotes.length === quoteCount - 1) {
				randomQuotes = [];
			}

			randomQuotes.push(randomQuoteIndex);

			return randomQuoteIndex;
		};
		return randomQuote;
	};

	Quotes.animate = function (container, animSpeed) {
		var fader = function (fadeOut, fadeIn) {
			var fadeOutCallback = function () {
				fadeIn.fadeIn(500, fadeInCallback);
			};

			var fadeInCallback = function () {
				window.setTimeout(swap, animSpeed);
			};

			fadeOut.fadeOut(500, fadeOutCallback);
		};

		var quotes = container.children();
		var selectRandomQuoteIndex = Quotes.random(quotes);
		var quoteElems = {};
		var activeQuoteIndex = selectRandomQuoteIndex();
		var prevQuoteElem = $(quotes[activeQuoteIndex]);

		var swap = function () {
			if (!quoteElems[activeQuoteIndex]) {
				quoteElems[activeQuoteIndex] = $(quotes[activeQuoteIndex]);
			}

			var activeQuoteElem = quoteElems[activeQuoteIndex];

			fader(prevQuoteElem, activeQuoteElem);

			activeQuoteIndex = selectRandomQuoteIndex();
			prevQuoteElem = activeQuoteElem;
		};
		return swap();
	};

	Quotes.init = function (quotes) {
		var container = $(this);
		var template = $(this).html();
		var quotesHTML = Quotes.build(quotes, template);

		container.html(quotesHTML);

		Quotes.animate(container, 25000);
	};

	$.fn.quote = function (quotes) {
		return this.each(function () {
			Quotes.init.call(this, quotes);
		});
	};

	var Learn = {};
	Learn.saveJSON = function (json) {
		this.frameworks = json;
		this.haystack = Object.keys(json).join(' ');
	};

	Learn.parseTemplate = function () {
		var framework = this.frameworks[this.activeFramework];
		var linksTemplate = this.$template.links;
		var parser = this.parser;

		var body = $(this.$template.header.replace(parser, function (match, key) {
			return framework[key];
		}));

		body.find('.source-links').html($.map(framework.source_path, function (sourcePath) {
			var demoLink = '<a href="' + sourcePath.url + '">Demo</a>, ';
			var sourceLink = ' <a href="https://github.com/addyosmani/todomvc/tree/gh-pages/' + sourcePath.url + '">Source</a>';
			return '<h5>' + sourcePath.name + '</h5><p>' + demoLink + sourceLink + '</p>';
		}).join(''));

		body.append($.map(framework.link_groups, function (linkGroup) {
			var links = '<h4>' + linkGroup.heading + '</h4>';
			links += '<ul>';
			links += $.map(linkGroup.links, function (link) {
				return '<li>' + linksTemplate.replace(parser, function (match, key) {
					return link[key];
				}) + '</li>';
			}).join('');
			links += '</ul>';
			return links;
		}).join(''));

		body.append(this.$template.footer);

		this.$el.container.html(body.html());
	};

	Learn.loadFramework = function (framework, options) {
		if (framework === this.activeFramework || !this.frameworks[framework]) {
			return;
		}

		this.activeFramework = framework;
		window.location.hash = framework;

		this.$el.container.fadeOut($.proxy(this.parseTemplate, this)).fadeIn();

		if (options && options.animate) {
			$(document.body).animate({
				scrollTop: this.$el.container.offset().top - 10
			}, 1000);
		}
	};

	Learn.search = function (searchTerm) {
		var pattern = searchTerm.split('').reduce(function (a, b) {
			return a + '[^\\s]*' + b + '[^\\s]*';
		}, '');

		var match = this.haystack.match(new RegExp(pattern));

		if (match) {
			return $.trim(match[0]);
		}
	};

	Learn.searchKeyup = function (e) {
		var searchKey = $.trim(e.currentTarget.value);

		if (searchKey === '') {
			return;
		}

		var matchedKey = this.search(searchKey);

		if (matchedKey) {
			this.loadFramework(matchedKey);
		}
	};

	Learn.linkClick = function (e) {
		e.preventDefault();

		this.$el.search.val('');

		var mobile = $(window).width() < 768;

		if (!mobile) {
			$('.popover').delay(200).animate({
				left: -60,
				opacity: 0
			}, 1000);

			this.$el.mask.stop().fadeIn(1000).delay(1000).fadeOut(1000);
		}

		this.loadFramework($(e.currentTarget).data(this.key), { animate: true });
	};

	Learn.loadFromHash = function () {
		var hashKey = window.location.hash.substr(1);

		if (hashKey) {
			this.loadFramework(hashKey);
		}
	};

	Learn.init = function (container, options) {
		$.getJSON(options.json)
			.then($.proxy(this.saveJSON, this))
			.then($.proxy(this.loadFromHash, this));

		this.parser = /\{\{([^}]*)\}\}/g;

		this.key = options.key;

		this.$el = {};
		this.$el.mask = options.mask;
		this.$el.container = options.container;
		this.$el.search = options.search;

		this.$template = {};
		this.$template.header = options.container.clone().children('ul, footer').remove().end()[0].outerHTML;
		this.$template.links = options.container.children('ul').clone().find('a')[0].outerHTML;
		this.$template.footer = options.container.children('footer')[0].outerHTML;

		this.$el.search.on('keyup', $.proxy(this.searchKeyup, this));

		container.on('click', '[data-' + this.key + ']', $.proxy(this.linkClick, this));
	};

	$.fn.learn = function (options) {
		Learn.init(this, options);
	};

	// Redirect if not on main site.
	redirect();

	// Apps popover
	$('.applist a').persistantPopover({
		minWidth: 768
	});

	$(document.body).learn({
		key: 'learn',
		json: 'learn.json',
		mask: $('.mask'),
		container: $('.learn'),
		search: $('.search')
	});

	$('.gittip-amount').gittip('tastejs');

	// Quotes
	$('.quotes').quote([{
		quote: 'TodoMVC is a godsend for helping developers find what well-developed frameworks match their mental model of application architecture.',
		person: {
			name: 'Paul Irish',
			gravatar: 'http://gravatar.com/avatar/ffe68d6f71b225f7661d33f2a8908281?s=40',
			link: 'https://github.com/paulirish'
		}
	}, {
		quote: 'Modern JavaScript developers realise an MVC framework is essential for managing the complexity of their apps. TodoMVC is a fabulous community contribution that helps developers compare frameworks on the basis of actual project code, not just claims and anecdotes.',
		person: {
			name: 'Michael Mahemoff',
			gravatar: 'http://gravatar.com/avatar/cabf735ce7b8b4471ef46ea54f71832d?s=40',
			link: 'https://github.com/mahemoff'
		}
	}, {
		quote: 'TodoMVC is an immensely valuable attempt at a difficult problem - providing a structured way of comparing JS libraries and frameworks. TodoMVC is a lone data point in a sea of conjecture and opinion.',
		person: {
			name: 'Justin Meyer',
			gravatar: 'http://gravatar.com/avatar/70ee60f32937b52758869488d5753259?s=40',
			link: 'https://github.com/justinbmeyer'
		}
	}, {
		quote: 'It can be hard to make the leap from hacking together code that works to writing code that`s organized, maintainable, reusable, and a joy to work on. The TodoMVC project does a great job of introducing developers to different approaches to code organization, and to the various libraries that can help them along the way. If you`re trying to get your bearings in the world of client-side application development, the TodoMVC project is a great place to get started.',
		person: {
			name: 'Rebecca Murphey',
			gravatar: 'http://gravatar.com/avatar/0177cdce6af15e10db15b6bf5dc4e0b0?s=40',
			link: 'https://github.com/rmurphey'
		}
	}]);

}());
