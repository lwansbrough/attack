# Attack

🧪 This project is to be considered experimental for now. Note it does not have a license.

## Contributions
Because this app is in the early stages of development, every aspect of it is subject to change. Plugin contributions that utilize the APIs as they exist are welcome, but please recognize that the API at this time is very fluid.

For feature/API requests, please create an issue before attempting to submit a pull request.

## Development

To run the development version of the project you only have to run:

```
npm run dev
```

This will instantiate a development server at port 8000 and a watcher together
with hot reloading so changes to files will immediately be reflected in the browser.


## Production

To run this project in production without having the entire source code available,
you first have to run:

```
npm run build
```

The following folders/files will be required to run the production version:
```
 - dist/
 - i18n/
 - public/
 - package-lock.json
 - package.json
 - server.js
```

You can use `npm run prod` to install the node modules and run the production version.
Alternatively you can run `npm install --production` and then `npm run start`.
