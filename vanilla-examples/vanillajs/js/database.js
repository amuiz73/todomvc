(function( window ) {
  'use strict';
  /**
   * Creates a DB connection and will create an empty collection if no
   * collection already exists.
   * @param {string} name The name of our DB we want to use
   * @param {function} callback Our fake DB uses callbacks because in
   * real life you probably would be making AJAX calls
   */
  function Database (name, callback) {
    var data, dbName, callback = callback || function () {};
    dbName = this._dbName = name;
    if(!localStorage[dbName]) {
      data = {
        todos: []
      }
      localStorage[dbName] = JSON.stringify(data);
    }
    callback.call(this, JSON.parse(localStorage[dbName]));
  };

  /**
   * Will retrieve a specific item and return that 1 item
   * @param {number} id The id of the item to look for
   * @returns {object|undefined} if an item is found it returns an object,
   * otherwise it returns undefined
   */
  Database.prototype.findById = function (id, callback) {
    var data = JSON.parse(localStorage[this._dbName]).todos
      , callback = callback || function () {}
      , found;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        found = data[i];
        break;
      }
    }
    callback.call(this, found);
  }

  /**
   * Will retrieve all data from our collection
   * @param {function} callback The callback to fire upon retrieving data
   */
  Database.prototype.findAll = function (callback) {
    callback = callback || function () {};
    callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
  }

  /**
   * Will save the given data to the DB. If no item exists it will create a
   * new item, otherwise it'll simply update an existing item's properties
   * @param {number} id An optional param to enter an ID of an item to update
   * @param {object} data The data to save back into the DB
   * @param {function} callback The callback to fire after saving
   */
  Database.prototype.save = function (id, updateData, callback) {
    var data = JSON.parse(localStorage[this._dbName])
      , todos = data.todos;
    // If an ID was actually given, find the item and update each property
    if (typeof id !== 'object') {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
          for (var x in updateData) {
            todos[i][x] = updateData[x];
          }
        }
      }
      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
    }
    else {
      callback = updateData;
      updateData = id;
      // Generate an ID
      updateData.id = new Date().getTime();
      todos.push(updateData);
      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, [updateData]);
    }
  }

  /**
   * Will remove an item from the database based on its ID
   * @param {number} id The ID of the item you want to remove
   * @param {function} callback The callback to fire after saving
   */
  Database.prototype.remove = function (id, callback) {
    var data = JSON.parse(localStorage[this._dbName])
      , todos = data.todos;
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id == id) {
       todos.splice(i, 1);
       break;
      }
    }
    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
  }

  /**
   *  Will drop all storage and start fresh
   * @param {function} callback The callback to fire after dropping the data
   */
  Database.prototype.drop = function (callback) {
    localStorage[this._dbName] = JSON.stringify({todos: []});
    callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
  }

  // Export to window
  window.Database = Database;
})( window );
