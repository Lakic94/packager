import { app, BrowserWindow, screen, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import * as fse from 'fs-extra';


let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  let userAppData = app.getPath('userData')
  // console.log(userAppData);

  if (!fs.existsSync(userAppData + "/packages")) {
    fs.mkdirSync(userAppData + "/packages");
  }

  ipcMain.on('init', async (event, args) => {

    let initialPackages = [];
    let names;

    try {
      names = await fs.readdirSync(`${userAppData}/packages/`);
    } catch (error) {
      console.log(error);
    }

    names.map(async (item) => {
      let image = fs.readFileSync(`${userAppData}/packages/${item}/shapespark/cover.jpg`).toString('base64');

      // try {

      // } catch (error) {

      // }
      // await fs.readdir(`${userAppData}/packages/${item}/shapespark`, 'utf-8', (err, data) => {
      //   initialPackages.push({
      //     name: item,
      //     img: `${userAppData}/packages/${item}/shapespark/cover.jpg`
      //   })
      //   console.log(2);

      // })
      initialPackages.push({
        name: item,
        img: image
      })
    })
    event.sender.send('availableProjects', initialPackages);


  })

  ipcMain.on('initProjectConfigs', (event, args) => {
    let options = fs.readFileSync(`${userAppData}/packages/${args.name}/options.json`).toString()
    let menuConfig = fs.readFileSync(`${userAppData}/packages/${args.name}/menuConfig.json`).toString();
    console.log(options);

    let options1 = JSON.parse(options);
    let menuConfig1 = JSON.parse(menuConfig);


    event.reply('projectConfigs', { options: options1, menuConfig: menuConfig1 })
  })

  ipcMain.on('saveChanges', (event, args) => {
    // console.log(args);
    let test = args.optionsConfig.options.map(option => {
      // console.log(option);
      let newOptionsArray = option.options.map(option1 => {
        // console.log(option1);
        if (option1.imageSrc.path) {
          const path = fs.readFileSync(option1.imageSrc.path);
          const save = fse.copySync(option1.imageSrc.path,
            `${userAppData}/packages/${args.name}/assets/thumbnail/${option1.imageSrc.name}.jpg`, { overwrite: true })
        }

        let newOption = { ...option1, ...{ imageSrc: option1.imageSrc.name ? option1.imageSrc.name + '.jpg' : '' } };
        return newOption;
      })

      let newOptionsObject = { ...option, ...{ options: newOptionsArray } }
      return newOptionsObject;

    })

    win.webContents.send('fileInt', test)

    // const save = fse.copySync(option1.imageSrc.path,
    //   `${userAppData}/packages/${args.name}/assets/thumbnail/
    //   ${option1.imageSrc.name}.jpg`, { overwrite: true })

    const savedOptions = fs.writeFileSync(userAppData + `/packages/${args.name}/options.json`, JSON.stringify(test))
  })

  ipcMain.on('saveMenu', (event, args) => {

    let test = args.menuConfig.options.map(option => {
      console.log('option', option);

      if (option.imgSrc.path) {
        const path = fs.readFileSync(option.imgSrc.path);
        const save = fse.copySync(option.imgSrc.path,
          `${userAppData}/packages/${args.name}/assets/views/${option.imgSrc.name}.jpg`, { overwrite: true })
      }

      let newOption = { ...option, ...{ imgSrc: option.imgSrc.name ? option.imgSrc.name + '.jpg' : '' } };
      return newOption;
    })

    const savedOptions = fs.writeFileSync(userAppData + `/packages/${args.name}/menuConfig.json`, JSON.stringify(test))
    // console.log('savedOptins', savedOptions);
  })

  ipcMain.on('testMultiple', (event, args) => {

    event.sender.send('testSender', '1');
  })

  ipcMain.on('select-image', async (event, arg) => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [
        { name: "All Files", extensions: ["*"] }]
    })

    event.sender.send('select-image-close', { files: result });
  })




  ipcMain.on('select-dirs', async (event, arg) => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile', 'openDirectory'],
      filters: [
        { name: "All Files", extensions: ["*"] }]
    })
    if (result.filePaths.length < 1) {
      return;
    }

    event.sender.send('closeDialog', { close: true });

    let coverJsonString = fs.readFileSync(result.filePaths[0] + `/cover.json`).toString();
    let coverJson = JSON.parse(coverJsonString);

    coverJson = coverJson.extensions.filter(extension => extension.type === "SwitchObjects");
    let coverForSave = [];
    coverJson.map(switchObject => {
      let object = {};
      object['name'] = switchObject.name.replace('Trigger_', '');
      object['title'] = '';
      let optionsArray = []
      switchObject.nodeTypes.map(node => {
        let optionsObject = {};
        optionsObject['name'] = node;
        optionsObject['title'] = '';
        optionsObject['subtitle'] = '';
        optionsObject['imageSrc'] = '';

        optionsArray.push(optionsObject);
      })
      object['options'] = optionsArray;
      coverForSave.push(object)
    });
    win.webContents.send('test', coverForSave);

    console.log('coverForSave', coverForSave);


    // return;

    const allowedFiles = ['.htaccess',
      '.nginx.conf',
      'applicationHost.config',
      'cover.json',
      'shapespark',
      'web.config'];

    fs.readdir(result.filePaths[0], 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!fs.existsSync(userAppData + `/packages/${arg.name}`)) {
        fs.mkdirSync(userAppData + `/packages/${arg.name}`);
      }

      const savedOptions = fs.writeFileSync(userAppData + `/packages/${arg.name}/options.json`, JSON.stringify(coverForSave))
      console.log('savedOptins', savedOptions);

      data.map((file) => {
        let stat = fs.lstatSync(result.filePaths[0] + '/' + file);
        if (stat.isDirectory()) {
          // console.log('pre slanja test');
          // console.log('jeste folder', file);
          fs.readdir(result.filePaths[0] + `/${file}`, 'utf-8', (err, shapespark) => {
            const validFiles = ['bounds.buf', 'cover.jpg',
              'faces.buf', 'faces16.buf',
              'favicon.ico', 'img',
              'meshes.buf', 'normals.buf',
              'render.json', 'scene.json',
              'thumbnail.jpg', 'transforms.buf',
              'uvs0.buf', 'uvs1.buf',
              'vertices.buf', 'webwalk']
            // console.log(shapespark, 'shapespark');
            console.log(shapespark.every(file => validFiles.indexOf(file) > -1));

            let menuConfig = fs.readFileSync(result.filePaths[0] + `/${file}/scene.json`).toString();
            let menuConfigJson = JSON.parse(menuConfig);

            const menu = menuConfigJson.views.filter(
              (view) =>
                !view.hideFromMenu &&
                view.name !== "Orbit" &&
                view.name !== "Top"
            ).map(config => {
              return {
                name: config.name,
                title: '',
                imgSrc: ''
              }
            })

            console.log('menuConfig', menu);

            const savedMenu = fs.writeFileSync(userAppData + `/packages/${arg.name}/menuConfig.json`, JSON.stringify(menu))
            console.log('savedOptins', savedMenu);

            if (shapespark.every(file => validFiles.indexOf(file) > -1)) {
              fse.copy(result.filePaths[0] +
                `/${file}`,
                userAppData + `/packages/${arg.name}/shapespark`)
                .then(() => console.log('Copy completed!'))
                .catch(err => {
                  return console.error(err)
                })
            }
          })

          // win.webContents.send('test', { test: 'test' });
        } else {
          if (allowedFiles.indexOf(file) > -1) {
            // console.log('nije folder', file)
            fs.copyFile(result.filePaths[0] +
              `/${file}`, userAppData + `/packages/${arg.name}/${file}`, () => {
                // console.log('zavrseno', file);
              })

          }
        }

        fse.copy(app.getAppPath() + "/static",
          userAppData + `/packages/${arg.name}/`)
          .then(() => console.log('Copy completed!'))
          .catch(err => {
            console.log('An error occurred while copying the folder.')
            return console.error(err)
          })
      })


    })
    let ifExists = fs.existsSync(userAppData + `/packages/${arg.name}`);
    console.log('da li postoji', ifExists);

    // fs.writeFileSync(userAppData + `/packages/${arg.name}/options.json`, JSON.stringify(coverForSave));

    // console.log('directories selected', result.filePaths)
  })

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
