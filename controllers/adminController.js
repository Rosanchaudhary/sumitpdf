
const fs = require("fs");
const path = require("path");
const { EngineeringDegree, Semester, Subject, Note } = require("../modals/NoteModal");

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const degrees = await EngineeringDegree.find().populate("semesters");
    res.render("admin/dashboard", { degrees });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

// ========== Engineering Degree Controllers ==========
exports.getDegrees = async (req, res) => {
  try {
    const degrees = await EngineeringDegree.find().populate("semesters");
    res.render("admin/degrees/list", { degrees });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.getNewDegree = (req, res) => {
  res.render("admin/degrees/new");
};

exports.createDegree = async (req, res) => {
  try {
    const { name, shortName } = req.body;
    const degree = new EngineeringDegree({ name, shortName });
    await degree.save();
    res.redirect("/admin/degrees");
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.getEditDegree = async (req, res) => {
  try {
    const degree = await EngineeringDegree.findById(req.params.id);
    res.render("admin/degrees/edit", { degree });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.updateDegree = async (req, res) => {
  try {
    const { name, shortName } = req.body;
    await EngineeringDegree.findByIdAndUpdate(req.params.id, {
      name,
      shortName,
    });
    res.redirect("/admin/degrees");
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.deleteDegree = async (req, res) => {
  try {
    await EngineeringDegree.findByIdAndDelete(req.params.id);
    res.redirect("/admin/degrees");
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

// ========== Semester Controllers ==========
exports.getSemesters = async (req, res) => {
  try {
    const degree = await EngineeringDegree.findById(
      req.params.degreeId,
    ).populate("semesters");
    res.render("admin/semesters/list", { degree, semesters: degree.semesters });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.getNewSemester = async (req, res) => {
  try {
    const degree = await EngineeringDegree.findById(req.params.degreeId);
    res.render("admin/semesters/new", { degree });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.createSemester = async (req, res) => {
  try {
    const { number, name } = req.body;
    const semester = new Semester({
      number,
      name,
      engineeringDegree: req.params.degreeId,
    });
    await semester.save();

    // Add semester to degree
    await EngineeringDegree.findByIdAndUpdate(req.params.degreeId, {
      $push: { semesters: semester._id },
    });

    res.redirect(`/admin/degrees/${req.params.degreeId}/semesters`);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.getEditSemester = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id).populate(
      "engineeringDegree",
    );
    res.render("admin/semesters/edit", { semester });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.updateSemester = async (req, res) => {
  try {
    const { number, name } = req.body;
    const semester = await Semester.findByIdAndUpdate(
      req.params.id,
      { number, name },
      { new: true },
    );
    res.redirect(`/admin/degrees/${semester.engineeringDegree}/semesters`);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    const degreeId = semester.engineeringDegree;

    // Remove from degree
    await EngineeringDegree.findByIdAndUpdate(degreeId, {
      $pull: { semesters: semester._id },
    });

    await Semester.findByIdAndDelete(req.params.id);
    res.redirect(`/admin/degrees/${degreeId}/semesters`);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

// ========== Subject Controllers ==========
exports.getSubjects = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.semesterId)
      .populate("subjects")
      .populate("engineeringDegree");
    res.render("admin/subjects/list", {
      semester,
      subjects: semester.subjects,
    });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.getNewSubject = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.semesterId).populate(
      "engineeringDegree",
    );
    res.render("admin/subjects/new", { semester });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;
    const subject = new Subject({
      name,
      code,
      semester: req.params.semesterId,
    });
    await subject.save();

    // Add subject to semester
    await Semester.findByIdAndUpdate(req.params.semesterId, {
      $push: { subjects: subject._id },
    });

    res.redirect(`/admin/semesters/${req.params.semesterId}/subjects`);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.getEditSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate({
      path: "semester",
      populate: { path: "engineeringDegree" },
    });
    res.render("admin/subjects/edit", { subject });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { name, code } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, code },
      { new: true },
    );
    res.redirect(`/admin/semesters/${subject.semester}/subjects`);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    const semesterId = subject.semester;

    // Remove from semester
    await Semester.findByIdAndUpdate(semesterId, {
      $pull: { subjects: subject._id },
    });

    await Subject.findByIdAndDelete(req.params.id);
    res.redirect(`/admin/semesters/${semesterId}/subjects`);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

// ========== Note Controllers ==========
exports.getNotes = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId)
      .populate("notes")
      .populate({
        path: "semester",
        populate: { path: "engineeringDegree" },
      });
    res.render("admin/notes/list", { subject, notes: subject.notes });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.getNewNote = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId).populate({
      path: "semester",
      populate: { path: "engineeringDegree" },
    });
    res.render("admin/notes/new", { subject });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .render("error", { error: "Please upload a PDF file" });
    }

    const { title, author } = req.body;
    const pdfUrl = "/uploads/pdfs/" + req.file.filename;

    const note = new Note({
      title,
      author,
      pdfUrl,
      subject: req.params.subjectId,
    });
    await note.save();

    // Add note to subject
    await Subject.findByIdAndUpdate(req.params.subjectId, {
      $push: { notes: note._id },
    });

    res.redirect(`/admin/subjects/${req.params.subjectId}/notes`);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.getEditNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate({
      path: "subject",
      populate: {
        path: "semester",
        populate: { path: "engineeringDegree" },
      },
    });
    res.render("admin/notes/edit", { note });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.updateNote = async (req, res) => { 
  try {
    const { title, author } = req.body;
    const updateData = { title, author };

    // If new file uploaded, update pdfUrl and delete old file
    if (req.file) {
      const oldNote = await Note.findById(req.params.id);
      const oldFilePath = path.join(__dirname, "..", "public", oldNote.pdfUrl);

      // Delete old file if it exists
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      updateData.pdfUrl = "/uploads/pdfs/" + req.file.filename;
    }

    const note = await Note.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.redirect(`/admin/subjects/${note.subject}/notes`);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    const subjectId = note.subject;

    // Delete PDF file
    const filePath = path.join(__dirname, "..", "public", note.pdfUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from subject
    await Subject.findByIdAndUpdate(subjectId, { $pull: { notes: note._id } });

    await Note.findByIdAndDelete(req.params.id);
    res.redirect(`/admin/subjects/${subjectId}/notes`);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
};
