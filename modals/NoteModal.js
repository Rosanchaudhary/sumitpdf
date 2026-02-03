const mongoose = require('mongoose');
const { Schema } = mongoose;

// Note Schema
const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  }
}, {
  timestamps: true
});

// Subject Schema
const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    trim: true
  },
  semester: {
    type: Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
}, {
  timestamps: true
});

// Semester Schema
const semesterSchema = new Schema({
  number: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  engineeringDegree: {
    type: Schema.Types.ObjectId,
    ref: 'EngineeringDegree',
    required: true
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  }]
}, {
  timestamps: true
});

// Engineering Degree Schema
const engineeringDegreeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    enum: ['Civil', 'Electrical', 'Mechanical', 'Computer', 'Electronics', 'Chemical', 'Aerospace', 'Other']
  },
  shortName: {
    type: String,
    trim: true
  },
  semesters: [{
    type: Schema.Types.ObjectId,
    ref: 'Semester'
  }]
}, {
  timestamps: true
});

// Create indexes for better query performance
noteSchema.index({ subject: 1, title: 1 });
subjectSchema.index({ semester: 1, name: 1 });
semesterSchema.index({ engineeringDegree: 1, number: 1 });
 
// Models
const Note = mongoose.model('Note', noteSchema);
const Subject = mongoose.model('Subject', subjectSchema);
const Semester = mongoose.model('Semester', semesterSchema);
const EngineeringDegree = mongoose.model('EngineeringDegree', engineeringDegreeSchema);

module.exports = {
  Note,
  Subject,
  Semester,
  EngineeringDegree
};