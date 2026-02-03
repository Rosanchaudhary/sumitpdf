const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const adminController = require("../controllers/adminController.js");

// Configure multer for PDF upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/pdfs/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "note-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Admin Dashboard
router.get("/", adminController.getDashboard);

// Engineering Degree Routes
router.get("/degrees", adminController.getDegrees);
router.get("/degrees/new", adminController.getNewDegree);
router.post("/degrees", adminController.createDegree);
router.get("/degrees/:id/edit", adminController.getEditDegree);
router.post("/degrees/:id/edit", adminController.updateDegree);
router.post("/degrees/:id/delete", adminController.deleteDegree);

// Semester Routes
router.get("/degrees/:degreeId/semesters", adminController.getSemesters);
router.get("/degrees/:degreeId/semesters/new", adminController.getNewSemester);
router.post("/degrees/:degreeId/semesters", adminController.createSemester);
router.get("/semesters/:id/edit", adminController.getEditSemester);
router.post("/semesters/:id/edit", adminController.updateSemester);
router.post("/semesters/:id/delete", adminController.deleteSemester);

// Subject Routes
router.get("/semesters/:semesterId/subjects", adminController.getSubjects);
router.get(
  "/semesters/:semesterId/subjects/new",
  adminController.getNewSubject,
);
router.post("/semesters/:semesterId/subjects", adminController.createSubject);
router.get("/subjects/:id/edit", adminController.getEditSubject);
router.post("/subjects/:id/edit", adminController.updateSubject);
router.post("/subjects/:id/delete", adminController.deleteSubject);

// Note Routes
router.get("/subjects/:subjectId/notes", adminController.getNotes);
router.get("/subjects/:subjectId/notes/new", adminController.getNewNote);
router.post(
  "/subjects/:subjectId/notes",
  upload.single("pdfFile"),
  adminController.createNote,
);
router.get("/notes/:id/edit", adminController.getEditNote);
router.post(
  "/notes/:id/edit",
  upload.single("pdfFile"),
  adminController.updateNote,
);
router.post("/notes/:id/delete", adminController.deleteNote);

module.exports = router;
