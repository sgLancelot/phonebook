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

app.get('/info', (_req,res) => {
    Person.find({}).then(x => {
        res.send(`<p>Phonebook has info for 
        ${x.reduce((sum) => {return sum + 1},0)} people</p> 
        ${Date()}`)
    })
})

app.get('/api/persons', (_req,res) => {
    Person.find({}).then(x => {
        res.json(x.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req,res,next) => {
    Person.findById(req.params.id).then(person => {
        if (person){
            res.json(person.toJSON())
        } else {
            res.status(404).end()
        }  
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req,res) => {
    Person.findByIdAndDelete(req.params.id).then(()=> {
        res.status(204).end()
    })
})

app.post('/api/persons', (req,res,next) => {
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
            .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (req,res,next)=> {
    Person.findByIdAndUpdate(req.params.id, req.body, {new:true}).then(x=> {
        res.json(x.toJSON())
    })
        .catch(error => next(error))
})

const errorHandler = (error, _request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({error:error.message})
    }
    next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})