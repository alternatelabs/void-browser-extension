# Void browser extension

> Browser extension and bookmarklet app for [Void](https://voidapp.co)

## Creating a release

0. Increment version in `public/manifest.json`

  ```bash
  $ git tag v1.0.2
  $ git push --tags
  ```

1. Create a fresh build

  ```bash
  $ yarn build
  ```

2. Go into the build/ dir

  ```bash
  $ cd build/
  ```

3. Use archiver to zip up all the files in static

4. Upload this zip to [Chome developers store](https://chrome.google.com/webstore/developer/edit/ibhdpomfalkdcjnmoicdjleclagcifnl)

5. Upload to [mozilla add ons](https://addons.mozilla.org/en-US/developers/addons)

    ```
    Put link to https://github.com/alternatelabs/void-browser-extension in **Notes for Reviewer**
    ```

6. Open xcode project for Safari extension.

    - Remove references to files under "Void Extension -> Resources".
    - Then drag in all files from `build` folder to that location.
    - "Product -> Archive"
    - Distribute as Developer ID and download the package.
    - Compress Void icon and upload to s3


## Build Setup

```bash
# install dependencies
yarn install

# serve with hot reload at localhost:3080
yarn start

# build for production with minification
yarn build
```

## Built With

* [React](https://reactjs.org/)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
