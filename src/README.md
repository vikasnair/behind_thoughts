# Behind Thoughts

## Overview

For the writer stuck in a long block. For the student [...]. For the [...]. For anyone stuck in a rut. Behind Thoughts is an online, crowd-sourced set of strategies to help get through mental blocks. Dedicated to the 'Oblique Strategies' card-deck by Brian Eno and Peter Schmidt.

Behind Thoughts allows users to view randomized or sorted strategies. Registered users can additionally submit and vote on strategies.

## Data Model

The application will store users and strategies.

* users will have basic properties (name, auth details, etc.)
* strategies will have basic properties (title, votes, etc.) and a reference to the author (a user id)

User:

```javascript
{
  username: 'john_smith',
  email: 'john@smith.com',
  hash: // a password hash,
  id: // a unique identifier
}
```

Strategy:

```javascript
{
  title: 'Try faking it!',
  votes: 20,
  author: // a reference to a user,
  createdAt: 4-2-2018
}
```


## [Link to Commented First Draft Schema](db.js)

## Wireframes

index (/) - sortable list view of all strategies

![index](../documentation/index.png)

strategy-detail (/strategy/:id) - page for showing large-view detail of one strategy

![strategy-detail](../documentation/strategy-detail.png)

add-strategy (/add) - page for submitting a new strategy

![add-strategy](../documentation/add-strategy.png)

login (/login) - page for logging in previous user

![login](../documentation/login.png)

register (/register) - page for registering new user

![register](../documentation/register.png)

## Site map

(___TODO__: draw out a site map that shows how pages are related to each other_)

// Home: Index
Header links to self, add-strategy, login, register
Each strategy in list links to strategy-detail.

## User Stories or Use Cases

1. as non-registered user, I can view randomized or sorted strategies
2. as non-registered user, I can register a new account with the site
3. as a user, I can log in to the site
4. as a user, I can submit a unique strategy
5. as a user, I can vote on posted strategies

## Research Topics

* (5 points) Integrate user authentication
  * I'm going to be using passport for user authentication
  * And account has been made for testing; I'll email you the password
  * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
  * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
  * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
  * if you put in a number that's greater than 5, an error message will appear in the dom
* (2 points) Integrate ESLint / JSHint / JSLint into your workflow
  * Must be used with build tool (see above requirement on Grunt or Gulp
  * Must have have configuration file in repository
  * Must run on entire codebase outside of node_modules automatically on file change (watch for changes to the file system)
  * Must link to relevant lines in build configuration and lint configuration
  * Must show screen capture / animated gif of running on save

11 points total out of 8 required points

## [Link to Initial Main Project File](app.js) 

## Annotations / References Used

1. [oblique strategies](https://en.wikipedia.org/wiki/Oblique_Strategies)
2. [passport.js authentication docs](http://passportjs.org/docs)
