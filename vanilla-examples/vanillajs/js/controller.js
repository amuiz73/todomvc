(function( window ) {
  'use strict';

  function Controller (model, view) {
    this.model = model;
    this.view = view;
  }

  Controller.prototype.load = function () {
    var todoList = $$('#todo-list')
      , self = this;
    self.model.read(function (data) {
      todoList.innerHTML = self.view.show(data);
    });
  }

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

  Controller.prototype.removeItem = function (id) {
    var todoList = $$('#todo-list')
      , self = this;
    self.model.remove(id, function () {
      todoList.removeChild($$('[data-id="' + id + '"]'));
    });
  }

  Controller.prototype.removeCompletedItems = function () {
    var todoList = $$('#todo-list')
      , self = this;
    self.model.read({ completed: 1 }, function (data) {
      data.forEach(function (item) {
        self.removeItem(item.id);
      })
    });
  }

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

  Controller.prototype.toggleAll = function (e) {
    var self = this
      , completed = e.target.checked ? 1 : 0
      , query = 0;

    if (completed == 0) {
      query = 1;
    }

    self.model.find({ completed: query }, function (data) {
      data.forEach(function (item) {
        self.toggleComplete(item.id, e.target);
      });
    });
  }

  // Export to window
  window.Controller = Controller;
})( window );
