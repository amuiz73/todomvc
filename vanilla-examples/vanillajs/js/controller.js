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
  }

  /**
   * An event to fire on load. Will get all items and display them in the todo-list
   */
  Controller.prototype.load = function () {
    var todoList = $$('#todo-list')
      , self = this;
    self.model.read(function (data) {
      todoList.innerHTML = self.view.show(data);
    });
  }

  /**
   * An event to fire whenever you want to add an item. Simply pass in the event
   * object and it'll handle the DOM insertion and saving of the new item.
   *
   * @param {object} e The event object
   */
  Controller.prototype.addItem = function (e) {
    var todoList = $$('#todo-list')
      , input = $$('#new-todo')
      , title = title || ''
      , self = this;
    if (e.keyCode == 13) {
      self.model.create(e.srcElement.value, function (data) {
        todoList.innerHTML = todoList.innerHTML + self.view.show(data);
        input.value = '';
      });
    }
  }

  /**
   * By giving it an ID it'll find the DOM element matching that ID, remove it from
   * the DOM and also remove it from storage.
   *
   * @param {number} id The ID of the item to remove from the DOM and storage
   */
  Controller.prototype.removeItem = function (id) {
    var todoList = $$('#todo-list')
      , self = this;
    self.model.remove(id, function () {
      todoList.removeChild($$('[data-id="' + id + '"]'));
    });
  }

  /**
   * Will remove all completed items from the DOM and storage.
   */
  Controller.prototype.removeCompletedItems = function () {
    var todoList = $$('#todo-list')
      , self = this;
    self.model.read({ completed: 1 }, function (data) {
      data.forEach(function (item) {
        self.removeItem(item.id);
      })
    });
  }

  /**
   * Give it an ID of a model and a checkbox and it will update the item in storage
   * based on the checkbox's state.
   *
   * @param {number} id The ID of the element to complete or uncomplete
   * @param {object} checkbox The checkbox to check the state of complete or not
   */
  Controller.prototype.toggleComplete = function (id, checkbox) {
   var todoList = $$('#todo-list')
      , completed = checkbox.checked ? 1 : 0
      , self = this;
    self.model.update(id, {completed: completed}, function () {
      var listItem = $$('[data-id="' + id + '"]');
      if (completed) {
        listItem.className = 'complete';
      }
      // In case it was toggled from an event and not by clicking the checkbox...
      listItem.querySelector('input').checked = completed;
    });
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
  }

  // Export to window
  window.Controller = Controller;
})( window );
