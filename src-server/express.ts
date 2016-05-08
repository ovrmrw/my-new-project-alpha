import lodash from 'lodash';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import falcorExpress from 'falcor-express'; // const falcorExpress = require('falcor-express');
import { translateAsync } from './translator';
import { appRoot } from '../src-middle/utils';

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


app.post('/translation', (req, res) => {
  if ('text' in req.body) {
    let translation = req.body as Translation;
    translateAsync(translation)
      .then(obj => {
        translation.translated = obj.translated;
        translation.accessToken = obj.accessToken;
        translation.clientId = translation.clientId.slice(0, 4) + '****';
        translation.clientSecret = translation.clientSecret.slice(0, 4) + '****';
        res.json({ result: translation });
      })
      .catch(err => {
        res.json({ result: err });
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
