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

	var Learn = {};
	Learn.saveJSON = function (json) {
		this.json = JSON.parse(json);
	};

	Learn.prepareTemplate = function () {
		var block = document.createElement();

		var template = document.createElement();
		template.innerHTML = this.json.templates.todomvc;

		var header = template.cloneNode(block);
		header.querySelector('ul').remove();
		header.querySelectorAll('footer')[1].remove();

		this.$template = {};
		this.$template.header = header.innerHTML;
		this.$template.links = template.cloneNode(block).querySelector('ul a').outerHTML;
		this.$template.footer = template.cloneNode(block).querySelectorAll('footer')[1].outerHTML;
	};

	Learn.append = function () {
		var framework = this.json[this.frameworkName];

		var linksTemplate = this.$template.links;
		var parser = this.parser;

		var section = document.createElement('section');

		section.innerHTML += this.$template.header.replace(parser, function (match, key) {
			return framework[key];
		});

		section.querySelector('.source-links').innerHTML = framework.examples.map(function (example) {
			var sourceHref = example.source_url || example.url;
			return '<h5>' + example.name + '</h5><p><a href="https://github.com/addyosmani/todomvc/tree/gh-pages/' + sourceHref + '">Source</a></p>';
		}).join('');

		if (framework.link_groups) {
			section.querySelector('.learn').innerHTML += framework.link_groups.map(function (linkGroup) {
				var links = '<h4>' + linkGroup.heading + '</h4>';
				links += '<ul>';
				links += linkGroup.links.map(function (link) {
					return '<li>' + linksTemplate.replace(parser, function (match, key) {
						return link[key];
					}) + '</li>';
				}).join('');
				links += '</ul>';
				return links;
			}).join('');

			section.querySelector('.learn').innerHTML += this.$template.footer;
		}

		document.body.classList.add('learn-bar');
		this.$el.container.innerHTML = section.innerHTML;
	};

	Learn.getJSON = function (path) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', path, true);
		xhr.send(null);

		xhr.onload = function () {
			if (xhr.status !== 200) {
				return;
			}

			this.saveJSON(xhr.responseText);
			this.prepareTemplate();
			this.append();
		}.bind(this);
	};

	Learn.init = function () {
		this.parser = /\{\{([^}]*)\}\}/g;

		this.$el = {};
		this.$el.container = document.querySelector('body > aside');
		this.frameworkName = this.$el.container && this.$el.container.dataset.framework;

		if (!this.frameworkName) {
			return;
		}

		this.getJSON('../../../learn.json');
	};

	appendSourceLink();
	redirect();
	Learn.init();
})();
