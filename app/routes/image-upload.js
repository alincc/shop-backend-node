import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const STATIC_URL = 'http://localhost:9000/static/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './public'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileIsAllowed = allowedExtensions.indexOf(ext) > -1; // eslint-disable-line no-unused-vars

    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
});

router.route('/')
  .get((req, res) => {
    res.json('Get not allowed');
  })
  .post(upload.single('file'), (req, res) => {
    const data = {
      filename: req.file.filename,
      path: `${STATIC_URL}${req.file.filename}`,
    };

    console.log(req.file);

    res.status(200).send({ message: 'Upload complete', data });
  });

export default router;
