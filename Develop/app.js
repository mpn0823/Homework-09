"use strict";

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```


// Asks the user if they would like to add an employee and returns correspoding boolean value
async function addEmployee() {
    const response = await inquirer.prompt({
        message: "Add a(nother) employee?",
        name: "continue",
        type: "list",
        choices: ["yes", "no"],
    }, );
    return response.continue === "yes";
}

// Asks the user to provide role for new employee and returns corresponding choice as string
async function getRole() {
    const response = await inquirer.prompt({
        message: "What is their role?",
        name: "role",
        type: "list",
        choices: ["Manager", "Engineer", "Intern"],
    });
    return response.role;
}

// Asks the user to provide basic info for new employee and returns corresponding input as
// an object e.g. {name: "bob", id: 1, email: "bob@gmail.com"}
async function getCommonInfo() {
    return await inquirer.prompt([{
        message: "Enter employee's name...",
        name: "name",
    }, {
        message: "ID number...",
        name: "id",
    }, {
        message: "email address...",
        name: "email",
    }]);
}

// Asks user to provide new employee's GitHub account name and returns response as string
async function getEngineerInfo() {
    const response = await inquirer.prompt({
        message: "and GitHub account name.",
        name: "github",
    });
    return response.github;
}

// Asks user to proivde new employee's School name and returns response as string
async function getInternInfo() {
    const response = await inquirer.prompt({
        message: "and school name.",
        name: "school",
    });
    return response.school;
}

// Asks user to provide new employee's office number and returns response as string
async function getManagerInfo() {
    const response = await inquirer.prompt({
        message: "and office number",
        name: "officeNumber",
    });
    return response.officeNumber;
}

(async() => {
    let employees = [];
    while (await addEmployee()) {
        const { name, id, email } = await getCommonInfo();
        switch (await getRole()) {
            case "Manager":
                employees.push(new Manager(name, id, email, await getManagerInfo()));
                break;
            case "Engineer":
                employees.push(new Engineer(name, id, email, await getEngineerInfo()));
                break;
            case "Intern":
                employees.push(new Intern(name, id, email, await getInternInfo()));
                break;
        }
    }
    fs.writeFile("index.html", render(employees), "utf8", err => { if (err) console.log(err) });
})();