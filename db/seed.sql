
INSERT INTO departments (name) VALUES 
("HR department"),
("IT department"),
("Finance department"),
("Marketing department"),
("Customer service department");

INSERT INTO roles (job_position,department_id,salary) VALUES
('HR Manager', 1, 70000),
('Front End Developer', 2, 80000),
('Finance officer', 3, 60000),
('Senior marketing officer', 4, 70000),
('Receptionist',5,45000);


INSERT INTO employees (first_name, last_name,role_id, manager_id) VALUES
('Rajan', 'khatri', 1, NULL),
('Nirajan', 'Khadka',2,1),
('Gaurav', 'Pokhrel',3,2),
('Anubhav','Thapa',4,3),
('Manyata', 'adhikari',5,4);
