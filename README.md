<div align="center">
  <h1>Simple Load Test</h1>
<br>
<img src="https://user-images.githubusercontent.com/2382172/56094995-e49ece80-5e9d-11e9-8386-2fb8337804b1.png" width="600px" />

</div>

<br>

<p align="center">
A simplet API load test tool.
</p>


<hr>
<br>


## Install for production use

The latest release download for mac can be found here:
https://github.com/scottmcpherson/load-test/releases

## Install for local development

First, clone the repo via git:
The latest downloads for mac can be found here:
https://github.com/scottmcpherson/load-test/releases

```bash
git clone --depth 1 --single-branch --branch master https://github.com/scottmcpherson/load-test.git your-project-name
```

And then install the dependencies with yarn.

```bash
$ cd your-project-name
$ yarn
```

## Run for local development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
$ yarn dev
```

If you don't need autofocus when your files was changed, then run `dev` with env `START_MINIMIZED=true`:

```bash
$ START_MINIMIZED=true yarn dev
```

## Packaging

To package apps for the local platform:

```bash
$ yarn package
```

To package apps for all platforms:

First, refer to the [Multi Platform Build docs](https://www.electron.build/multi-platform-build) for dependencies.

Then,

```bash
$ yarn package-all
```

To package apps with options:

```bash
$ yarn package --[option]
```

To run End-to-End Test

```bash
$ yarn build-e2e
$ yarn test-e2e

# Running e2e tests in a minimized window
$ START_MINIMIZED=true yarn build-e2e
$ yarn test-e2e
```

:bulb: You can debug your production build with devtools by simply setting the `DEBUG_PROD` env variable:

```bash
DEBUG_PROD=true yarn package
```


## Maintainers

- [Scott McPherson](https://github.com/scottmcpherson)


## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

[npm-image]: https://img.shields.io/npm/v/electron-react-boilerplate.svg?style=flat-square
[github-tag-image]: https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg
[github-tag-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest
[travis-image]: https://travis-ci.com/electron-react-boilerplate/electron-react-boilerplate.svg?branch=master
[travis-url]: https://travis-ci.com/electron-react-boilerplate/electron-react-boilerplate
[appveyor-image]: https://ci.appveyor.com/api/projects/status/github/electron-react-boilerplate/electron-react-boilerplate?svg=true
[appveyor-url]: https://ci.appveyor.com/project/electron-react-boilerplate/electron-react-boilerplate/branch/master
[david_img]: https://img.shields.io/david/electron-react-boilerplate/electron-react-boilerplate.svg
[david_site]: https://david-dm.org/electron-react-boilerplate/electron-react-boilerplate
[david_img_dev]: https://david-dm.org/electron-react-boilerplate/electron-react-boilerplate/dev-status.svg
[david_site_dev]: https://david-dm.org/electron-react-boilerplate/electron-react-boilerplate?type=dev
