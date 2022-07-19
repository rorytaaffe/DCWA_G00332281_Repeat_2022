var express = require('express')
var app = express()

var mongoDAO = require('./mongoDAO')
var sqlDAO = require('./mysqlDAO')

const { check, validationResult } = require('express-validator')
var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs')


// Home
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/home.html")    // Sends file (html)
})


// GET Lists Modules
app.get('/listModules', (req, res) => {
    sqlDAO.showModules()        // using the sqlDAO variable that imports the mysqlDAO file, then call the getModule() function in that file
        .then((result) => {     // If it's successful 
            res.render('module', { modules: result })
        })
        .catch((error) => {     // If there's any error(s)
            res.send(error)
        })
})


// GET Edit module 
app.get('/module/edit/:mid', (req, res) => {
    sqlDAO.showModule(req.params.mid)    // Calls the mySQL Data Access Object (DAO) function
        .then((result) => { 
            res.render('editModule', { errors: undefined, mid: result[0].mid, name: result[0].name, credits: result[0].credits })
        })
        .catch((error) => {     // If there's any error(s)
            res.send(error)
        })
})


// POST Edit Module
app.post('/module/edit/:mid', [
    check('name').isLength({ min: 5 }).withMessage("Module name must be at least 5 characters"),
    check('credits').isIn([5, 10, 15]).withMessage("Credits can be either 5, 10 or 15")], (req, res) => {

        var errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.render('editModule', { errors: errors.errors, mid: req.params.mid, name: req.body.name, credits: req.body.credits })
        } 

        else {
            sqlDAO.editModule(req.params.mid, req.body.name, req.body.credits)    // Data Access Object (DAO) function
                .then(() => {
                    res.redirect('/listModules')    // Redirects to listModules
                })
                .catch((error) => {
                    res.send(error)     // If there's any error(s)
                })
        }

    })


// GET listStudents
app.get('/listStudents', (req, res) => {
    sqlDAO.showStudents()    // calls Data Access Object (DAO) function
        .then((result) => {
            res.render('student', { students: result })    // rendering
        })
        .catch((error) => {
            res.send(error)     // If there's any error(s)
        })
})


// GET addStudents
app.get('/addStudents', (req, res) => {
    res.render('addStudents', { errors: undefined })     // render
})


// POST addStudents
app.post('/addStudents', [
    check('sid').isLength(4).withMessage("Student ID must be 4 characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    check('gpa').isFloat({ min: 0.0, max: 4.0 }).withMessage("GPA must be between 0.0 & 4.0")], (req, res) => {

        var errors = validationResult(req)      // result will be defined as errors

        if (!errors.isEmpty()) {     
            res.render('addStudents', { errors: errors.errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa })      // Shows errors
        } 

        else {
            sqlDAO.addStudent(req.body.sid, req.body.name, req.body.gpa)    // calls Data Access Object (DAO) function
                .then(() => { 
                    res.redirect('/listStudents')   // redirects
                })
                .catch((error) => {     
                    if (error.errno == 1062) {         // If the student could not be added to database
                        res.send("<h1>Error Message</h1><br><br><h2> Student with " + req.body.sid + " already exists</h2><br>")    // If the Student ID is already used
                    } 

                    else 
                    { 
                        res.send("<h1>Other errors: </h1><br><br><h2>" + req.sqlMessage + "</h2><br>")      // If there is any different error(s)
                    }
                })
        }

    })


// GET to remove student from database
app.get('/students/delete/:sid', (req, res) => {
    sqlDAO.removeStudent(req.params.sid)
        .then((result) => {
            if (result.affectedRows == 0) {     // error message
                res.send("<h1>Error Message</h1><br><br><h2>" + req.params.sid + "doesn't exist</h2><br>")
            } 

            else 
            { 
                res.redirect('/listStudents')   // Redirect to list of students
            }
        })
        .catch((error) => {
            if (error.errno == 1451) {
                res.send("<h1>Error Message</h1><br><br><h2>" + req.params.sid + "has associated modules, he/she cannot be deleted</h2><br>")
            } else { 
                res.send("<h1>Other errors: </h1><br><br><h2>" + req.sqlMessage + "</h2><br>")      // If there is any different error(s)
            }
        })
})


// GET to show the students associated with module
app.get('/module/students/:mid', (req, res) => {
    sqlDAO.showStudentsInModule(req.params.mid)     // calls Data Access Object (DAO) function
        .then((result) => {
            res.render('studentsModule', { students: result, mid: req.params.mid })
        })
        .catch((error) => {
            res.send(error)
        })
})


app.get('/listDepartments', (req, res) => {
    sqlDAO.showDepartments()
        .then((result) => { // If successful  
            res.render('departments', { depts: result })
        })
        .catch((error) => { // If errors
            res.send(error)
        })
})


// Lists the lecturers collection using MongoDB
app.get('/listLecturers', (req, res) => {
    mongoDAO.showLecturers()    // calls mongo Data Access Object (DAO) function
        .then((docs) => {       // If successful
            res.render('lecturer', { listLect: docs })
        })
        .catch((error) => {     // If there are any errors
            res.send(error)
        })
})


// GET addLecturers
app.get('/addLecturers', (req, res) => {
    res.render('addLecturers', { errors: undefined })
})


// POST addLecturers
app.post('/addLecturers', [
    check('_id').isLength(4).withMessage("Lecturer ID must be 4 characters"),
    check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
    check('dept').isLength(3).withMessage("Department must be 3 characters")], async (req, res) => {
        var errors = validationResult(req)
        var submitDept = req.body.dept
        var isDeptFound = 0

        if (!errors.isEmpty()) {    
            res.render('addLecturers', { errors: errors.errors, _id: req.body._id, name: req.body.name, dept: req.body.dept })      // If no errors
        } 

        else 
        {
            await sqlDAO.checkIfDepartmentExists(submitDept)    // If department is found set the value to 1
                .then((result) => {
                    isDeptFound = result[0].found
                })

            if (isDeptFound === 1) {    // If it's found
                mongoDAO.addLecturer(req.body._id, req.body.name, req.body.dept)    // Add the new lecturer to database
                    .then(() => {
                        res.redirect('/listLecturers')      // Redirect /listLecturers
                    })
            } 

            else 
            {
                res.render('addLecturers', { errors: errors.errors, deptErr: "Department does not exist", _id: req.body._id, name: req.body.name, dept: req.body.dept })
            }
        }
    })


// Localhost will listen for requests on port : 3000
app.listen(3000, () => {
    console.log("Listening on port 3000")
})