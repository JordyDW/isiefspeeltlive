var express = require('express');
var router = express.Router();
var axios = require('axios');

var client_id = process.env.TWITCH_CLIENT_ID;
var client_secret = process.env.TWITCH_CLIENT_SECRET;
var access_token = '';

var name = 'ief_speelt';

/* GET home page. */
router.get('/', async function (req, res, next) {
  access_token = await getAccessToken();

  var stream = await getStream(name);
  var user = await getUser(name);

  res.render('index', { user, stream });
});

async function getAccessToken () {
  var res = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`, null);
  return res.data.access_token;
}

async function getStream (channel_name) {
  try {
    var res = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channel_name}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': client_id
      }
    });

    return res.data !== [] ? res.data.data[0] : null;
  } catch (e) {
    console.error(e);
  }
}

async function getUser (name) {
  try {
    var res = await axios.get(`https://api.twitch.tv/helix/users?login=${name}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': client_id
      }
    });
    return res.data.data[0];
  } catch (e) {
    console.error(e);
  }
}

module.exports = router;
