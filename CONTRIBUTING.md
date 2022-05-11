# 👨💻 Helping Develop Pseudonaja

## Get Started

Ready to contribute? Here’s how to set up P_seudonaja_ for local development.

### Clone a Repo

First you must fork the repos relevant to what you plan to change. Then you must clone repos to your local machine in order to make changes.

#### Changes To The Editor

```bash
$ git clone git@github.com:PutYourUsernameHere/Codemirror-6-editor.git
```

#### Changes To The Website

```bash
$ git clone git@github.com:PutYourUsernameHere/website.git
```

#### Changes To The Docs

```bash
$ git clone git@github.com:PutYourUsernameHere/docs.git
```

### Create a Branch:

```bash
$ git checkout -b name-of-your-bugfix-or-feature
```

Now make your changes.

### Testing

While there are no automated tests set up, it is highly encouraged that you thoroughly test anything your changes may have effected.

To do this you will need to:

#### Roll Up the Editor Files to a Single File For Use on the Frontend

If your changes effect the editor or the website you will need to roll up the editor files for use on the website. The repo is already set up with a rollup configuration, so simply run:

```bash
$ npx rollup -c
```

#### Use the Rolled Up File on the Frontend

The repo is also already set up with a simple web server to serve the rolled up file. Simply run:

```bash
$ node server.js
```

Then all you need to do is have a webpage with the following in the body:

```html
<div id="editor"></div>
<script src="wherever your webserver is hosted"></script>
```

After those two steps, you should have a webpage with the editor on, on which you can test your changes.

### Commit and Push Changes:

Once you are sure your changes work and haven't broken anything, push them to your forked repo.

```bash
$ git add .
$ git commit -m "Your detailed description of your changes."
$ git push origin name-of-your-bugfix-or-feature
```

### Submit a Pull Request to the Relevant GitHub Repo

* [Editor](https://github.com/PseudocodeEditor/Codemirror-6-editor/pulls)
* [Website](https://github.com/PseudocodeEditor/website/pulls)
* [Documentation](https://github.com/PseudocodeEditor/docs/pulls)
