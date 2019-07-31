// Dom7
var $$ = Dom7;

// Theme
var theme = 'md';

// Init App
var app = new Framework7({
  id: 'io.onlinemedia.stock',
  root: '#app',
  view: {
    pushState: true
  },
  template7Pages: true, // enable Template7 rendering for Ajax and Dynamic pages
  precompileTemplates: true,
  theme: theme,
  routes: routes,
  popup: {
    closeOnEscape: true,
  },
  sheet: {
    closeOnEscape: true,
  },
  popover: {
    closeOnEscape: true,
  },
  actions: {
    closeOnEscape: true,
  },
});


let mainView = app.views.create('.view-main');