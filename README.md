## Website Performance Optimization portfolio project

In order to run optimization tasks, use **gulp optimize** command in the project directory.
Then pen http://localhost:8080/ in your browser.

## Part 1: index.html

#### Psi Results

- Mobile : 94/100
- Desktop: 95/100

#### Changes applied
* used @fontface to optimize webfonts
* used **async** property for non-critical script to prevert blocking the page rendering.
* **Deferred loading the style.css** file tp pace the page rendering
* removed remote sources for images and made them **local** in index.html
* used **gulp-uglify** and **gulp-minify-css** to minify css and javascript files
* removed redundant css rules
* used **jshint-gulp** as JS linting
* used **gulp-image-optimization** and **gulp-imagemin** for images optimization (reason to use two plugins was a bug in imagemin jpg images optimization)
* used **psi** and **ngrok** for measuring speed and acccessing localhost remotly.
* used **gulp-connect** for running the server.

## Part 2: pizza.html

The pizza.html webpage was rendering at < 30fps for scrolling. Also, resizing the pizza on the slider took an average of > 200 ms.

#### Results

- Time to resize pizzas under 5ms from 200ms

#### Changes applied

* Leveraged browser caching by including _ <meta http-equiv="Cache-control" content="public">_ and .htaccess file
* Added a complete view port meta tag on _pizza.html_ page.
* Optimized main.js by removing the calculation from inside the loop in updatePositions() and changePizzaSizes() functions.


