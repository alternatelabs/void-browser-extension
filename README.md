# Void browser extension

> Browser extension and bookmarklet app for [Void](https://voidapp.co)

## Creating a release

0. Increment version in `public/manifest.json`

1. Create a fresh build

  ```bash
  $ yarn build
  ```

2. Go into the build/ dir

  ```bash
  $ cd build/
  ```

3. Use archiver to zip up all the files in static

4. Upload this zip to Chome developers store

5. Upload to mozilla add ons

    ```
    Put link to https://github.com/alternatelabs/void-browser-extension in **Notes for Reviewer**
    ```

6. Run a deploy for the safari bookmarklet

  ```bash
  $ ./deploy production
  ```

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Built With

* [Vue](https://vuejs.org/)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
