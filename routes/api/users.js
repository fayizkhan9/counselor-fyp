const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

const mongoose = require('mongoose')

// Save Profile images
var multer = require('multer');
var path = require('path');

// @route    POST api/users
// @desc     Register user
// @access   Public

var storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post(
  '/',
  upload.single('image')
  ,
  check('name', 'Name is required').notEmpty(),
  check('email', 'Enter Valid Email Address').isEmail(),
  check(
    'password',
    'Password Must Be 6 Characters Long.'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phNo, password, userType } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name: name,
        email: email,
        phNo: phNo,
        password: password,
        userType: userType,
        profileImg: req.file.path
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


router.post('/user/', async (req, res) => {
  const { _id } = req.body;
  const user = await User.findOne({ _id: _id });

  res.send(user.profileImg)
})
module.exports = router;
