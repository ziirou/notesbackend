require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length > 3) {
  /* Add a new note. */
  const note = new Note({
    content: process.argv[2],
    important: process.argv[3],
  })

  note.save()
    .then(() => {
      console.log(`added '${note.content}' to notes`)
      mongoose.connection.close()
    })
    .catch(error =>
      console.log(`Error: ${error}`)
    )
} else {
  /* Get existing notes. */
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}
