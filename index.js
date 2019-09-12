require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/people')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})

app.get('/info', (req,res) => {
    Person.find({}).then(x => {
        res.send(`<p>Phonebook has info for 
        ${x.reduce((sum, y) => {return sum + 1},0)} people</p> 
        ${Date()}`)
    })
})

app.get('/api/persons', (req,res) => {
    Person.find({}).then(x => {
        res.json(x.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req,res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person.toJSON())
    })
})

app.delete('/api/persons/:id', (req,res) => {
    Person.findByIdAndDelete(req.params.id).then(x=> {
        res.status(204).end()
    })
})

app.post('/api/persons', (req,res) => {
    const person = req.body
    // error 400 if name or number missing, name already in phonebook
    if (!person.name || !person.number) {
        return res.status(400).json({error: 'name or number missing'})
    } else {
        const newPerson = new Person({
            name: person.name,
            number: person.number,
    })
        newPerson.save().then(x => {
            res.json(x.toJSON())
        })
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})