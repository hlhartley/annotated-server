// We import express, cors, and shortid at the top
import express from "express"
const app = express()
import cors from "cors"
app.use(cors())
app.use(express.json())
import shortid from 'shortid'

// We manually input an array of preset notes in our database each with an id, title, color, and an array of issues
app.locals.notes = [
    {
        id: '1',
        title: "Trapper Keeper",
        color: 'purple',
        issues: [
        {
            id: 21,
            body: "Finish project",
            completed: false
        },
        {
            id: 22,
            body: "Start project",
            completed: false
        },
        {
            id: 23,
            body: "Test project",
            completed: false
        },
        {
            id: 24,
            body: "Deploy to Heroku",
            completed: false
        }
        ]
    },
    {
        id: '2',
        title: "This is a great note",
        color: 'blue',
        issues: [{id: 25, body: "beep boop", completed: true}],
    }
]

// For a GET request of all the notes, the endpoint is /api/v1/notes.
// The response (res) status code will be 200 if everything is ok. 
// Finally, the server will convert the data to json for all of the notes.
app.get('/api/v1/notes', (req, res) => {
    res.status(200).json(app.locals.notes)
})

// For a POST request, the endpoint is /api/v1/notes.
// A POST request must include the title, color, and issues a user wants to add in the body of the request.
// If there is no title, color, or issues, then the server will return a status code of 422 and the message.
// Next, on line 62, we make a newNote with a unique id and body info as input by the user.
// We then push that newNote into the array of notes (app.locals.notes).
// Finally, we return a status code of 201 that the note has been successfully created and json the newNote.
app.post('/api/v1/notes', (req, res) => {
    const { title, color, issues } = req.body
    if (!title || !color || !issues) return res.status(422).json('Please provide a title and issues for your note')
    const newNote = {
    id: shortid.generate(),
    ...req.body
    }
    app.locals.notes.push(newNote)
    return res.status(201).json(newNote)
})

// To make a GET request of a single note, we need the id of that note.
// The endpoint will be /api/v1/notes/:id and :id will be the unique id of the note requested.
// We look in our array of notes for the note that matches the id of the req.params.id.
// If there's no note, we return a status code of 404 with the message.
// If the note is found we return a status code of 200 and json the note.
app.get('/api/v1/notes/:id', (req, res) => {
    const note = app.locals.notes.find(note => note.id == req.params.id)
    if (!note) return res.status(404).json('Note not found')
    return res.status(200).json(note)
})

// To update a note with a PUT request, we need the id of that note.
// The endpoint is /api/v1/notes/:id and :id is the unique id of that note.
// We need title, color, and issues in the body of the request.
// PUT will completely replace the note with the new data.
// If there is no title, color, or issues, then we return a status code of 422 and the message.
// Then we find the index of the note.
// If there is no index, we return a status code of 404 and the message.
// If there is a note, we replace the note with the new contents of the body as input by the user.
// On line 102 we splice the notes to replace the new info with the old.
// Finally, we return a status code of 204.
app.put('/api/v1/notes/:id', (req, res) => {
    const { title, color, issues } = req.body
    const { notes } = app.locals
    if (!title || !color || !issues) return res.status(422).json('Please provide a title and issues for your note')
    const index = notes.findIndex(note => note.id == req.params.id)
    if (index === -1) return res.status(404).json('Note not found')
    const newNote = { id: notes[index].id, title, color, issues }
    notes.splice(index, 1, newNote)
    return res.sendStatus(204)
})

// To delete a note with a DELETE request, we only need the id of that note.
// The endpoint is /api/v1/notes/:id and :id is the unique id of that note.
// First, we find the index of that note.
// If there is no index found we return a 404 status code and the message.
// If the note is found, we use splice to cut out that note from the array (app.locals.notes).
// Finally, we return a response status code of 204 to indicate the note has been deleted successfully with the message.
app.delete('/api/v1/notes/:id', (req, res) => {
    const { notes } = app.locals
    const index = notes.findIndex(note => note.id == req.params.id)
    if (index === -1) return res.status(404).json('Note not found')
    notes.splice(index, 1)
    return res.sendStatus(204)
})

// We must export default app at the bottom
export default app;
