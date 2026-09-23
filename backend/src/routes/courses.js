const express = require('express');
const Course = require('../models/Course');
require('../models/Lesson');
require('../models/Page');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find({ published: true })
      .populate({ path: 'lessons', populate: { path: 'pages' } })
      .lean();
    res.json({ courses });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
