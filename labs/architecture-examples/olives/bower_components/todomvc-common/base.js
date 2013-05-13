(function () {
	'use strict';

	if (location.hostname === 'todomvc.com') {
		window._gaq = [['_setAccount','UA-31081062-1'],['_trackPageview']];(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.src='//www.google-analytics.com/ga.js';s.parentNode.insertBefore(g,s)}(document,'script'));
	}

	function getSourcePath() {
		// If accessed via tastejs.github.io/todomvc/, strip the project path.
		if (location.hostname.indexOf('github.io') > 0) {
			return location.pathname.replace(/todomvc\//, '');
		}
		return location.pathname;
	}

	function appendSourceLink() {
		var sourceLink = document.createElement('a');
		var paragraph = document.createElement('p');
		var footer = document.getElementById('info');
		var urlBase = 'https://github.com/tastejs/todomvc/tree/gh-pages';

		if (footer) {
			sourceLink.href = urlBase + getSourcePath();
			sourceLink.appendChild(document.createTextNode('Check out the source'));
			paragraph.appendChild(sourceLink);
			footer.appendChild(paragraph);
		}
	}

	function redirect() {
		if (location.hostname === 'tastejs.github.io') {
			location.href = location.href.replace('tastejs.github.io/todomvc', 'todomvc.com');
		}
	}

	function getFile(file, options) {
		var xhr = new XMLHttpRequest();
		var messageThrown = false;
		var attempts = 0;

		var trying = function (file) {
			if (++attempts > options.depth) {
				return;
			}

			xhr.open('GET', file, true);
			xhr.send();

			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4) {
					return;
				}

				if (xhr.status === 200 && options.callback) {
					options.callback(xhr.responseText);
				}

				if (xhr.status === 404) {
					if (!messageThrown) {
						console.warn('We are trying to find the learn.json file. Ignore these warnings!');
						messageThrown = true;
					}

					// If the file wasn't found, try going a directory up.
					trying('../' + file);
				}
			}
		};

		trying(file);
	}

	function Learn(learnJSON, config) {
		if (!(this instanceof Learn)) {
			return new Learn(learnJSON, config);
		}

		var framework;

		if (typeof learnJSON !== 'object') {
			learnJSON = JSON.parse(learnJSON);
		}

		if (config) {
			this.template = config.template;
			this.container = config.container;
			framework = config.framework;
		}

		this.template = this.template || learnJSON.templates && learnJSON.templates.todomvc;
		this.container = this.container || document.querySelector('body > aside');
		framework = framework || this.container && this.container.getAttribute('data-framework');

		if (learnJSON[framework]) {
			this.frameworkJSON = learnJSON[framework];

			this.append();
		}
	}

	Learn.prototype._prepareTemplate = function () {
		var aside = document.createElement('aside');

		var block = aside.cloneNode(aside);
		block.innerHTML = this.template;

		var header = block.cloneNode(aside).querySelector('.learn');
		header.removeChild(header.querySelector('ul'));
		header.removeChild(header.querySelectorAll('footer')[1]);

		return {
			header: header.outerHTML,
			links: block.cloneNode(aside).querySelector('ul a').outerHTML,
			footer: block.cloneNode(aside).querySelectorAll('footer')[1].outerHTML
		};
	};

	Learn.prototype._parseTemplate = function () {
		if (!this.template) {
			return;
		}

		var frameworkJSON = this.frameworkJSON;
		var template = this._prepareTemplate();

		var aside = document.createElement('aside');
		var linksTemplate = template.links;
		var parser = /\{\{([^}]*)\}\}/g;

		var header, examples, links;

		header = template.header.replace(parser, function (match, key) {
			return frameworkJSON[key];
		});

		aside.innerHTML = header;

		if (frameworkJSON.examples) {
			examples = frameworkJSON.examples.map(function (example) {
				return ''
				+ '<h5>' + example.name + '</h5>'
				+ '<p>'
				+ '  <a href="https://github.com/tastejs/todomvc/tree/gh-pages/' + (example.source_url || example.url) + '">Source</a>'
				+ '</p>';
			}).join('');

			aside.querySelector('.source-links').innerHTML = examples;
		}

		if (frameworkJSON.link_groups) {
			links = frameworkJSON.link_groups.map(function (linkGroup) {
				return ''
				+ '<h4>' + linkGroup.heading + '</h4>'
				+ '<ul>'
				+ linkGroup.links.map(function (link) {
					return ''
					+ '<li>'
					+ linksTemplate.replace(parser, function (match, key) {
						return link[key];
					})
					+ '</li>';
				}).join('')
				+ '</ul>';
			}).join('');

			aside.querySelector('.learn').innerHTML += links;
			aside.querySelector('.learn').innerHTML += template.footer;
		}

		return aside.innerHTML;
	};

	Learn.prototype.append = function () {
		var innerHTML = this._parseTemplate();

		if (typeof innerHTML === 'string') {
			document.body.className = (document.body.className + ' learn-bar').trim();
			this.container.innerHTML = innerHTML;
		}
	};

	appendSourceLink();
	redirect();
	getFile('../../learn.json', { depth: 2, callback: Learn });
})();
