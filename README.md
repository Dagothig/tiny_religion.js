# tiny_religion.js
Javascript port of my [old Ludum Dare 23 game](http://ludumdare.com/compo/ludum-dare-23/?action=preview&uid=11227).

![GOD](https://raw.githubusercontent.com/Dagothig/tiny_religion.js/master/images/Facebook-Thumbnail.png)

## Playing
It's just a bunch of static files and an index.html.
Plop some http server in front of the root folder and you're done.

You can also start the app with `yarn app`.

Finally, there is a version running on my [server](http://tiny-religion.dagothig.com/), a [git page](https://dagothig.github.io/tiny_religion.js/) and a [version for Android](https://play.google.com/store/apps/details?id=com.dagothig.tinyreligion). Hopefully it will be on steam soon.

## What the blooming hell is this
It's just a small god-reversal-game about trying to please a god with mood swings. Overall the game really isn't very good at being self explanatory, but there is a bit of a tutorial thing.

## Technical overview
Rendering is done by pixi.js and it is the only library used by the client:

The whole thing's somewhat poorly structured but really it's a bunch of js files concatenated together with the html pointing on it.
There's a couple extensions and polyfills that are first defined and then the whole game is defined and finally the ui and the main files.
The game is defined as an extension on a pixi container and it's the same concept for all actors.
The main file defines save/loading, builds the base html (for the ui and game) and handles looping and resizing.
The ui is defined as a group of badly defined functions that build html elements.
The game itself handles scrolling and orchestrating the various actors. It also handles the island generation and cloud starts and ends.

## TODO

Sound files:
* End.mp3
* Achievements
