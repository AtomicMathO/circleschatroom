const client = require('../config/database');



const chatDatamapper = {
    async addMessageInCircle(content, circleCode, userId){
        const query = {
            text : `INSERT INTO "message"(content,user_id,circle_id)
                    VALUES ($1,$2,$3) `,
            values : [content, circleCode, userId ]
        }
        const addMessage = await client.query(query);
    }
};

module.exports = chatDatamapper