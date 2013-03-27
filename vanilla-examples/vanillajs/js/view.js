(function( window ) {
	'use strict';

	/**
	 * Sets up defaults for all the View methods such as a default template
	 *
	 * @constructor
	 */
	function View () {
		this.defaultTemplate = '\
			<li data-id="{{id}}" class="{{complete}}">\
				<div class="view">\
					<input class="toggle" type="checkbox" {{checked}}>\
					<label>{{title}}</label>\
					<button class="destroy"></button>\
				</div>\
			</li>'
	}

	/**
	 * Creates an <li> HTML string and returns it for placement in your app.
	 * NOTE: In real life you should be using a templating engine such
	 * as Mustache or Handlebars, however, this is a vanilla JS example.
	 *
	 * @param {object} data The object containing keys you want to find in the template
	 * to replace.
	 * @returns {string} HTML string of an <li> element
	 *
	 * @example
	 * view.show({
	 *	id: 1,
	 *	title: "Hello World",
	 *	completed: 0,
	 * });
	 */
	View.prototype.show = function (data) {
		var view = '';
		for (var i = 0; i < data.length; i++) {
			var template = this.defaultTemplate
			  , complete = ''
			  , checked	 = '';
			if (data[i].completed == 1) {
				complete = 'complete';
				checked = 'checked';
			}
			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{title}}', data[i].title);
			template = template.replace('{{complete}}', complete);
			template = template.replace('{{checked}}', checked);
			view = view + template;
		}
		return view;
	}

	/**
	 * Displays a counter of how many to dos are left to complete
	 * @param {object} data The object of active to dos.
	 * @returns {string} String containing the count
	 */
	View.prototype.itemCounter = function (data) {
		var itemLength = Object.keys(data).length;
		var plural = itemLength == 1 ? '' : 's';
		return '<strong>' + itemLength + '</strong> item' + plural + ' left';
	}

	// Export to window
	window.View = View;
})( window );
