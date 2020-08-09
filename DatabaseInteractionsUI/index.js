let express = require('express');
let app = express();
let handlebars = require('express-handlebars').create({defaultLayout: 'main'});
let bodyParser = require('body-parser');
let mysql = require('mysql');

// Conection information
let pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs290_ramieman',
    password        : '4882',
    database        : 'cs290_ramieman'

});

// Generate Initial Table within the 'workouts' database
pool.query("DROP TABLE IF EXISTS workouts", function() {
    let createTable = "CREATE TABLE workouts(" +
        "id INT PRIMARY KEY AUTO_INCREMENT," +
        "name VARCHAR(255) NOT NULL," +
        "rep INT," +
        "weight INT," +
        "units BOOLEAN," +
        "date DATE)";
    pool.query(createTable, function(error) {
        if (error) {
            console.log(error);
            console.log("Table Creation: Error.")
        }
        console.log("Table Creation: OK!");
    });
});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 48823);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function(req, res){
    res.render('home');
});

app.get('/tasks', function(req, res) {
    let context = {};
    if (!req.query.id) {
        pool.query('SELECT * FROM workouts', function(error, rows) {
            if (error) {
                console.log(error);
                return;
            }
            context.results = JSON.stringify(rows);
            res.send(context);
        });
    } else {
        pool.query('SELECT * FROM workouts WHERE id = ' + req.query.id, function(error, rows) {
            if (error) {
                console.log(error);
                return;
            }
            context.results = JSON.stringify(rows);
            res.send(context);
        });
    }
});

app.put('/tasks', function(req, res) {
    console.log("Updating existing workout...");
    pool.query('UPDATE workouts SET name=?, rep=?, weight=?, date=?, units=? WHERE id=? ',
        [req.query.name, req.query.rep, req.query.weight, req.query.date, req.query.units, req.query.id], function(error) {
        if (error) {
            console.log(error);
            return;
        }
        console.log('Workout Updated: OK!')
        res.render('home');
    });
});

app.post('/tasks', function(req, res) {
    console.log("Creating new workout...");
    let body = req.body;
    console.log(body);
    let name = body.name === '' ? null : body.name;
    let reps = body.rep;
    let weight = body.weight;
    let date = body.date;
    let units = body.units;
    let values = "'" + name + "'," + reps + ',' + weight + ",'" + date + "'," + units;
    pool.query('INSERT INTO workouts(name, rep, weight, date, units) VALUES (' + values + ');', function(error, rows) {
        if (error) {
            console.log(error);
            return;
        }
        console.log("New workout created: OK!")
        let data = JSON.stringify(rows);
        res.send(data);
    });
});

app.post('/', function(req, res){
    res.render('home');
});

app.delete('/tasks', function(req, res) {
    console.log('Deleting existing workout...');
    let id = req.query.id;
    let context = {};
    pool.query('DELETE FROM workouts WHERE id = ' + id, function(error, rows) {
        if (error) {
            next(error);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

app.use(function(req, res){
    res.status(404);
    res.render('404');
});

app.use(function(error, req, res){
    console.log(error.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Database started on port ' + app.get('port'));
});
