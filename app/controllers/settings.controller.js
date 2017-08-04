import Promise from 'bluebird';

const fs = Promise.promisifyAll(require('fs'));

const CONFIG_FILE = 'app/config/app.json';

const defaultConfig = {
  nrOfDecimals: 2,
};

const create = (req, res, next) => {
  const data = JSON.stringify(defaultConfig);

  fs.writeFileAsync(CONFIG_FILE, data, {})
    .then(() => res.json({ message: 'Config file created', data: defaultConfig }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  fs.readFileAsync(CONFIG_FILE, 'utf8')
    .then(config => res.json(JSON.parse(config)))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  fs.readFileAsync(CONFIG_FILE, 'utf8')
    .then((data) => {
      const config = JSON.parse(data);

      const json = JSON.stringify({
        ...config,
        ...req.body
      });

      return fs.writeFileAsync(CONFIG_FILE, json, {});
    })
    .then(() => fs.readFileAsync(CONFIG_FILE, 'utf8'))
    .then(data => res.json({ message: 'Config file updated', data: JSON.parse(data) }))
    .catch(e => next(e));
};

export default {
  create,
  list,
  update,
};
