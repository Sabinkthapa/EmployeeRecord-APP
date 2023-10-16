const {prompt} =require('inquirer')
const connection = require('./db/connectiondb')

//loading prompts
function MainPrompts() {
    prompt([
        {
            type: 'list',
            name: 'choice',
            message:'what would you like to do?',
            choices: [
                {
                    name: "view all Employees",
                    value: "view_employees"
                },
                {
                    name: "view all Employees by department",
                    value: "view_employees_by_department"
                },
                {
                    name: "Add Employee",
                    value: "add_employee"
                },
                {
                    name: "Update Employee role",
                    value: "update_employee_role"
                },
                {
                    name: "Remove Employee",
                    value: "remove_employee"
                },
                {
                    name: "Update Employee Manager",
                    value: "update_employee_manager"
                },
                {
                    name: "view all department",
                    value: "view_departments"
                },
                {
                    name:"EXIT",
                    value:"Exit"
                }
            ]
        }
    ]).then((answers) => {
        switch (answers.choice) {
                case "view_employees":
                    ViewEmployees();
                     break;
                case "view_employees_by_department":
                    ViewEmployeesbyDepartment();
                    break;
                case "update_employee_role":
                    UpdateEmployee();
                    break;
                case "remove_employee":
                    RemoveEmployee();
                    break;
                case "update_employee_manager":
                    UpdateEmployeeManager();
                    break;
                case "view_departments":
                    ViewDepartments();
                    break;
                case "Exit":
                    connection.end();
                    console.log('Thank you');
                    break;
        }

    });
    
}

MainPrompts();