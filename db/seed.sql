
INSERT INTO departments (name) VALUES 
("HR department"),
("IT department"),
("Finance department"),
("Marketing department"),
("Customer service department");

INSERT INTO roles (job_position,salary,department_id) VALUES
('HR Manager',70000,1),
('Front End Developer',80000,2),
('Finance officer',60000,3),
('Senior marketing officer',70000,4),
('Receptionist',45000,5);


INSERT INTO employees (first_name, last_name,role_id, manager_id) VALUES
('Rajan', 'khatri', 1, NULL),
('Nirajan', 'Khadka',2,1),
('Gaurav', 'Pokhrel',3,2),
('Anubhav','Thapa',4,3),
('Manyata', 'adhikari',5,4);
