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

	function findRoot() {
		var base = ['labs', 'architecture-examples', 'dependency-examples'].filter(function (href) {
			return location.href.match(new RegExp(href));
		})[0];

		return location.href.substr(0, location.href.indexOf(base));
	}

	function getFile(file, callback) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', findRoot() + file, true);
		xhr.send();

		xhr.onload = function () {
			if (xhr.status === 200 && callback) {
				callback(xhr.responseText);
			}
		};
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
			framework = config.framework;
		}

		this.template = this.template || learnJSON.templates && learnJSON.templates.todomvc;
		framework = framework || document.body.parentNode.getAttribute('data-framework');

		if (learnJSON[framework]) {
			this.frameworkJSON = learnJSON[framework];

			this.append();
		}
	}

	Learn.prototype._prepareTemplate = function () {
		var aside = document.createElement('aside');

		var block = aside.cloneNode(aside);
		block.innerHTML = this.template;

		var header = block.cloneNode(aside);
		header.removeChild(header.querySelector('ul'));
		header.removeChild(header.querySelectorAll('footer')[1]);

		return {
			header: header,
			links: block.cloneNode(aside).querySelector('ul a'),
			footer: block.cloneNode(aside).querySelectorAll('footer')[1]
		};
	};

	Learn.prototype._parseTemplate = function () {
		if (!this.template) {
			return;
		}

		var frameworkJSON = this.frameworkJSON;
		var template = this._prepareTemplate();

		var aside = document.createElement('aside');
		var linksTemplate = template.links.outerHTML;
		var parser = /\{\{([^}]*)\}\}/g;

		var header, examples, links;

		header = template.header.innerHTML.replace(parser, function (match, key) {
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

			aside.innerHTML += links;
			aside.innerHTML += template.footer.outerHTML;
		}

		return aside;
	};

	Learn.prototype.append = function () {
		var aside = this._parseTemplate();

		aside.className = 'learn';

		document.body.className = (document.body.className + ' learn-bar').trim();
		document.body.insertAdjacentElement('afterBegin', aside);
	};

	appendSourceLink();
	redirect();
	getFile('learn.json', Learn);
})();
