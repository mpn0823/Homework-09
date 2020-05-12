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

// Asks the user if they would like to add an employee and returns correspoding boolean value
async function addEmployee() {
    const response = await inquirer.prompt({
        message: "Add a(nother) employee?",
        name: "continue",
        type: "confirm",
    }, );
    return response.continue;
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
        message: "Enter employee's name",
        name: "name",
    }, {
        message: "ID number",
        name: "id",
        validate: id => {
            return /\d/.test(id);
        }
    }, {
        message: "email address",
        name: "email",
        validate: email => {
            // I found this regex on the internet. We'll just assume it works.
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
    }]);
}

// Asks user to provide new employee's GitHub account name and returns response as string
async function getEngineerInfo() {
    const response = await inquirer.prompt({
        message: "GitHub account.",
        name: "github",
        validate: github => {
            // Ditto
            return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(github);
        }
    });
    return response.github;
}

// Asks user to proivde new employee's School name and returns response as string
async function getInternInfo() {
    const response = await inquirer.prompt({
        message: "school name.",
        name: "school",
    });
    return response.school;
}

// Asks user to provide new employee's office number and returns response as string
async function getManagerInfo() {
    const response = await inquirer.prompt({
        message: "office number",
        name: "officeNumber",
        validate: officeNumber => {
            return /\d/.test(officeNumber);
        },
    });
    return response.officeNumber;
}

// This is the main loop. As long as the user keeps choosing to add employees, prompt
// The user for employee info, create the corresponding object, and append it to employees.
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

    // Check if directory exists
    fs.access(OUTPUT_DIR, err => {
        // If not then create directory
        if (err && err.code === "ENOENT") fs.mkdir(OUTPUT_DIR, err => { if (err) console.log(err) });
        // If some other error then log to console
        else if (err) console.log(err);
        // Write output to file
        fs.writeFile(outputPath, render(employees), err => { if (err) console.log(err) });
    });
})();