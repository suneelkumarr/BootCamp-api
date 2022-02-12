const express = require('express')
const router = require('express').Router({mergeParams:true});
const User = require('../models/User');
const {getUsers, createUser } = require('../controller/users')
const advancedResults = require('../middleware/filtering')
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("admin"));


router.route('/')
.get(advancedResults(User), getUsers)
.post(createUser);



module.exports = router;