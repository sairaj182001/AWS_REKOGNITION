const aws = require("aws-sdk")
const multerS3 = require("multer-s3")

aws.config.update({
    secretAccessKey: process.env.ACCESSKEY,
    accessKeyId: process.env.ACCESSKEYID,
    region: process.env.REGION
})

const rekognition = new aws.Rekognition()

const generateParams = (name) => {
    return {
        Image: {
            S3Object: {
                Bucket: "cloud-s3-rek",
                Name: `${name}`
            }
        },
        Attributes: ["ALL"]
    }
}

const s3 = new aws.S3()
const storage = multerS3({
    s3,
    acl: "public-read",
    bucket: "cloud-s3-rek",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",
    key: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

module.exports = { storage, s3, rekognition, generateParams }