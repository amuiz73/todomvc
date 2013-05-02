(function () {
	'use strict';

	if (location.hostname === 'todomvc.com') {
		window._gaq = [['_setAccount','UA-31081062-1'],['_trackPageview']];(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.src='//www.google-analytics.com/ga.js';s.parentNode.insertBefore(g,s)}(document,'script'));
	}

	function getSourcePath() {
		// If accessed via addyosmani.github.io/todomvc/, strip the project path.
		if (location.hostname.indexOf('github.io') > 0) {
			return location.pathname.replace(/todomvc\//, '');
		}
		return location.pathname;
	}

	function appendSourceLink() {
		var sourceLink = document.createElement('a');
		var paragraph = document.createElement('p');
		var footer = document.getElementById('info');
		var urlBase = 'https://github.com/addyosmani/todomvc/tree/gh-pages';

		if (footer) {
			sourceLink.href = urlBase + getSourcePath();
			sourceLink.appendChild(document.createTextNode('Check out the source'));
			paragraph.appendChild(sourceLink);
			footer.appendChild(paragraph);
		}
	}

	function redirect() {
		if (location.hostname === 'addyosmani.github.io') {
			location.href = location.href.replace('addyosmani.github.io/todomvc', 'todomvc.com');
		}
	}

	function getFile(file, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', file, true);
		xhr.send();

		xhr.onload = function () {
			if (xhr.status !== 200) {
				return;
			}

			callback(xhr.responseText);
		};
	}

	var Learn = {};
	Learn._prepareTemplate = function (template) {
		var aside = document.createElement('aside');

		var block = aside.cloneNode(aside);
		block.innerHTML = template;

		var header = block.cloneNode(aside).querySelector('.learn');
		header.removeChild(header.querySelector('ul'));
		header.removeChild(header.querySelectorAll('footer')[1]);

		return {
			header: header.outerHTML,
			links: block.cloneNode(aside).querySelector('ul a').outerHTML,
			footer: block.cloneNode(aside).querySelectorAll('footer')[1].outerHTML
		};
	};

	Learn._parseTemplate = function (framework, template) {
		var aside = document.createElement('aside');
		var linksTemplate = template.links;
		var parser = /\{\{([^}]*)\}\}/g;

		var header, examples, links;

		header = template.header.replace(parser, function (match, key) {
			return framework[key];
		});

		aside.innerHTML = header;

		if (framework.examples) {
			examples = framework.examples.map(function (example) {
				return ''
				+ '<h5>' + example.name + '</h5>'
				+ '<p>'
				+ '  <a href="https://github.com/addyosmani/todomvc/tree/gh-pages/' + (example.source_url || example.url) + '">Source</a>'
				+ '</p>';
			}).join('');

			aside.querySelector('.source-links').innerHTML = examples;
		}

		if (framework.link_groups) {
			links = framework.link_groups.map(function (linkGroup) {
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

	Learn.append = function (container, framework, template) {
		template = this._prepareTemplate(template);

		var innerHTML = this._parseTemplate(framework, template);

		if (typeof innerHTML === 'string') {
			document.body.className = (document.body.className + ' learn-bar').trim();

			container.innerHTML = innerHTML;
		}
	};

	Learn.init = function (learnJSON) {
		learnJSON = JSON.parse(learnJSON);

		var framework;
		var template = learnJSON.templates && learnJSON.templates.todomvc;
		var container = document.querySelector('body > aside');

		if (container) {
			framework = container.getAttribute('data-framework');
		}

		if (framework && learnJSON[framework] && typeof template === 'string') {
			Learn.append(container, learnJSON[framework], template);
		}
	};

	appendSourceLink();
	redirect();
	getFile('../../../learn.json', Learn.init);
})();
