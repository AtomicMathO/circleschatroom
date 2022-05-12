const express = require("express");
const controllerChat = require('./controller/controllerChat');

const router = express.Router();

//Route
router.get('/',controllerChat.homepage);

router.get('/chat', controllerChat.chatPage);


module.exports = router;