# pixijs-ts-boilerplate

Just another PixiJS Typescript Boilerplate

## Getting Started

Another boilerplate to speed up project setup for developing typescript apps with PixiJS.
Ready to compile code for dev and production env. 
Provides a helper class (PixiApp) to manage resizing (full size, keeping aspect ratio or no resize at all),
alignment of the stage within the canvas view, toggle [fullscreen](https://github.com/sindresorhus/screenfull.js/),
display some media info and a [fps-meter](https://github.com/darsain/fpsmeter).

Versions:
- [Typescript](https://www.typescriptlang.org/) 2.7.1
- [Webpack](https://webpack.js.org/) 3.10.0
- [PixiJS](http://www.pixijs.com/) 4.7.0


Note: Starting from v2 non-dev dependencies are kept inside the src/scripts/vendor folder (impl) and src/types (definitions). 
This means that those deps will have to be manually managed. Some companies do not really want to heavily rely on npm repos.
Let me know if this is a bad idea overall so I can revert the changes. Thanks!

### Included PixiJS plugins
- pixi-layers

### Prerequisites

Install Node & NPM from [here](https://www.npmjs.com/get-npm) or using [NVM](https://github.com/creationix/nvm)

### Installing

Choose one of the following options:

* Export the project with svn

```
svn export https://github.com/dacaher/pixijs-ts-boilerplate/trunk/
```

* Download it as [ZIP](https://github.com/dacaher/pixijs-ts-boilerplate/archive/master.zip)

* Clone the git repo — `git clone https://github.com/dacaher/pixijs-ts-boilerplate.git` and checkout the
[tagged release](https://github.com/dacaher/pixijs-ts-boilerplate/releases) you'd like to use.


Edit package.json to change project details.

Install NPM dependencies by running.

```
npm install
```
 
## Initial Steps

- Test it by running and browsing to [localhost:9000](http://localhost:9000/) 
```
npm run build && npm run serve
```
You should see a sample app with a fps-meter and a div containing some display info.

- See src/app for a showcase.
- Edit src/html/index.html, src/scripts/index.ts and src/styles/style.css as desired.
Index.ts is the entry point for bundling the application.
- Instantiate App with parameters width, height, align, resize and a canvas view container if desired.
- Optionally add/remove custom linter rules from tslint.json.
- Finally remove src/app/* and assets/gfx/* when not needed.

Note that pixi.js is kept as a external dependency and it is not bundled within the application.
Not really sure if I should bundle it as well.

## NPM scripts

- clean - [removes](https://github.com/isaacs/rimraf) dev, dist and doc dirs
- build - compiles and copy all the assets to dev dir
- build:release - compiles and [uglifies](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) to dist dir
- rebuild:all - cleans and rebuilds dev, dist and doc. 
- serve - serves (0.0.0.0:9000) dev dir with Hot Module Replacement enabled through [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- serve:release - serves (0.0.0.0:9999) dist dir through [http-server](https://github.com/indexzero/http-server) to test production bundle
- test - does nothing right now
- doc - generate app doc with [typedoc](http://typedoc.org/)

## Contributing

As a fairly new developer with Typescript (and javascript ecosystems in general) any suggestion, bug report or improvement submitted would be very much appreciated.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dacaher/pixijs-ts-boilerplate/tags). 

## Authors

* **David C.** - *Initial work* - [dacaher](https://github.com/dacaher)

See also the list of [contributors](https://github.com/dacaher/pixijs-ts-boilerplate/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.