(function( window ) {
  'use strict';

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
   * NOTE: In real life you should be using a templating engine such
   * as Mustache or Handlebars, however, this is a vanilla JS example.
   */
  View.prototype.show = function (data) {
    var view = '';
    for (var i = 0; i < data.length; i++) {
      var template = this.defaultTemplate
        , complete = ''
        , checked  = '';
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

  View.prototype.itemCounter = function (data) {
    for (var i = 0; i < data.length; i++) {
      
    }
  }

  // Export to window
  window.View = View;
})( window );
