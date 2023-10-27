const firebaseConfig = require("../config/firebase")
const firebase = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage")
const { getAuth } = require("firebase/auth")
const Files = require("../models/files");
const app = firebase.initializeApp(firebaseConfig)
const auth = getAuth(app);
const storage = getStorage()

module.exports = {
    auth,
    uploadFile: async (req, res) => {

        async function uploadMultipleFiles(files) {
            const uploadedFiles = [];

            for (const file of files) {
                const filesName = `files/${file.originalname + Date.now()}`
                const storageRef = ref(storage, filesName);

                const metadata = {
                    contentType: file.mimetype,
                };
                const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Handle progress changes
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload progress for ${file.originalname}: ${progress}%`);
                    },
                    (error) => {
                        console.error(`Error uploading ${file.originalname}:`, error);
                    },
                    () => {
                        // Upload is complete, get the download URL
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                uploadedFiles.push({ filename: filesName, url: downloadURL, user: req.userId });
                                if (uploadedFiles.length == files.length) {
                                    Files.insertMany(uploadedFiles).then(() => {
                                        res.status(200).send(uploadedFiles)
                                    }).catch((err) => {
                                        res.status(500).json(err)
                                    })
                                }
                            })
                            .catch((error) => {
                                console.error(`Error getting download URL for ${filesName}:`, error);
                            });
                    }
                );
            }

            return uploadedFiles;
        }

        // Assuming req.files is an array of files to upload
        const filesToUpload = req.files;
        if (!filesToUpload) return res.status(500).json("File's required")
        uploadMultipleFiles(filesToUpload)
    },
    getFiles: async (req, res) => {
        const files = await Files.find({ user: req.userId }, { filename: 1, url: 1, _id: 1 });
        res.status(200).json({ files })
    },
    deleteFiles: async (req, res) => {
        if (!req.query.filename) return res.status(500).json("Provide filename")
        const storageRef = ref(storage, req.query.filename);
        deleteObject(storageRef).then(async () => {
            await Files.deleteOne({ user: req.userId, filename: req.query.filename })
            res.status(200).json("Deleted Successfull")
        })
            .catch(err => res.status(500).json(err))
    }
}