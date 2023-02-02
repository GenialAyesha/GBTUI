const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const spawn = require('child_process').spawn;
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/main', upload.single('myFile'), (req, res) => {
  const file = req.file;
  const fileName = `${file.originalname}`;
  console.log(`Received file: ${fileName}`);


  // move the file to a new location
  fs.rename(file.path, `uploads/${fileName}`, (error) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }
    // res.sendStatus(200);
    // console.log(req.file);
    res.send('Successfully uploaded file');
  });

});
app.post('/runBatch', (req, res) => {
  console.log('RunBatch is triggered')
  var bat = require.resolve('../../TestGBT/POC.bat');

  var ls = spawn(bat);

  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  ls.on('exit', function (code) {
    console.log('child process exited with code ' + code);
  });
  
  res.send('Successfully started batch');
});

app.listen(3500, () => {
  console.log('Server listening on port 3500');
});
