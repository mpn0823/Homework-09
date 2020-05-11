const Employee = require("./Employee");

function Engineer(name = null, id = null, email = null, github = null) {
    Employee.call(this, name, id, email);
    this.github = github;
}

Engineer.prototype.getRole = function() { return "Engineer" };
Engineer.prototype.getGithub = function() { return this.github };

module.exports = Engineer;