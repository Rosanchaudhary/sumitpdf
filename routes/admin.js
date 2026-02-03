const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const adminController = require("../controllers/adminController.js");
const auth = require("../middlewares/auth.js");
const adminOnly = require("../middlewares/adminOnly.js");

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
router.get("/", auth, adminOnly, adminController.getDashboard);

// Engineering Degree Routes
router.get("/degrees", auth, adminOnly, adminController.getDegrees);
router.get("/degrees/new", auth, adminOnly, adminController.getNewDegree);
router.post("/degrees", auth, adminOnly, adminController.createDegree);
router.get("/degrees/:id/edit", auth, adminOnly, adminController.getEditDegree);
router.post("/degrees/:id/edit", auth, adminOnly, adminController.updateDegree);
router.post(
  "/degrees/:id/delete",
  auth,
  adminOnly,
  adminController.deleteDegree,
);

// Semester Routes
router.get(
  "/degrees/:degreeId/semesters",
  auth,
  adminOnly,
  adminController.getSemesters,
);
router.get(
  "/degrees/:degreeId/semesters/new",
  auth,
  adminOnly,
  adminController.getNewSemester,
);
router.post(
  "/degrees/:degreeId/semesters",
  auth,
  adminOnly,
  adminController.createSemester,
);
router.get(
  "/semesters/:id/edit",
  auth,
  adminOnly,
  adminController.getEditSemester,
);
router.post(
  "/semesters/:id/edit",
  auth,
  adminOnly,
  adminController.updateSemester,
);
router.post(
  "/semesters/:id/delete",
  auth,
  adminOnly,
  adminController.deleteSemester,
);

// Subject Routes
router.get(
  "/semesters/:semesterId/subjects",
  auth,
  adminOnly,
  adminController.getSubjects,
);
router.get(
  "/semesters/:semesterId/subjects/new",
  auth,
  adminOnly,
  adminController.getNewSubject,
);
router.post(
  "/semesters/:semesterId/subjects",
  auth,
  adminOnly,
  adminController.createSubject,
);
router.get(
  "/subjects/:id/edit",
  auth,
  adminOnly,
  adminController.getEditSubject,
);
router.post(
  "/subjects/:id/edit",
  auth,
  adminOnly,
  adminController.updateSubject,
);
router.post(
  "/subjects/:id/delete",
  auth,
  adminOnly,
  adminController.deleteSubject,
);

// Note Routes
router.get(
  "/subjects/:subjectId/notes",
  auth,
  adminOnly,
  adminController.getNotes,
);
router.get(
  "/subjects/:subjectId/notes/new",
  auth,
  adminOnly,
  adminController.getNewNote,
);
router.post(
  "/subjects/:subjectId/notes",
  upload.single("pdfFile"),
  auth,
  adminOnly,
  adminController.createNote,
);
router.get("/notes/:id/edit", auth, adminOnly, adminController.getEditNote);
router.post(
  "/notes/:id/edit",
  upload.single("pdfFile"),
  auth,
  adminOnly,
  adminController.updateNote,
);
router.post("/notes/:id/delete", auth, adminOnly, adminController.deleteNote);

module.exports = router;
