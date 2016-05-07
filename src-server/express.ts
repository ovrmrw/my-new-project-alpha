import lodash from 'lodash';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import multer from 'multer';
import falcorExpress from 'falcor-express'; // const falcorExpress = require('falcor-express');
// import {MinimongoFalcorRouter} from '../src-middle/minimongo-falcor-router';
import { translateAsync } from './translator';

const upload = multer();

const appRoot = path.resolve(__dirname, '..');
console.log('Application Root: ' + appRoot);

const app = express();
app.set('views', appRoot + '/views');
app.set('view engine', 'jade');
app.use(express.static(appRoot)); // ExpressとElectronが両立する書き方。

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS on Express (http://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");
  next();
});

app.get('/', (req, res) => {
  res.redirect('/views');
});

app.get('/views', (req, res) => {
  // res.render('index', { title: 'ExpressApp', mode: EXPRESS_ENV });
  res.render('index', { title: 'ExpressApp' });
});

app.use('/model.json', falcorExpress.dataSourceRoute((req, res) => {
  // return new MinimongoFalcorRouter(); // 引数のreq, resで何が出来るのかわからないので無視。
  return null;
}));

app.post('/trans', (req, res) => {
  console.log(req.body);
  console.log(JSON.stringify(req.body));
  if ('text' in req.body) {
    const text = req.body.text;
    const clientId = req.body.clientId;
    const clientSecret = req.body.clientSecret;
    translateAsync(text, clientId, clientSecret).then(translated => {
      res.json({ result: translated });
    });
  } else {
    res.json({ result: null });
  }
});



const port = 3000;
const host = 'localhost'
app.listen(port, host);
console.log('Express server listening at http://%s:%s', host, port);
export {host, port}
