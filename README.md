# UFSIT Portal

The University of Florida Student InfoSec Team (UF SIT) provides a members only portal for club-related materials.
This includes event signin, user profiles, resume uploading, lecture materials, and CTF writeups.

## Setting up a Development Environment

The UFSIT Portal uses a recent version of Node.js with Express that supports newer ES8 (aka ES2017),
MySQL for data persistence, and Heroku for application deployment. AngularJS
1.X is used for our front-end (the portal is a single-page webapp) along with
bootstrap for CSS styling.

### Downloading the app and installing dependencies

If you are a member of UFSIT with the correct access rights, you can work directly on this repository.
Otherwise, you will need to make a fork of this repository, clone that, and provide any changes via Pull Requests.
The following steps assume you are a member of the UFSIT organization.

First clone the repository and install the dependencies with NPM:

```
$ git clone https://github.com/ufsit/ufInfoSec_webapp.git
$ cd ufInfoSec_webapp/
$ npm install
```

When running the application, you will need root access to a local MySQL database for testing.
If you are on Mac OSX and you use homebrew, you can install this easily:

```
$ brew install mysql
$ mysql.server start # this will need to be started on reboot
```

If you are on a Linux system, install MySQL using your preferred package manager.
If you are on Windows, install MySQL directly from an official website installer.
No particular version of MySQL is required (in fact we are actually using MariaDB in Heroku) as we are using the bare minimum of SQL features.

### Importing the database

If you have just installed a blank database, you will need to populate it with the latest site schema
or with an existing database dump. For now, the only supported method of running the site is with
a production database dump. If you need access to this, message one of the admins on the UFCISE slack.

### Booting the webapp

Assuming an installed and working database, we must create a credentials file to tell the webapp how
to communicate with the database. Here is an example file 

```json
{
    "db":{
        "host":"localhost",
        "username":"root",
        "password":"",
        "port":3306,
        "database":"ufsit_portal"
    }
}
```
Create this file in the same directory as `app.js` and name it `credentials.json`.
Note that this provided file assumes you are using the default `root` user without a password and with a database
name of `ufsit_portal`. This may be different depending on your MySQL setup.

With this file, you can run the node application using:

```
node app.js
```

Or with NPM like:

```
npm start
```

If you have multiple database credentials files (e.g. one for development and another for production), you can
explicitly pass the filename in an environment variable:

```shell
CREDENTIALS=credentials.json node app.js
```

Where the `CREDENTIALS` environment variable points to the details about the database you are connecting to.
This variable can be exported or passed on the command line right before the start command.

If this environment variable is not included, the application will fallback to a file named `credentials.json` or a
Heroku specific environment variable for our JawsDB plan. The JawsDB
variable _only_ exists when running in the Heroku cloud, so the webapp will
error out if it was not able to find valid credentials for the database.

## Starting Development

With the webapp running locally, you can visit http://localhost:8080 in your web browser.
Here you can modify any file on both the server-side and client side. It is **strongly recommended**
that you use [nodemon](https://github.com/remy/nodemon) to automatically restart the node
process when a server file is changed. This will save you from development headaches.

To install nodemon, run `npm install -g nodemon`. This will place it in your PATH. From now on,
you may run `nodemon app.js` instead of `node app.js` or `npm start`.

### Code Map
The top-level file is `app.js`. This configures Express the site in general. The API directory has the actual routes along with the DB-related helper functions in the `db/` directory. Knowledge of Express should not extend down to the DB directory and should only be handled at the top-level route declarations.

For the front end, the `html/` directory has all of the Angular-based HTML, `css/` all of the stylesheets, `scripts/controller/` all of the NG controllers, `images/` all of the images, and `routes/config.js` the top-level single-page application routing configuration.

```
├── API/
│   ├── README.md
│   ├── admin.js
│   ├── anonymous.js
│   ├── db/
│   │   ├── account_mgmt.js
│   │   ├── admin.js
│   │   ├── db_mgmt.js
│   │   └── event_mgmt.js
│   ├── event.js
│   ├── index.js
│   ├── session.js
│   └── user.js
├── app.js
├── css/
│   ├── bootstrap.css
│   └── ...
├── data/
│   └── schema.sql
├── html/
│   ├── index.html
│   ├── login.html
│   ├── ...
│   └── views/
│       ├── header.html
│       ├── home.html
│       └── ...
├── images/
│   └── ...
├── package.json
├── routes/
│   └── config.js
├── scripts/
│   └── controllers/
│       ├── AdminController.js
│       ├── LoginController.js
│       └── ...
├── services/
│   └── Validate.js
└── util/
    └── index.js
```

### Relevant Documentation
* AngularJS 1.x - https://docs.angularjs.org/guide
* Node.js Express - https://expressjs.com/en/4x/api.html
* Node.sj 9.3.x - https://nodejs.org/dist/latest-v9.x/docs/api/
* MySQL for Node.js - https://www.npmjs.com/package/mysql

### Development Guidelines

* **DO**: use tabs for indentation
* **DO**: use `eslint` to check your code for common style errors and other runtime issues
* **DO**: declare all API endpoints and their substantial subfunctions as `async` and `await` on them 

## Deploying the Site

We are currently hosting the site on Heroku. Heroku is a SaaS platform and it
allows us to just focus on the code instead of setting up a box to run our app.

Before you can deploy, you must have the Heroku CLI application and a git remote
setup for our specific Heroku dyno. Read [Deploying with Git](https://devcenter.heroku.com/articles/git)
in its entirety before continuing.

With the proper Heroku remote in place, deploying the site is as simple as:

```
git push heroku master
```

Don't deploy code that isn't synced with Github (i.e. `git push` all of your
changes before deploying and NEVER deploy a branch other than master).  If you
run into issues deploying, such as your local master being behind the Heroku
remote, then contact the other developers.

### Deployment Checklist
- Is your local master branch is completely in sync with the origin master branch?
- Have you tested all the new changes that are about to land on the _production_ site?
- Have you notified other people working on the site that you are about to deploy?
- Are you aware of how to view logs to diagnose an error in the site?
- Are you prepared to quickly rollback changes if something goes wrong?
