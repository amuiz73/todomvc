(function( window ) {
	'use strict';

	/**
	 * Takes a model and view and acts as the controller between them
	 *
	 * @constructor
	 * @param {object} model The model constructor
	 * @param {object} view The view constructor
	 */
	function Controller (model, view) {
		this.model = model;
		this.view = view;

		this.$todoList = $$('#todo-list');

		this.router = Router();

		this.router.on('/', this.load.bind(this));
		this.router.on('/active', this.showActive.bind(this));
		this.router.on('/completed', this.showCompleted.bind(this));
		this.router.init();

		// Couldn't figure out how to get flatiron to run some code on
		// all pages. I tried '*', but then it overwrites ALL handlers
		// for all the other pages and only runs this.
		window.addEventListener('hashchange', function (e) {
			this.updateCounter();
			this._updateFilterState();
		}.bind(this));
	}

	/**
	 * An event to fire on load. Will get all items and display them in the todo-list
	 */
	Controller.prototype.load = function () {
		this.model.read(function (data) {
			this.$todoList.innerHTML = this.view.show(data);
		}.bind(this));
		this._updateFilterState();
	}

	/**
	 * Renders all active tasks
	 */
	Controller.prototype.showActive = function () {
		this.model.read({ completed: 0 }, function (data) {
			this.$todoList.innerHTML = this.view.show(data);
		}.bind(this));
		this._updateFilterState();
	};

	/**
	 * Renders all completed tasks
	 */
	Controller.prototype.showCompleted = function () {
		this.model.read({ completed: 1 }, function (data) {
			this.$todoList.innerHTML = this.view.show(data);
		}.bind(this));
		this._updateFilterState();
	};

	/**
	 * An event to fire whenever you want to add an item. Simply pass in the event
	 * object and it'll handle the DOM insertion and saving of the new item.
	 *
	 * @param {object} e The event object
	 */
	Controller.prototype.addItem = function (e) {
		var input = $$('#new-todo')
		  , title = title || '';
		if (e.keyCode == 13) {
			this.model.create(e.srcElement.value, function (data) {
				if (this._getCurrentPage() !== 'completed') {
					this.$todoList.innerHTML = this.$todoList.innerHTML + this.view.show(data);
				}
				input.value = '';
			}.bind(this));
		}
		this.updateCounter();
	}

	/**
	 * By giving it an ID it'll find the DOM element matching that ID, remove it from
	 * the DOM and also remove it from storage.
	 *
	 * @param {number} id The ID of the item to remove from the DOM and storage
	 */
	Controller.prototype.removeItem = function (id) {
		this.model.remove(id, function () {
			this.$todoList.removeChild($$('[data-id="' + id + '"]'));
		}.bind(this));
		this.updateCounter();
	}

	/**
	 * Will remove all completed items from the DOM and storage.
	 */
	Controller.prototype.removeCompletedItems = function () {
		this.model.read({ completed: 1 }, function (data) {
			data.forEach(function (item) {
				this.removeItem(item.id);
			}.bind(this));
		}.bind(this));
		this.updateCounter();
	}

	/**
	 * Give it an ID of a model and a checkbox and it will update the item in storage
	 * based on the checkbox's state.
	 *
	 * @param {number} id The ID of the element to complete or uncomplete
	 * @param {object} checkbox The checkbox to check the state of complete or not
	 */
	Controller.prototype.toggleComplete = function (id, checkbox) {
		var completed = checkbox.checked ? 1 : 0;
		this.model.update(id, {completed: completed}, function () {
			var listItem = $$('[data-id="' + id + '"]');
			if (completed) {
				listItem.className = 'complete';
			}
			// In case it was toggled from an event and not by clicking the checkbox...
			listItem.querySelector('input').checked = completed;
		});
		this.updateCounter();
	}

	/**
	 * Will toggle ALL checkboxe's on/off state and completeness of models. Just pass
	 * in the event objet.
	 *
	 * @param {object} e The event object
	 */
	Controller.prototype.toggleAll = function (e) {
		var completed = e.target.checked ? 1 : 0
		  , query = 0;

		if (completed == 0) {
			query = 1;
		}

		this.model.read({ completed: query }, function (data) {
			data.forEach(function (item) {
				this.toggleComplete(item.id, e.target);
			}.bind(this));
		}.bind(this));
		this.updateCounter();
	}

	/**
	 * Updates the items left to do counter.
	 */
	Controller.prototype.updateCounter = function () {
		this.model.read({ completed: 0 }, function (data) {
			$$('#todo-count').innerHTML = this.view.itemCounter(data);
		}.bind(this));
	};

	/**
	 * Simply updates the filter nav's selected states
	 */
	 Controller.prototype._updateFilterState = function () {
	 	var currentPage = this._getCurrentPage() || '';
		$('#filters .selected').each(function (item) {
			item.className = '';
		});
		$$('#filters [href="#/' + currentPage + '"]').className = 'selected';
	 }

	 /**
	  * A getter for getting the current page
	  */
	 Controller.prototype._getCurrentPage = function () {
	 	return document.location.hash.split('/')[1];
	 }

	// Export to window
	window.Controller = Controller;
})( window );
