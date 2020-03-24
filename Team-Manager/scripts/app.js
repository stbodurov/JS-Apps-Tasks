(() => {
// initialize the application
var app = Sammy('#main', function() {
    // include a plugin
    this.use('Handlebars', 'hbs');
  
    // define a 'route'
    this.get('#/', function() {
      // load some data
      
      
      this.partial('../templates/home/home.hbs');
    });
  });
  
  // start the application
  app.run('#/');
})();