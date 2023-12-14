# 👨💻 Helping Develop Pseudonaja

## Get Started

Ready to contribute? Here’s how to set up _Pseudonaja_ for local development.

### Clone a Repo

First you must fork the repo relevant to what you plan to change. Then you must clone the repo to your local machine in order to make changes.

#### Changes To The Editor

```bash
$ git clone git@github.com:PutYourUsernameHere/editor.git
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

&#x20;If your changes effect the codemirror files, you will need to roll up the editor files to a single file for use in the browser. The repo is already set up with a rollup configuration, so simply run:

```bash
$ npx rollup -c
```

Then just serve the project directory. An easy way to do this, if you have python installed, is the following:

```bash
$ python3 -m http.server 8080
```

### Commit and Push Changes:

Once you are sure your changes work and haven't broken anything, push them to your forked repo.

```bash
$ git add .
$ git commit -m "Your detailed description of your changes."
$ git push origin name-of-your-bugfix-or-feature
```

### Submit a Pull Request to the Relevant GitHub Repo

* [Editor](https://github.com/PseudocodeEditor/editor/pulls)
* [Documentation](https://github.com/PseudocodeEditor/docs/pulls)
