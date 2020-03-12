let passport = require('passport')
let express = require('express')
require('../auth/google')

let router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/callback', passport.authenticate('google'), (req,res) => {

    if(req.session && req.session.current_node){
        res.redirect('/node/' + req.session.current_node);
    }
    else{
        res.redirect('/node/' + req.app.settings.starting_id);
    }
});

router.get('/google/logout', (req,res) => {
    req.logout();
    res.redirect(req.headers.referer);
})


module.exports = router;