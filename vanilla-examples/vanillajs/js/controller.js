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

	}

	/**
	 * An event to fire on load. Will get all items and display them in the todo-list
	 */
	Controller.prototype.load = function () {
		var self = this;
		self.model.read(function (data) {
			self.$todoList.innerHTML = self.view.show(data);
		});
		self.updateCounter();
	}

	/**
	 * Renders all active tasks
	 */
	Controller.prototype.showActive = function () {
		var self = this;
		self.model.read({ completed: 0 }, function (data) {
			self.$todoList.innerHTML = self.view.show(data);
		});
		self.updateCounter();
	};

	/**
	 * Renders all completed tasks
	 */
	Controller.prototype.showCompleted = function () {
		var self = this;
		self.model.read({ completed: 1 }, function (data) {
			self.$todoList.innerHTML = self.view.show(data);
		});
		self.updateCounter();
	};

	/**
	 * An event to fire whenever you want to add an item. Simply pass in the event
	 * object and it'll handle the DOM insertion and saving of the new item.
	 *
	 * @param {object} e The event object
	 */
	Controller.prototype.addItem = function (e) {
		var input = $$('#new-todo')
		  , title = title || ''
		  , self = this;
		if (e.keyCode == 13) {
			self.model.create(e.srcElement.value, function (data) {
				self.$todoList.innerHTML = self.$todoList.innerHTML + self.view.show(data);
				input.value = '';
			});
		}
		self.updateCounter();
	}

	/**
	 * By giving it an ID it'll find the DOM element matching that ID, remove it from
	 * the DOM and also remove it from storage.
	 *
	 * @param {number} id The ID of the item to remove from the DOM and storage
	 */
	Controller.prototype.removeItem = function (id) {
		var self = this;
		self.model.remove(id, function () {
			self.$todoList.removeChild($$('[data-id="' + id + '"]'));
		});
		self.updateCounter();
	}

	/**
	 * Will remove all completed items from the DOM and storage.
	 */
	Controller.prototype.removeCompletedItems = function () {
		var self = this;
		self.model.read({ completed: 1 }, function (data) {
			data.forEach(function (item) {
				self.removeItem(item.id);
			})
		});
		self.updateCounter();
	}

	/**
	 * Give it an ID of a model and a checkbox and it will update the item in storage
	 * based on the checkbox's state.
	 *
	 * @param {number} id The ID of the element to complete or uncomplete
	 * @param {object} checkbox The checkbox to check the state of complete or not
	 */
	Controller.prototype.toggleComplete = function (id, checkbox) {
		var completed = checkbox.checked ? 1 : 0
		  , self = this;
		self.model.update(id, {completed: completed}, function () {
			var listItem = $$('[data-id="' + id + '"]');
			if (completed) {
				listItem.className = 'complete';
			}
			// In case it was toggled from an event and not by clicking the checkbox...
			listItem.querySelector('input').checked = completed;
		});
		self.updateCounter();
	}

	/**
	 * Will toggle ALL checkboxe's on/off state and completeness of models. Just pass
	 * in the event objet.
	 *
	 * @param {object} e The event object
	 */
	Controller.prototype.toggleAll = function (e) {
		var self = this
		  , completed = e.target.checked ? 1 : 0
		  , query = 0;

		if (completed == 0) {
			query = 1;
		}

		self.model.read({ completed: query }, function (data) {
			data.forEach(function (item) {
				self.toggleComplete(item.id, e.target);
			});
		});
		self.updateCounter();
	}

	/**
	 * Updates the items left to do counter.
	 */
	Controller.prototype.updateCounter = function () {
		var self = this;
		self.model.read({ completed: 0 }, function (data) {
			$$('#todo-count').innerHTML = self.view.itemCounter(data);
		});
	};

	// Export to window
	window.Controller = Controller;
})( window );
