(function( window ) {
  'use strict';

  function Model (storage) {
    this.storage = storage;
  }

  Model.prototype.create = function (title, callback) {
    callback = callback || function () {};
    title = title || '';
    var newItem = {
      title: title.trim()
    , completed: 0
    }
    this.storage.save(newItem, callback);
  }

  Model.prototype.read = function (query, callback) {
    if (typeof query == 'function') {
      callback = query;
      return this.storage.findAll(callback);
    }
    else if (typeof query == 'string' || typeof query == 'number') {
      this.storage.find({id: query}, callback);
    }
    else {
      this.storage.find(query, callback)
    }
  }

  Model.prototype.update = function (id, data, callback) {
    this.storage.save(id, data, callback);
  }

  Model.prototype.remove = function (id, callback) {
    this.storage.remove(id, callback);
  }
  
  Model.prototype.removeAll = function (callback) {
    this.storage.drop(callback);
  }

  Model.prototype.find = function (query, callback) {
    this.storage.find(query, callback);
  }

  // Export to window
  window.Model = Model;
})( window );
