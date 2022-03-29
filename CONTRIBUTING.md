# Get Started

Ready to contribute? Here’s how to set up *pseudonaja* for local development.

Fork the pseudonaja repo on GitHub.

Clone your fork locally:

```Bash
$ git clone git@github.com:your_name_here/pseudonaja.git
```

Install your local copy into a virtualenv. Assuming you have virtualenvwrapper installed, this is how you set up your fork for local development:

```Bash
$ mkvirtualenv pseudonaja
$ cd pseudonaja/
$ python [setup.py](http://setup.py) develop
```

Create a branch for local development:

```Bash
$ git checkout -b name-of-your-bugfix-or-feature
```

Now you can make your changes locally.

When you’re done making changes, check that your changes pass flake8 and the tests, including testing other Python versions with tox:

```Bash
$ flake8 pseudonaja tests
$ python [setup.py](http://setup.py) test or pytest
$ tox
```

To get flake8 and tox, just pip install them into your virtualenv.

Commit your changes and push your branch to GitHub:

```Bash
$ git add .
$ git commit -m "Your detailed description of your changes."
$ git push origin name-of-your-bugfix-or-feature
```

Submit a pull request through the GitHub website.

## Pull Request Guidelines

Before you submit a pull request, check that it meets these guidelines:

1. The pull request should include tests.
2. If the pull request adds functionality, the docs should be updated. Put your new functionality into a function with a docstring, and add the feature to the list in README.rst.
3. The pull request should work for Python 3.5, 3.6, 3.7 and 3.8, and for PyPy. Check [https://travis-ci.com/dsoon/pseudonaja/pull_requests](https://travis-ci.com/dsoon/pseudonaja/pull_requests) and make sure that the tests pass for all supported Python versions.

## Tips

To run a subset of tests:

```Bash
$ python -m unittest tests.test_pseudonaja
```

## Deploying

A reminder for the maintainers on how to deploy. Make sure all your changes are committed (including an entry in HISTORY.rst). Then run:

```Bash
$ bump2version patch # possible: major / minor / patch
$ git push
$ git push --tags
```

Travis will then deploy to PyPI if tests pass.

