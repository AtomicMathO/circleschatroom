const chatDatamapper = require("../datamapper/chatDatamapper");

const controllerChat = {

    homepage (req,res){
        res.render('view')
    },

    chatPage (req,res){
        res.render('chat')
    },

    async addAMessage (req, res){
        console.log(req.body)
        // const content = req.body.content;
        // const circleCode = req.body.circleCode;
        // const userId = req.body.userId ;
    
        // console.log(messageCircle);
        // const addMessageCircle = await chatDatamapper.addMessageInCircle(content, circleCode, userId)
        // res.render ('chat');
    }
}


module.exports = controllerChat