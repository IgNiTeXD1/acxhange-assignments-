-- =========================
-- RESET (DROP IN ORDER)
-- =========================

DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS leave_management;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS salary_history;
DROP TABLE IF EXISTS employee_role;
DROP TABLE IF EXISTS employee_department;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS gender;
DROP TABLE IF EXISTS employee_status;
DROP TABLE IF EXISTS leave_type;
DROP TABLE IF EXISTS leave_status;

--lookups

CREATE TABLE gender (
    gender_id INT AUTO_INCREMENT PRIMARY KEY,
    gender_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE employee_status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE leave_type (
    leave_type_id INT AUTO_INCREMENT PRIMARY KEY,
    leave_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE leave_status (
    leave_status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(30) UNIQUE NOT NULL
);

-- employee core table

CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE,
    hire_date DATE,
    email VARCHAR(100) UNIQUE NOT NULL,

    gender_id INT,
    status_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (gender_id) REFERENCES gender(gender_id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES employee_status(status_id)
);

--departments

CREATE TABLE department (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--roles 

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    hierarchy INT
);

---mapping employee to department

CREATE TABLE employee_department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    department_id INT,

    FOREIGN KEY (employee_id) 
        REFERENCES employee(employee_id) ON DELETE CASCADE,

    FOREIGN KEY (department_id) 
        REFERENCES department(department_id) ON DELETE CASCADE,

    UNIQUE (employee_id, department_id)
);

--mapping employee to role 

CREATE TABLE employee_role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    role_id INT,

    FOREIGN KEY (employee_id) 
        REFERENCES employee(employee_id) ON DELETE CASCADE,

    FOREIGN KEY (role_id) 
        REFERENCES roles(role_id),

    UNIQUE (employee_id, role_id)
);

--salary history 

CREATE TABLE salary_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,

    base_salary DECIMAL(10,2) CHECK (base_salary >= 0),
    bonus DECIMAL(10,2) CHECK (bonus >= 0),
    hra DECIMAL(10,2) CHECK (hra >= 0),
    pf DECIMAL(10,2) CHECK (pf >= 0),

    currency VARCHAR(10),

    effective_from DATE NOT NULL,
    effective_to DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE
);

--attendance

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    attendance_date DATE NOT NULL,

    login_time TIMESTAMP,
    logout_time TIMESTAMP,

    status VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE,

    UNIQUE (employee_id, attendance_date),

    CHECK (logout_time IS NULL OR logout_time > login_time)
);

--leaves

CREATE TABLE leave_management (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,

    leave_type_id INT,
    leave_status_id INT,

    leave_start DATE,
    leave_end DATE,

    approved_by INT,
    approved_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_type(leave_type_id),
    FOREIGN KEY (leave_status_id) REFERENCES leave_status(leave_status_id),
    FOREIGN KEY (approved_by) REFERENCES employee(employee_id),

    CHECK (leave_end >= leave_start)
);
--payroll 

CREATE TABLE payroll (
    payroll_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,

    pay_month INT,
    pay_year INT,

    base_salary DECIMAL(10,2),
    bonus DECIMAL(10,2),
    hra DECIMAL(10,2),
    pf DECIMAL(10,2),

    deductions DECIMAL(10,2),
    net_salary DECIMAL(10,2),

    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE,

    UNIQUE (employee_id, pay_month, pay_year)
);


