const express = require('express');

const router = express.Router();
const { EngineeringDegree, Semester, Subject, Note } = require('../modals/NoteModal.js');

// Home page - List all engineering degrees
router.get('/', async (req, res) => {
  try {
    const degrees = await EngineeringDegree.find().populate('semesters');
    res.render('index', { degrees });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

// View semesters for a specific degree
router.get('/degrees/:degreeId', async (req, res) => {
  try {
    const degree = await EngineeringDegree.findById(req.params.degreeId)
      .populate('semesters');
    
    if (!degree) {
      return res.status(404).render('error', { error: 'Engineering degree not found' });
    }
    
    res.render('semesters', { degree, semesters: degree.semesters });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

// View subjects for a specific semester
router.get('/semesters/:semesterId', async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.semesterId)
      .populate('subjects')
      .populate('engineeringDegree');
    
    if (!semester) {
      return res.status(404).render('error', { error: 'Semester not found' });
    }
    
    res.render('subjects', { 
      semester, 
      subjects: semester.subjects,
      degree: semester.engineeringDegree 
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

// View notes for a specific subject
router.get('/subjects/:subjectId', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId)
      .populate('notes')
      .populate({
        path: 'semester',
        populate: { path: 'engineeringDegree' }
      });
    
    if (!subject) {
      return res.status(404).render('error', { error: 'Subject not found' });
    }
    
    res.render('notes', { 
      subject, 
      notes: subject.notes,
      semester: subject.semester,
      degree: subject.semester.engineeringDegree
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

// PDF Viewer page
router.get('/notes/:noteId/view', async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId)
      .populate({
        path: 'subject',
        populate: {
          path: 'semester',
          populate: { path: 'engineeringDegree' }
        }
      });
    
    if (!note) {
      return res.status(404).render('error', { error: 'Note not found' });
    }
    
    res.render('pdf-viewer', { 
      note,
      subject: note.subject,
      semester: note.subject.semester,
      degree: note.subject.semester.engineeringDegree
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

module.exports = router;
