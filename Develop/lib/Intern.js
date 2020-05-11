const Employee = require("./Employee");

function Intern(name = null, id = null, email = null, school = null) {
    Employee.call(this, name, id, email);
    this.school = school;
}

Intern.prototype.getRole = function() { return "Intern" };
Intern.prototype.getSchool = function() { return this.school };

module.exports = Intern;