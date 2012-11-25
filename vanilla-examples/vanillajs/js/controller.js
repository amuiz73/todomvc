(function( window ) {
  'use strict';

  function Controller (model, view) {
    this.model = model;
    this.view = view;
  }

  Controller.prototype.load = function () {
    var todoList = document.querySelector('#todo-list')
      , self = this;
    self.model.read(function (data) {
      todoList.innerHTML = self.view.show(data);
    });
  }

  Controller.prototype.addItem = function (e) {
    var todoList = document.querySelector('#todo-list')
      , input = document.querySelector('#new-todo')
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
    var todoList = document.querySelector('#todo-list')
      , self = this;
    self.model.remove(id, function () {
      todoList.removeChild(document.querySelector('[data-id="' + id + '"]'));
    });
  }

  Controller.prototype.removeCompletedItems = function () {
    var todoList = document.querySelector('#todo-list')
      , self = this;
    self.model.read({ completed: 1 }, function (data) {
      data.forEach(function (item) {
        self.removeItem(item.id);
      })
    });
  }

  Controller.prototype.toggleComplete = function (id, checkbox) {
   var todoList = document.querySelector('#todo-list')
      , done = checkbox.checked ? 1 : 0
      , self = this;
    self.model.update(id, {completed: done}, function () {
      var listItem = document.querySelector('[data-id="' + id + '"]');
      if (done) {
        listItem.className = 'complete';
      }
      // In case it was toggled from an event and not by clicking the checkbox...
      listItem.querySelector('input').checked = done;
    });
  }

  Controller.prototype.toggleAll = function (e) {
    var self = this
      , done = e.target.checked ? 1 : 0
      , query = 0;

    if (done == 0) {
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
