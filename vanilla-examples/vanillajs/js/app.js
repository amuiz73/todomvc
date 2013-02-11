(function( window ) {
  'use strict';

  function Todo (name) {
    this.storage = new Store(name);
    this.model = new Model(this.storage);
    this.view = new View();
    this.controller = new Controller(this.model, this.view);
  };

  var todo = new Todo('todos-vanillajs');

  document.addEventListener('DOMContentLoaded', function () {
    todo.controller.load();
  });

  $$('#new-todo').addEventListener('keypress', function (e) {
    todo.controller.addItem(e);
  });

  $$('#todo-list').addEventListener('click', function (e) {
    var target = e.target
      , el = this;

    function lookupId (target) {
      var lookup = target
      while (lookup.nodeName !== 'LI') {
        lookup = lookup.parentNode;
      }
      return lookup.dataset['id'];
    }

    // If you click a destroy button
    if (target.className.indexOf('destroy') > -1) {
      todo.controller.removeItem(lookupId(target));
    }

    // If you click the checkmark
    if(target.className.indexOf('toggle') > -1) {
      todo.controller.toggleComplete(lookupId(target), target);
    }
  });

  $$('#toggle-all').addEventListener('click', function (e) {
    todo.controller.toggleAll(e);
  });

  $$('#clear-completed').addEventListener('click', function () {
    todo.controller.removeCompletedItems()
  });
})( window );
