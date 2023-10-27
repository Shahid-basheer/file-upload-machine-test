const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");
const multer = require("multer");
const fileControllers = require("../controllers/fileControllers");
const authControllers = require("../controllers/authControllers");
const upload = multer({
    storage: multer.memoryStorage(), fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg"
            || file.mimetype == "video/mp4" || file.mimetype == "application/pdf" || file.mimetype == "audio/mpeg"
        ) {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error("jpeg,png,jpg and video/mp4, pdf,audio/mpeg  are allowed"))
        }
    }, limits: { fileSize: 1000 * 1000 }
})

router.post("/upload", middleware.authRequire, upload.array("files", 5), fileControllers.uploadFile)
router.get("/getFiles", middleware.authRequire, fileControllers.getFiles)
router.delete("/deleteFiles", middleware.authRequire, fileControllers.deleteFiles)
router.post("/login", authControllers.login)
router.post("/register", authControllers.register)

module.exports = router