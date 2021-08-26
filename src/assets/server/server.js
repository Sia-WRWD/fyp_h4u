var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var md5 = require('md5');
var mysql = require('mysql2');
var PORT = process.env.PORT || 3000;
var dateFormat = require('dateformat');
var pool = mysql.createPool
    ({
        connectionLimit: 0,
        queueLimit: 0,
        host: "localhost",
        user: "jcn",
        password: "Ilovedonuts321",
        database: "h4u_consultation"
    });

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cors());

app.get('/', function (req, res) {
    res.send('Server is Operational.');
});

//Get All User Data
app.get('/getAllUserData', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        console.log("Connected to DB.");
        connection.query(`SELECT user_id, user_username, user_email, user_first_name, user_last_name, user_gender
                            user_birthday, user_phone_number, user_role, user_state FROM users`, function (err, result) {
            if (err) {
                throw err;
            } else {
                connection.release();
                console.log("Fetched User Data: " + result.length);
                res.send(result);
            }
        });
    });
});

//Get User Data by ID
app.get('/getUserData/:id', function (req, res) {

    var userID = req.params.id;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        const selectUserData = `SELECT user_id, user_username, user_email, user_first_name, user_last_name, user_gender,
                                user_birthday, user_phone_number, user_role, user_address, user_postcode, user_city,
                                user_state FROM users WHERE user_id = ?`;

        console.log("Connected to DB.");
        connection.query(selectUserData, [userID], function (err, result) {
            if (err) {
                throw err;
            } else {
                connection.release();
                console.log("User fetched by ID: " + result);
                res.send(result);
            }
        });
    });
});

//Register User Data
app.post('/saveUserData', function (req, res) {

    res.status(200).send({ message: "Registration Data Received!" });
    let { username, email, password, gender, first_name, last_name, phone_number, birthday, role, address, postcode, city, state } = req.body;
    console.log(req.body);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        console.log("Connected to DB.");
        const hashed_password = md5(password.toString());
        const formatted_birthday = dateFormat(birthday, "yyyy-mm-dd");
        const checkUsername = `SELECT user_username FROM users WHERE user_username = ?`;
        const checkEmail = `SELECT user_email FROM users WHERE user_email = ?`;
        const insertUserData = `INSERT into users (user_username, user_email, user_password, user_first_name, 
                                user_last_name, user_gender, user_birthday, user_phone_number, user_role,
                                user_address, user_postcode, user_city, user_state) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(checkUsername, [username], function (err, result) {
            if (err) throw err;
            if (!result.length) {
                connection.query(checkEmail, [email], function (err, result) {
                    if (err) throw err;
                    if (!result.length) {
                        connection.query(insertUserData, [username, email, hashed_password, first_name, last_name, gender,
                            formatted_birthday, phone_number, role, address, postcode, city, state], (err, result) => {
                                if (err) {
                                    res.send({ status: 0, data: err, message: "Failed to Save User!" });
                                } else {
                                    connection.release();
                                    console.log("Successfully Registered User!");
                                    console.log("Registered User: " + result);
                                }
                            })
                    } else {
                        connection.release();
                        console.log("User with this Email already Existed!");
                        res.send({ status: 422, message: "Email Already Existed!" });
                    }
                })
            } else {
                connection.release();
                console.log("User with this Username already Existed!");
                res.send({ status: 422, message: "Username Already Existed!" });
            }
        });
    });
});

//Update User Data
app.post('/updateUserInfo/:id', function (req, res) {
    var userID = req.params.id;

    res.status(200).send({ message: "Update User Data Received!" });
    let { username, email, gender, first_name, last_name, phone_number, birthday, role, address, postcode, city, state } = req.body;
    console.log(req.body);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        console.log("Connected to DB.");
        const formatted_birthday = dateFormat(birthday, "yyyy-mm-dd");
        const updateUserData = `UPDATE users SET user_username = ?, user_email = ?, user_first_name = ?, 
                                user_last_name = ?, user_gender = ?, user_birthday = ?, user_phone_number = ?, 
                                user_role = ?, user_address = ?, user_postcode = ?, user_city = ?, user_state = ? 
                                WHERE user_id = ?`;

        connection.query(updateUserData, [username, email, first_name, last_name, gender,
            formatted_birthday, phone_number, role, address, postcode, city, state, userID], (err, result) => {
                if (err) {
                    res.send({ status: 0, data: err, message: "Failed to Update User!" });
                } else {
                    connection.release();
                    console.log("Successfully Updated User's Info!");
                    console.log("Updated User Data: " + result.affectedRows);
                }
            });
    });
});

//Delete User Data
app.delete('/deleteUserData/:id', function (req, res) {

    var userID = req.params.id;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        console.log('Connected to DB');
        deleteUser = "DELETE FROM users WHERE user_id = ?";
        connection.query(deleteUser, [userID], function (err, result) {
            if (err) {
                res.send({ status: 422, data: err, message: "Failed to Delete User!" });
            } else {
                connection.release();
                console.log("Deleted User Data:" + result.affectedRows);
                res.send(result);
            }
        });
    });
});

//Get All Consultation Data
app.get('/getAllConsultationData', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        console.log("Connected to DB.");
        connection.query(`SELECT * FROM consultation`, function (err, result) {
            if (err) {
                throw err;
            } else {
                connection.release();
                console.log("All Data Fetched: " + result.length);
                res.send(result);
            }
        });
    });
});

//Get Consultation Data by ID
app.get('/getConsultationData/:id', function (req, res) {

    var consultationID = req.params.id;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        const selectConsultationData = `SELECT * FROM consultation WHERE consultation_id = ?`;

        console.log("Connected to DB.");
        connection.query(selectConsultationData, [consultationID], function (err, result) {
            if (err) {
                throw err;
            } else {
                connection.release();
                console.log("Consultation fetched by ID:" + result);
                res.send(result);
            }
        });
    });
});

//Get Ongoing Consultation Data
app.get('/getOngoingConsultationData', function(req, res) {

    pool.getConnection(function(err, connection) {
        if (err) throw err;
        selectOngoingConsultation = `SELECT * FROM consultation WHERE consultation_status = ?`;

        connection.query(selectOngoingConsultation, ['ongoing'], (err, result) => {
            if (err) {
                throw err
            } else {
                connection.release();
                console.log("Fetched Ongoing Consultation Data: " + result.length);
                res.send(result);
            }
        });
    });
});

//Add Consultation Data
app.post('/saveConsultationData', function (req, res) {

    res.status(200).send({ message: "Registration Data Received!" });
    let { date, time, consultor, consultee, type, platform, comment, status } = req.body;
    console.log(req.body);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        console.log("Connected to DB.");
        const formatted_date = dateFormat(date, "yyyy-mm-dd");
        const insertConsultationData = `INSERT into consultation (consultation_date, consultation_time, consultation_consultor,
                                        consultation_consultee, consultation_type, consultation_platform, consultation_comment,
                                        consultation_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(insertConsultationData, [formatted_date, time, consultor, consultee, type, platform,
                            comment, status], (err, result) => {
                if (err) {
                    res.send({ status: 422, data: err, message: "Failed to Save Consultation!" });
                } else {
                    connection.release();
                    console.log("Successfully Added Consultation!");
                    console.log("Added Consultation Data: " + result);
                }
            });
    });
});

