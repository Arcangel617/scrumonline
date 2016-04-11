/*globals scrum */

// Add a plugin for redmine integration
scrum.sources.push({
  // Fixed properties and methods
  name: "Redmine",
  position: 2,
  view: "templates/redmine_source.html",
  feedback: false,
  // Feedback call for completed poll
  completed: function(result) {
    this.pollResult = result;
    this.pollComplete = true;
  },
  
  // Custom properties and methods
  warning: true,
  loggedIn: false,  
  
  // Properties of first view
  url: 'http://',    // Url of the server
  token: '',  // Token used for REST authentication
  login: function() {
    var self = this;
    var url = this.url + '/issues.json?key=' + this.token +'&tracker_id=2';
    this.parent.$http.get(url).then(function (response) {
      self.stories.length = 0;
      for (var i=0; i < response.data.issues.length; i++) {
        var story = response.data.issues[i];
        if (!story.fixed_version && story.story_points == null) {
          self.stories.push(story);
        }
      }
      self.story = self.stories[0];
      self.loggedIn = true;
    });  
  },
  
  // Properties after log in was completed
  stories: [],
  story: {},
  pollComplete: false,
  pollResult: 0,
  event: ['poll', 'start', 'Redmine'],
  
  // Load issue from redmine server
  loadIssue: function() {
    this.feedback = true;
    this.pollComplete = false;
    this.parent.startPoll(this.story.subject);
  }
});

// Add a plugin for github integration
scrum.sources.push({
  // Fixed properties and methods
  name: "Github",
  position: 3,
  view: "templates/github_source.html",
  feedback: false,
  // Feedback call for completed poll
  completed: function(result) {
  },
  
  // Custom properties and methods
  loaded: false,
  user: '',
  repo: '',
  issues: [],
  issue: {},
  event: ['poll', 'start', 'Github'],
  
  // Load issues from github
  load: function() {
    var self = this;
    this.parent.$http
      .get('http://api.github.com/repos/' + this.user + '/' + this.repo + '/issues')
      .then(function (response) {
        self.issues = response.data;
        self.issue = self.issues[0];
        self.loaded = true;
      });
  }
});
