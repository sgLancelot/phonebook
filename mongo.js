const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const inputName = process.argv[3]
const inputNumber = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0-jvmz8.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true } )

const personsSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personsSchema)

if (inputName && inputNumber) {
    const person = new Person({
        name: inputName,
        number: inputNumber,
    })

    person.save().then(x => {
        console.log(`added ${inputName} ${inputNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('phonebook:')
    Person
        .find({})
        .then(persons => {
            persons.forEach(x =>{
                console.log(`${x.name} ${x.number}`)
            })
            mongoose.connection.close()
        })
}

