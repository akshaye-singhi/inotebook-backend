const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note')

//ROUTE 1 : Fetch all notes using : POST "/api/notes/fetch"
router.get(
    '/fetch',
    fetchuser,
    async (req, res) => {
        try {
            const notes = await Note.find({ user_id: req.user.id })
            res.send(notes)
        } catch (error) {
            console.log(error)
            res.status(500).send('Internal Server Error')
        }
    })

//ROUTE 2 : Add a note using : POST "/api/notes/add"
router.post(
    '/add',
    fetchuser,
    // array of validations
    [
        // title must be at least 3 chars long
        body('title', 'title length must be at least 3').isLength({ min: 3 }),
        // password must be at least 5 chars long
        body('description', 'description length must be at least 5').isLength({ min: 5 }),
    ],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body
            note = await Note.create({
                user_id: req.user.id,
                title,
                description,
                tag
            })
            res.send(note)
        } catch (error) {
            console.log(error)
            res.status(500).send('Internal Server Error')
        }
    })

//ROUTE 3 : Update a note given it's id in req.params, using : PUT "api/notes/update"
router.put(
    '/update/:id',
    fetchuser,
    async (req, res) => {
        // If there are validation errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let note = await Note.findById(req.params.id)
            if (!note) {
                return res.status(404).send('Note does not exist')
            }
            //note should be updated only by the user of that note
            if (note.user_id.toString() !== req.user.id) {
                return res.status(401).send('Not allowed')
            }

            const { title, description, tag } = req.body
            const new_note = {}
            if (title) { new_note.title = title }
            if (description) { new_note.description = description }
            if (tag) { new_note.tag = tag }

            // I have no idea why "{new:true}" is being used here
            note = await Note.findByIdAndUpdate(req.params.id, { $set: new_note }, { new: true });
            res.json({ note })
        } catch (error) {
            console.log(error)
            res.status(500).send('Internal Server Error')
        }
    }
)

//ROUTE 4 : Delete a note given it's id in req.params, using : DELETE "api/notes/delete"
router.delete(
    '/delete/:id',
    fetchuser,
    async (req, res) => {
        try {
            let note = await Note.findById(req.params.id)
            if (!note) {
                return res.status(404).send('Note does not exist')
            }
            //note should be deleted only by the user of that note
            if (note.user_id.toString() !== req.user.id) {
                return res.status(401).send('Not allowed')
            }

            note = await Note.findByIdAndDelete(req.params.id)
            res.json({ note })

        } catch (error) {
            console.log(error)
            res.status(500).send('Internal Server Error')
        }
    }
)
module.exports = router