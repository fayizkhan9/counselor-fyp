const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const {Video} = require('../../models/Video');
const VideosComments = require('../../models/VideosComments');
const {Like} = require('../../models/Like');
const {Dislike} = require('../../models/Dislike');
const {Subscriber} = require('../../models/Subscriber');


// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'profileImg']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);

  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  auth,
  check('status', 'Status is required').notEmpty(),
  check('skills', 'Skills is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      ...rest
    } = req.body;

    const profileFields = {
      user: req.user.id,
      website:
        website && website !== ''
          ? normalize(website, { forceHttps: true })
          : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => ' ' + skill.trim()),
      ...rest
    };

    const socialFields = { youtube, twitter, instagram, linkedin, facebook };

    // normalize social fields to ensure valid url
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialFields;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    }
    catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);


// @route    GET api/profile
// @desc     Get all profiles
// @access   Public

router.get('/allProfiles', async (req, res) => {
  try {

    const users = await User.find({ userType: 'counselor' });

    var profiles = [];

    for (i = 0; i < users.length; i++) {
      var profile = await Profile.find({ user: users[i]._id }).populate('user', ['name', 'profileImg']);
      profiles[i] = profile[0];
    }

    res.json(profiles);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route    GET api/profile/search/
// @desc     Search Profiles
// @access   Private

router.post('/search', auth, async (req, res) => {
  try {

    const { text } = req.body;

    const users = await User.find({ name: {'$regex' : text, '$options' : 'i'}});

    var profiles = [];

    for (i = 0; i < users.length; i++) {
      var profile = await Profile.find({ user: users[i]._id }).populate('user', ['name', 'profileImg']);
      profiles[i] = profile[0];
    }

    res.json(profiles);

  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

router.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  async ({ params: { user_id } }, res) => {
    try {
      const profile = await Profile.findOne({ user: user_id }).populate('user', ['name', 'profileImg']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profile);

    }
    catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);




// @route    DELETE api/profile
// @desc     Delete profile, user & posts, and Videos
// @access   Private

router.delete('/', auth, async (req, res) => {
  try {
    await Promise.all([
      Post.deleteMany({ user: req.user.id }),
      Profile.findOneAndRemove({ user: req.user.id }),
      User.findOneAndRemove({ _id: req.user.id }),
      Video.deleteMany({ user: req.user.id}),
      VideosComments.deleteMany({ user: req.user.id}),
      Like.deleteMany({ userId: req.user.id}),
      Dislike.deleteMany({ userId: req.user.id}),
      Subscriber.deleteMany({userFrom: req.user.id})
    ]);

    res.json({ msg: 'User deleted' });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private

router.put(
  '/experience',
  auth,
  check('title', 'Title is required').notEmpty(),
  check('company', 'Company is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(req.body);

      await profile.save();

      res.json(profile);
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});




// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private

router.put(
  '/education',
  auth,
  check('school', 'School is required').notEmpty(),
  check('degree', 'Degree is required').notEmpty(),
  check('fieldofstudy', 'Field of study is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(req.body);

      await profile.save();

      res.json(profile);
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);




// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );
    await foundProfile.save();
    return res.status(200).json(foundProfile);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});


// @route    PUT api/profile/session
// @desc     Add session to profile
// @access   Private

router.put(
  '/session',
  auth,
  check('title', 'Title is required').notEmpty(),
  check('date', 'Date Time is required'),
  check('fromTime', 'From Time is required'),
  check('toTime', 'To Time is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.session.unshift(req.body);

      await profile.save();

      res.json(profile);
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route    DELETE api/profile/session/:sess_id
// @desc     Delete session from profile
// @access   Private

router.delete('/session/:sess_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.session = foundProfile.session.filter(
      (sess) => sess._id.toString() !== req.params.sess_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;


