/**
 * Module dependencies.
 */
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as lusca from "lusca";
import * as dotenv from "dotenv";
import * as mongo from "connect-mongo";
import * as flash from "express-flash";
import * as path from "path";
import * as mongoose from "mongoose";
import * as passport from "passport";
import expressValidator = require("express-validator");
import * as multer from 'multer';

import { EventEmitter } from 'events';
import * as zlib from 'zlib';
import * as fs from 'fs';
import * as dns from 'dns';
import * as http from 'http';




/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env.example" });


/**
 * Controllers (route handlers).
 */
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";

/**
 * API keys and Passport configuration.
 */
import * as passportConfig from "./config/passport";

import * as mysql from "mysql";

const connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '123456',
	port: 3310,
	database: 'bwh1-express',
});


/**
 * Create Express server.
 */
const app = express();



/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

// mongoose.connection.on("error", () => {
//   console.log("MongoDB connection error. Please make sure MongoDB is running.");
//   process.exit();
// });



/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
// app.set("view engine", "pug");
// app.use(compression());
// app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());
// app.use(session({

//   resave: true,
//   saveUninitialized: true,
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({
//     url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
//     autoReconnect: true
//   })
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
// app.use(lusca.xframe("SAMEORIGIN"));
// app.use(lusca.xssProtection(true));
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });
// app.use((req, res, next) => {
//   // After successful login, redirect back to the intended page
//   if (!req.user &&
//       req.path !== "/login" &&
//       req.path !== "/signup" &&
//       !req.path.match(/^\/auth/) &&
//       !req.path.match(/\./)) {
//     req.session.returnTo = req.path;
//   } else if (req.user &&
//       req.path == "/account") {
//     req.session.returnTo = req.path;
//   }
//   next();
// });

const a = Buffer.alloc(10);
const b = Buffer.from([1,2,3]);
const c = a.compare(b);
a.write('abc');

app.use('/static', express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));
app.use('/static', express.static(path.join(__dirname, "../uploads"), { maxAge: 31557600000 }));
app.get('/', (req, res, next) => {
	const sql = 'SELECT * FROM jh_holiday_logs';

	connection.query(sql, (error, result) => {
		if (error) {
			res.json(200, { status: 1, message: error });
			return console.log(error);
		}
		res.json(200, { status: 0, result })
	});
});
app.get('/database/:name', (req, res) => {
	const {
		name,
	} = req.params;
	const sql = `CREATE DATABASE ${name}`;
	connection.query(sql, (error, results) => {
		if (error) {
			return res.json(200, {
				status: 1,
				message: error,
			});
		}
		res.json(200, {
			status: 1,
			message: results
		});
	});
});

app.get('/table/:name', (req, res) => {
	const {
		name,
	} = req.params;
	const sql = `
		CREATE TABLE \`${name}\` (
			\`id\` int(11) NOT NULL AUTO_INCREMENT COMMENT '员工信息表',
			\`name\` varchar(50) DEFAULT NULL COMMENT '姓名',
			\`annual_holiday\` decimal(10,2) DEFAULT '0.00' COMMENT '年假时间',
			\`tone_rests\` decimal(10,2) DEFAULT '0.00' COMMENT '调休时间',
			\`remark\` varchar(255) DEFAULT NULL COMMENT '备注',
			PRIMARY KEY (\`id\`)
		) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;
	`;
	connection.query(sql, (error, results) => {
		if (error) {
			return res.json(200, {
				status: 1,
				message: error,
			});
		}
		res.json(200, {
			status: 1,
			message: results
		});
	});
});



app.get('/upload', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../views/_temp/upload.html'));
}).post('/upload', (req, res, next) => {
	const upload = multer({ dest: '_temp/_uploads' });
	upload.single('file')(req, res, (error) => {
		if (error) {
			res.json(200, {
				status: 1,
				message: error
			});
			return console.log(error);
		}
		next();
	});
}, (req, res) => {
	const {
		originalname,
		path,
	} = req.file;
	fs.readFile(path, (error, data) => {
		if (error) {
			return console.log(error);
		}
		const fileName = `${Date.now()}${originalname}`
		const filePath = `uploads/${fileName}`;
		fs.writeFile(filePath, data, (error) => {
			if (error) {
				return console.log(error);
			}
			res.json(200, { status: 0, message: 'success', url: `http://127.0.0.1:3000/static/${fileName}` });
		})
	})

});
// /**
//  * Primary app routes.
//  */
// app.get("/", homeController.index);
// app.get("/login", userController.getLogin);
// app.post("/login", userController.postLogin);
// app.get("/logout", userController.logout);
// app.get("/forgot", userController.getForgot);
// app.post("/forgot", userController.postForgot);
// app.get("/reset/:token", userController.getReset);
// app.post("/reset/:token", userController.postReset);
// app.get("/signup", userController.getSignup);
// app.post("/signup", userController.postSignup);
// app.get("/contact", contactController.getContact);
// app.post("/contact", contactController.postContact);
// app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
// app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
// app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
// app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
// app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

// /**
//  * API examples routes.
//  */
// app.get("/api", apiController.getApi);
// app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

// /**
//  * OAuth authentication routes. (Sign in)
//  */
// app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
// app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
//   res.redirect(req.session.returnTo || "/");
// });


/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
	console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
	console.log("  Press CTRL-C to stop\n");
});

module.exports = app;