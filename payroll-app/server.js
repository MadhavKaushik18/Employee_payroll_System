const express = require("express")
const path = require("path")
const fileHandler = require("./modules/filehandler")

const app = express()
const PORT = 4000

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.get("/", async (req, res) => {
    console.log("Hellow")
    const employees = await fileHandler.read()
    console.log("employees", employees)
    res.render("index", { employees })
})

app.get("/add", (req, res) => {
    res.render("add")
})

app.post("/add", async (req, res) => {
    const { name, department, salary } = req.body
    if (!name || !department || Number(salary) < 0) {
        return res.redirect("/")
    }
    const employees = await fileHandler.read()
    employees.push({
        id: Date.now(),
        name,
        department,
        salary: Number(salary)
    })
    await fileHandler.write(employees)
    res.redirect("/")
})

app.get("/delete/:id", async (req, res) => {
    const employees = await fileHandler.read()
    const updated = employees.filter(e => e.id != req.params.id)
    await fileHandler.write(updated)
    res.redirect("/")
})

app.get("/edit/:id", async (req, res) => {
    const employees = await fileHandler.read()
    const employee = employees.find(e => e.id == req.params.id)
    res.render("edit", { employee })
})

app.post("/edit/:id", async (req, res) => {
    const { name, department, salary } = req.body
    const employees = await fileHandler.read()
    const index = employees.findIndex(e => e.id == req.params.id)
    if (index !== -1 && name && department && Number(salary) >= 0) {
        employees[index] = {
            ...employees[index],
            name,
            department,
            salary: Number(salary)
        }
    }
    await fileHandler.write(employees)
    res.redirect("/")
})

app.listen(PORT, async () => {
    const data = await fileHandler.read()
    console.log(data)
})