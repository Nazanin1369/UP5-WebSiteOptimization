## Website Performance Optimization portfolio project

In order to run optimization tasks, use ** gulp optimize ** command in the project directory.
Then pen http://localhost:8080/ in your browser.

## Part 1: index.html

#### Psi Results

- Mobile : 94/100
- Desktop: 95/100

#### Changes applied
* using @fontface to optimize webfonts
* used **gulp-uglify** and **gulp-minify-css** to minify css and javascript files
* removed redundant css rules
* used **gulp-image-optimization** and **gulp-imagemin** for images optimization (reason to use two plugins was a bug in imagemin jpg images optimization)
* used **psi** and **ngrok** for measuring speed and acccessing localhost remotly.
* used **gulp-connect** for running the server.

## Part 2: pizza.html

#### Results

- Time to resize pizzas under 5s

#### Changes applied

* Leveraged browser caching by including _ <meta http-equiv="Cache-control" content="public">_ and .htaccess file
* Added a complete view port meta tag on _pizza.html_ page.
* Optimized main.js by removing the redundant calculation from updatePositions() and changePizzaSizes() functions.


