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
              'Add an employees',
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
                case 'Add an employees':
                  AddEmployee();
                  break;
                case 'Update an employee role':
                     UpdateEmployeeRole();
                    break;
                case 'logout':
                    dbconnection.end();
                    console.log('logging out from the application');
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
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees man ON employees.manager_id = man.id
        `;
      try {
        const [employees] = await dbconnection.promise().query(sql);
        if (employees.length === 0) {
          console.log('No employees are found.');
        } else {
          console.table(employees);
        }
      } catch (err) {
        console.error("error fetching employees:",err);
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

    //function to add the role in database

    const AddRole = async () => {
      const {jobPosition, salary} = await inquirer.prompt([
        {
          type: 'input',
          name:'jobPosition',
          message: 'what is the job position:',
        },
        {
          type:'input',
          name:'salary',
          message:'what is the salary for the position:',
        },
      ]);

      const [departments] = await dbconnection
      .promise()
      .query('SELECT id, name FROM departments');

      const choicesDepartment =departments.map((depart)=> ({
        name: depart.name,
        value:depart.id,
      }));
      choicesDepartment.push({name:'New Department',value:0});

      const MakechoiceDepartment = await inquirer.prompt(
        {
          type:'list',
          name:'departmentId',
          message:'which department the role belongs to:',
          choices:choicesDepartment,
        });
        let departmentId = MakechoiceDepartment.departmentId;
        if (departmentId ===0) {
          const {departmentName} =await inquirer.prompt ({
            type:'input',
            name:'departmentName',
            message: 'Enter your department name',
          });
          //insert new role in the department
          const [addedDepartment]= await dbconnection
          .promise()
          .query('INSERT INTO departments (name) VALUES (?)',[departmentName]);
          departmentId = addedDepartment.insertId;
        }
        try {
          await dbconnection
          .promise()
          .query('INSERT INTO roles (job_position, salary, department_id) VALUES (?,?,?)',
          [jobPosition,salary,departmentId]
          );
          console.log('Role added successfully');
        } catch (err){
        console.log("error addding role")
    }
    MainPrompts();
  };
// Function to add new employee in the database
  const AddEmployee = async () => {
    const { firstName,lastName } = await inquirer.prompt ([
      {
        type:'input',
        name:'firstName',
        message:'what is your first name:',
    },
    {
      type:'input',
      name:'lastName',
      message:'what is your last name:',
    },
  ]);
  //Fetch roles from database
  const [fetchRoles] = await dbconnection.promise()
  .query('SELECT id,job_position FROM roles');
  const roleChoices =fetchRoles.map((role)=>({
    name:role.job_position,
    value:role.id,
  }));

  //add new role option
  roleChoices.push({name:'Add New position', value:0});
//ask to choose from the role list
const rolechoose = await inquirer.prompt (
  {
    type:'list',
    name:'roleId',
    message:'Select the position for the employee:',
    choices:roleChoices,
  });

  let roleId = rolechoose.roleId;

  if (roleId === 0) {
    const {jobPosition,salary} = await inquirer.prompt([
      {
        type:'input',
        name:'jobPosition',
        message:'What is the name of the new position:'
      },
      {
        type:'input',
        name:'salary',
        message:'What is the salary for the new position:',
      },
    ]);

    //fetch the department list
    const[fetchDepartments] = await dbconnection
    .promise()
    .query('SELECT id,name FROM departments');

    //map method to select the array of department list
    const departmentchoices = fetchDepartments.map((dep) => ({
      name:dep.name,
      value:dep.id,
    }));
    departmentchoices.push({name:'Add new department',value:0});
  
// prompt to choose the department from the list

const chooseDepartment = await inquirer.prompt({
      type:'list',
      name:'departmentId',
      message:'Which department does the new role belong to:',
      choices:departmentchoices,
    });

    let departmentId = chooseDepartment.departmentId;
//if user choose to add new department
    if (departmentId === 0){
      const {newDepartment} = await inquirer.prompt ({
          type:'input',
          name:'newDepartment',
          message:'Enter the name of the new department:',
      });

      //insert the new department to database
      const [addNewDepart] = await dbconnection
      .promise()
      .query('INSERT INTO departments (name) VALUES (?)', [
        newDepartment,
      ]);
      departmentId = addNewDepart.insertId;
    }

    //insert new role into the department
    const [roleDepartment] = await dbconnection
    .promise()
    .query(
      'INSERT INTO roles (job_position,salary,department_id) VALUES (?,?,?)',
      [jobPosition,salary, departmentId]
    );
    roleId = roleDepartment.insertId;
  }

  //fetch employees from the database for making manager selection
  const [employees] = await dbconnection.promise()
  .query(
    'SELECT id, CONCAT(first_name, " " , last_name) AS fullName FROM employees'
    );
    const employeeChoices = employees.map((empl)=> ({
      name:empl.fullName,
      value:empl.id,
    }));
  
    employeeChoices.push({name:'Add new manager', value:0});

    //prompt for choosing manager
    let managerChoice = await inquirer.prompt({
      type: 'list',
      name: 'managerId',
      message: 'Choose manager from the given list:',
      choices: employeeChoices,
    });

    let managerId = managerChoice.managerId;

    //For user to choose new manager
    if (managerId===0) {
      const { managerFirstname ,managerLastname} = await inquirer.prompt ([
        {
          type: 'input',
          name: 'managerFirstname',
          message: 'Please enter new manager first name:',

        },
        {
          type: 'input',
          name: 'managerLastname',
          message: 'Please enter new manager last name:',

        },
      ]);

      //Insert new manager in to the database

      const [newManager] = await dbconnection
      .promise()
      .query(
        'INSERT INTO employees (first_name, last_name, role_id) VALUES (?,?,?)',
        [
          managerFirstname,
          managerLastname,
          roleId,
        ]);
      managerId = newManager.insertId;
    }

    //try catch block to handle error, insert the new employees

    try {
      await dbconnection
      .promise()
      .query(
        'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
        [firstName, lastName, roleId, managerId]
      );
      console.log('Employee successfully added.');
    } catch (err) {
      console.log('Error adding the employee:',err);
    }
    MainPrompts();
};

//Allows user to update the employee role in the database

const UpdateEmployeeRole = async () => {
  //fetch employees from the database
const[fetchemployees] = await dbconnection
.promise()
.query(
  'SELECT id, CONCAT(first_name, " ", last_name) AS fullName FROM employees'
);
const employeeChoices = fetchemployees.map((empl) => ({
name: empl.fullName,
value: empl.id,
}));

// Prompt the user to choose an employee to update
const { employeeId } = await inquirer.prompt({
  type: 'list',
  name: 'employeeId',
  message: 'Which employee do you want to update?',
  choices: employeeChoices,
});

//Fetch the list of roles from the database
const [fetchroles] = await dbconnection
.promise()
.query ('SELECT id,job_position FROM roles');

const roleChoices = fetchroles.map((role)=>({
  name: role.job_position,
  value: role.id,
}));
  // Prompt for new role for selected employee
  const { roleId } = await inquirer.prompt({
    type: 'list',
    name: 'roleId',
    message: 'Choose a new role for the employee:',
    choices: roleChoices,
  });
  //update employee role and try catch to handle error
  try {
    await dbconnection
      .promise()
      .query('UPDATE employees SET role_id = ? WHERE id = ?', [
        roleId,
        employeeId,
      ]);
    console.log('Employee role successfully updated.');
  } catch (err) {
    console.log('Error updating the employee role',err);
  }
MainPrompts();
};
//Call this main function to start the application
MainPrompts();





