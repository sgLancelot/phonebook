const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
]

app.get('/info', (req,res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        ${Date()}`)
    })

app.get('/api/persons', (req,res) => {res.json(persons)})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(x=>x.id===id)
    if (person) {
        return res.json(person)
    } else {
        res.status(404).end()}
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(x => x.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req,res) => {
    const person = req.body
// error 400 if name or number missing, name already in phonebook
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    } else if (persons.find(x=>x.name===person.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    } else {
        person.id = Math.floor(Math.random() * 50 + 1)
        persons = persons.concat(person)

        res.json(persons)}
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})