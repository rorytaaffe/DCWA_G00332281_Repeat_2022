var mysql = require('promise-mysql');

var pool


// This connects us to our database 'studentdb3'
mysql.createPool({
    connectionLimit : 5,
    host            : 'localhost',
    user            : 'root',
    password        : 'password',
    database        : 'collegedb'
})
.then((result) => {     // If it's successful
    pool = result
})
.catch((error) => {     // If there's any error(s)
    console.log(error)
});


// Shows one module that the user has chosen
var showModule = function (mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'SELECT * FROM module WHERE mid = ?',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


// Change data of a module
var editModule = function(mid, name, credits) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'UPDATE module SET name = ?, credits = ? WHERE mid = ?',
            values: [name, credits, mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


// Shows all modules in the database
var showModules = function () {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM module')   // mysql query to print out all the data from the module table in collegedb database
        .then((result) => {     // If the query is successful
            //console.log("OK")   
            resolve(result)     // return the result
        })
        .catch((error) => {     // if there's an error
            //console.log("NOT OK")
            reject(error)       // shows the message of the error
        })
        //console.log("HERE!")
    })
}


// Shows all students in database
var showStudents = function () {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM student')     // Querying the database
            .then((result) => { // If the query was successful
                resolve(result) // returns result
            })
            .catch((error) => { // if there's an error with the query
                reject(error) // shows the error message
            })
    })
}


// Add student
var addStudent = function (sid, name, gpa) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'INSERT INTO student (sid, name, gpa) VALUES (?, ?, ?)',
            values: [sid, name, gpa]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


// Deletes student
var removeStudent = function(sid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'DELETE FROM student WHERE sid = ?',
            values: [sid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


// Shows the students associated with module
var showStudentsInModule = function(mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'SELECT s.* FROM student s JOIN student_module sm ON s.sid = sm.sid INNER JOIN module m ON sm.mid = m.mid WHERE m.mid = ?',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


// Shows departments
var showDepartments = function () {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM dept')    
            .then((result) => { 
                resolve(result) 
            })
            .catch((error) => { 
                reject(error) 
            })
    })
}


// Goes through the database and checks if the deparment exists
var checkIfDepartmentExists = function(dept){
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'SELECT count(did) AS FOUND FROM dept WHERE did = ?',
            values: [dept]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


// in order to have access to the functions, we need to export them out of the file
module.exports = { showModule, editModule, showModules, showStudents, addStudent, removeStudent, showStudentsInModule, showDepartments, checkIfDepartmentExists }




/*
var mysql = require('promise-mysql')
var pool

// Creating connection pool for multiple users
mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'collegedb'
})
    .then((result) => { // Pool created successfully
        pool = result
    })
    .catch((error) => { // If there are errors
        console.log(error)
    })

// Returns all modules from database
var getModules = function () {
    return new Promise((resolve, reject) => {
        // Querying the database
        pool.query('select * from module')
            .then((result) => { // If all ok with the query
                resolve(result) // Resolve this promise - send back the result
            })
            .catch((error) => { // If there are query errors
                reject(error) // Reject this promise - send back error message
            })
    })
}

// Returns specified module from database
var getModule = function (mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from module where mid =?',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Updating a module
var updateModule = function(mid, name, credits) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'update module set name = ?, credits = ? where mid = ?',
            values: [name, credits, mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// List the students that are taking the chosen module
var listStudentsonModule = function(mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select s.* from student s join student_module sm on s.sid = sm.sid inner join module m on sm.mid = m.mid where m.mid = ?',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Returns all student's details from database
var getStudents = function () {
    return new Promise((resolve, reject) => {
        // Querying the database
        pool.query('select * from student')
            .then((result) => { // If all ok with the query
                resolve(result) // Resolve this promise - send back the result
            })
            .catch((error) => { // If there are query errors
                reject(error) // Reject this promise - send back error message
            })
    })
}

// Adding a student
var addStudent = function (sid, name, gpa) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'insert into student (sid, name, gpa) values (?, ?, ?)',
            values: [sid, name, gpa]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Deleting a student
var deleteStudent = function(sid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from student where sid=?',
            values: [sid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Check that department exists in database
var checkDeptExist = function(dept){
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select count(did) as found from dept where did = ?',
            values: [dept]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// Getting the departments table results for listing of departments
var getDepartments = function () {
    return new Promise((resolve, reject) => {
        // Querying the database
        pool.query('select * from dept')
            .then((result) => { // If all ok with the query
                resolve(result) // Resolve this promise - send back the result
            })
            .catch((error) => { // If there are query errors
                reject(error) // Reject this promise - send back error message
            })
    })
}

// Exports
module.exports = { getModules, getModule, updateModule, listStudentsonModule, getStudents, addStudent, deleteStudent, checkDeptExist, getDepartments }
*/