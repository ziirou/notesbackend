const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

const setImportance = (important) => {
  if (typeof important !== 'boolean') {
    if (important === 'false') {
      return false
    }

    return true
  }

  return important
}

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: setImportance(body.important),
  })

  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch(exception) {
    next(exception)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const { content, important } = request.body

  try {
    const note = await Note.findById(request.params.id)
    if (!note) {
      response.status(404).end()
    }

    note.content = content
    note.important = setImportance(important)

    const updatedNote = await note.save()
    response.status(200).json(updatedNote)
  } catch(exception) {
    next(exception)
  }
})

module.exports = notesRouter
