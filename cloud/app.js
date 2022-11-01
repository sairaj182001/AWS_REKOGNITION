const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path")

const multer = require("multer")
const { storage, generateParams, rekognition } = require("./aws")
const upload = multer({ storage })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.post("/upload-file", upload.single("image"), async (req, res) => {
    const { key, location, originalname } = req.file
    try {
        const params = generateParams(key)
        rekognition.detectFaces(params, async (err, data) => {
            if (err) console.log(err)
            else res.status(200).json({ message: "Done", report: { ...data.FaceDetails[0], location, originalname } })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "Client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "Client", "build", "index.html"));
    })
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})