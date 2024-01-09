import express from "express";
import passport from 'passport';
import session from 'express-session';
import * as crypto from "crypto";
import {Strategy as LocalStrategy} from 'passport-local';
import * as mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/").catch(err => {
	console.log(err);
	process.exit(1);
})

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	salt: String
});

const User = mongoose.model("User", UserSchema);



// setup local strategy with mongoose
passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, function (username, password, done) {
	User.findOne({username}, {}, null)
		.then(user => {
			if (!user) {
				return done(null, false);
			}

			const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');

			if (hash !== user.password) {
				return done(null, false);
			}

			return done(null, user);
		})
		.catch(err => {
			console.log(err);
			return done(err);
		});
}));

app.use(session({
	secret: 'masterful stroke of pineapples onboard a walking turbine calmer',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: true}
}));

app.use(passport.initialize())
app.use(passport.session(null));

app.use(express.static("src"));


passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.post('/login', function (req, res, next) {
	passport.authenticate("local", function (err, user) {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.redirect('/login');
		}

		req.login(user, next);
	})(req, res, next);
});


app.post('/register', function (req, res, next) {
	const {username, password} = req.body;
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	const user = new User({username, password: hash, salt});

	user.save()
		.then(() => {
			res.send("User registered successfully");
		})
		.catch(err => {
			console.log(err);
			res.status(500).send("Error registering user");
		});
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
})