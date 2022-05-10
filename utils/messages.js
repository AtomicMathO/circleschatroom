const moment = require("moment-timezone");

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().tz("Europe/Paris").format("HH:mm - DD/MM/YY"),
  };
}

module.exports = formatMessage;
