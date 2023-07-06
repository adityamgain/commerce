const LocalStrategy = require('passport-local');
const passport = require('passport');
const { User } = require('./models/user')

exports.initializingPassport =(passport)=>{

    passport.use(new LocalStrategy(async(email, password, done) =>{

        try{
            const user=await User.findOne({email: email});
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (user.password!==password) { return done(null, false); }
            return done(null, user);
        }
        catch(error){
            return done(error, false);
        }
        }
      ));

      passport.serializeUser((user,done)=>{
          done(null,user.id);
      });

      passport.deserializeUser(async (id,done)=>{
          try{
              const user= await User.findOne({where: { id: id}});
              done(null,user);
          }catch(error){
              done(error,false);
          }
      })
};

exports.isAuthenticated = (req,res,next)=>{
    if(req.user) return next();
    res.redire('/login');
}