//Update Consultation Info
app.post('/updateConsultationInfo/:id', function (req, res) {
    var consultationID = req.params.id;

    res.status(200).send({ message: "Update Consultation Data Received!" });
    let { date, time, consultor, consultee, type, platform, comment, status } = req.body;
    console.log(req.body);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        console.log("Connected to DB.");
        const formatted_date = dateFormat(date, "yyyy-mm-dd");
        const updateConsultationInfo = `UPDATE consultation SET consultation_date = ?, consultation_time = ?, consultation_consultor = ?,
                                        consultation_consultee = ?, consultation_type = ?, consultation_platform = ?, consultation_comment = ?,   
                                        consultation_status = ? WHERE consultation_id = ?`;

        connection.query(updateConsultationInfo, [formatted_date, time, consultor, consultee, type, platform, comment, status,
            consultationID], (err, result) => {
                if (err) {
                    res.send({ status: 422, data: err, message: "Failed to Update Consultation!" });
                } else {
                    connection.release();
                    console.log("Successfully Updated Consultation's Info!");
                    console.log("Updated Consultation Data: " + result.affectedRows);
                }
            });
    });
});

//Delete Consultation Data
app.delete('/deleteConsultationData/:id', function (req, res) {

    var consultationID = req.params.id;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        console.log('Connected to DB');
        deleteConsultation = "DELETE FROM consultation WHERE consultation_id = ?";
        connection.query(deleteConsultation, [consultationID], (err, result) => {
            if (err) {
                res.send({ status: 422, data: err, message: "Failed to Delete Consultation!" });
            } else {
                connection.release();
                console.log("Deleted Consultation Data: " + result.affectedRows);
                res.send(result);
            }
        });
    });
});

//Verify User Login
app.post('/verifyGrabUser', function(req, res) {

    let { username, password, role } = req.body;
    console.log(req.body);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        console.log("Connected to DB!");

        hashed_password = md5(password.toString());
        grabUserInfo = "SELECT * FROM users WHERE user_username = ? AND user_password = ? AND user_role = ?";

        connection.query(grabUserInfo, [username, hashed_password, role], (err, result) => {
            if(!result.length) {
                res.send({ status: 422, data: err, message: "Failed to Login!" });
                console.log("wrong username, password or role!");
            } else if (result.length == 1) {
                console.log(result.length);
                res.send(result);
            }
        });
    });
});

app.listen(PORT, function () {
    console.log("Server is running on localhost:" + PORT);
})