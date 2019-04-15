import electron from 'electron';
import path from 'path';
import fs from 'fs';
import head from 'lodash/head';

export default class APIRequestResultStore {
  constructor() {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    );
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, 'api-request-results.json');
    this.data = parseDataFile(this.path, {});
  }

  // This will just return the property on the `data` object
  get(key) {
    return this.data[key];
  }

  getLatest(key) {
    return head(this.data[key]);
  }

  getAll() {
    const data = Object.values(this.data);
    return data.sort(
      (a, b) =>
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        new Date(b.createdOn) - new Date(a.createdOn)
    );
  }

  // ...and this will set it
  set(key, val) {
    const newVal = { ...val, key, createdOn: new Date() };
    if (this.data.hasOwnProperty(key)) {
      this.data[key] = [newVal, ...this.data[key]];
    } else {
      this.data[key] = [newVal];
    }
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
    return this.getLatest(key);
  }

  remove(key) {
    delete this.data[key];
    fs.writeFileSync(this.path, JSON.stringify(this.data));
    return this.getAll();
  }
}

function parseDataFile(filePath, defaults) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}
