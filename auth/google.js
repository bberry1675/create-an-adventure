let passport = require('passport');
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let Users = require('../models/user')

passport.serializeUser((user,done) => {
    done(null,user._id);
})

passport.deserializeUser((mongo_id , done) => {
    Users.findById(mongo_id, (err, res) => {
        if(err){
            //TODO: case where we could not perform a lookup on the _id of the mongo doc
        }
        if(res){
            done(null,res);
        }
        
    });
})


passport.use(new GoogleStrategy({
    clientID: '165785476963-be992oqmajruoa9mfa35jfabdq8r4cfa.apps.googleusercontent.com',
    clientSecret: 'wGQV6OcHL9pDzpJMM2Mzxw4d',
    callbackURL: '/auth/google/callback'
},(accessToken, refreshToken, profile, done) => {
    console.log(profile);
    Users.findOne({googleid: profile.id},(err, userDoc) => {
        if(err){
            //TODO: impelement the error case for finding if a user exists
        }

        //case where the user doc exists
        if(userDoc){
            done(null, userDoc)
        }
        //case where the user doc doesn't exist
        else{
            let newUser = new Users({
                googleid: profile.id,
                username: profile.displayName
            })

            newUser.save((err, product) => {
                if(err){
                    //TODO: implement the case where the docuemnt could not save
                }

                if(product){
                    done(null,product);
                }
            })
        }
    })
}))