const Employee = require("./Employee");

function Engineer(name, id, email, github) {
    Employee.call(this, name, id, email);
    this.github = github;
}

Engineer.prototype = new Employee();
Engineer.prototype.getRole = function() { return "Engineer" };
Engineer.prototype.getGithub = function() { return this.github };

module.exports = Engineer;