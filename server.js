const inquirer =require('inquirer')
const dbconnection = require('./db/connectiondb.js');
// require('dotenv').config();

//loading prompts for choices
async function MainPrompts() {
    const {choice} = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message:'what would you like to do?',
            choices: [
              'View all departments',
              'View all roles',
              'View all employees',
              'Add department',
              'Add a role',
              'Add an employee',
              'Update an employee role',
              'logout',
            ],
        }
    ]);

        switch (choice) {
                case 'View all departments':
                     ViewAllDepartments();
                     break;
                case 'View all roles':
                     ViewAllRoles();
                    break;
                case 'View all employees':
                    ViewAllEmployees();
                    break;
                case 'Add department':
                     AddDepartment();
                    break;
                case 'Add a role':
                   AddRole();
                    break;
                case 'Update an employee role':
                     UpdateEmployeeRole();
                    break;
                case "Logout":
                    dbconnection.end();
                    console.log('Thank you');
                    break;
        }
    };

    //function to view all departments
    const ViewAllDepartments = async () => {
        const sql = 'SELECT * FROM departments';
        try {
          const [rows] = await dbconnection.promise().query(sql);
          if (rows.length === 0) {
            console.log('No departments found.');
          } else {
            console.table(rows);
          }
        } catch (error) {
          console.error('Error fetching departments:', error);
        }
        MainPrompts();
      };

      //function to view all roles of employees
      const ViewAllRoles = async () => {
        const sql = 'SELECT * FROM roles';
        try {
          const [roles] = await dbconnection.promise().query(sql);
          if (roles.length === 0) {
            console.log('No roles found.');
          } else {
            console.table(roles);
          }
        } catch (error) {
          console.error('Error fetching Roles:', error);
        }
        MainPrompts();
      };

      //function to view all employess

      const ViewAllEmployees = async() => {
        const sql =`SELECT  employees.id, 
                            employees.first_name, 
                            employees.last_name, 
                            roles.job_position, 
                            departments.name as department, 
                            roles.salary
        FROM employees
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN roles ON employees.role_id = roles.id
        `;
      try {
        const [employees] = await dbconnection.promise().query(sql);
        if (employees.length === 0) {
          console.log('No employees are found.');
        } else {
          console.table(employees);
        }
      } catch (err) {
        console.log("error fetching employees");
      }
      MainPrompts();
    };

    //function to add department

    const AddDepartment = async() => {
      //prompt to ask user to enter the department name

      const { departmentName } = await inquirer.prompt ({
        type:'input',
        name: 'departmentName',
        message: "what is the name of new department:",
      });
      const query =`INSERT INTO departments (name) VALUES(?)`;
      //try catch to handle error
      try {
        await dbconnection.promise().query(query,[departmentName]);
        console.log('New Department added successfully');
      }catch (err) {
        console.log("Error adding department ")
      }
      MainPrompts();
    };
      MainPrompts();




