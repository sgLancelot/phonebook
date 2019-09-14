const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify',false)
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personsSchema = new mongoose.Schema({
    name: {type:String, required:true, minlength:3},
    number: {type:String, required:true, unique:true, minlength:8}
})

personsSchema.plugin(uniqueValidator)

personsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personsSchema)