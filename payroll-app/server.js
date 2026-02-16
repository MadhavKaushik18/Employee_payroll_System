const express = require('express');
const app = express();
const fileHandler = require('./modules/fileHandler');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


// HOME ROUTE (Dashboard)
app.get('/', async (req, res) => {
    const employees = await fileHandler.read();
    res.render('index', { employees });
});


// SHOW ADD FORM
app.get('/add', (req, res) => {
    res.render('add');
});


// ADD EMPLOYEE
app.post('/add', async (req, res) => {
    const { name, department, salary } = req.body;

    if (!name || salary < 0) {
        return res.send("Invalid Data!");
    }

    const employees = await fileHandler.read();

    const newEmployee = {
        id: Date.now(),
        name,
        department,
        salary: Number(salary)
    };

    employees.push(newEmployee);
    await fileHandler.write(employees);

    res.redirect('/');
});


// DELETE EMPLOYEE
app.get('/delete/:id', async (req, res) => {
    const id = Number(req.params.id);
    let employees = await fileHandler.read();

    employees = employees.filter(emp => emp.id !== id);

    await fileHandler.write(employees);
    res.redirect('/');
});


// SHOW EDIT FORM
app.get('/edit/:id', async (req, res) => {
    const id = Number(req.params.id);
    const employees = await fileHandler.read();

    const employee = employees.find(emp => emp.id === id);

    res.render('edit', { employee });
});


// UPDATE EMPLOYEE
app.post('/edit/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name, department, salary } = req.body;

    let employees = await fileHandler.read();

    employees = employees.map(emp => {
        if (emp.id === id) {
            return {
                ...emp,
                name,
                department,
                salary: Number(salary)
            };
        }
        return emp;
    });

    await fileHandler.write(employees);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});