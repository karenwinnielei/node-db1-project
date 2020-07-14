const express = require('express');

const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
  db('accounts')
    .then((accounts) => {
      res.status(200).json({ data: accounts });
    })
    .catch((err) => {
      handleError(err);
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db('accounts')
    .where({ id })
    .first()
    .then((accounts) => {
      res.status(200).json({ data: accounts });
    })
    .catch((err) => {
      handleError(err);
    });
});

router.post('/', (req, res) => {
  const accountData = req.body;

  if (isValidAccount(accountData)) {
    db('accounts')
      .insert(accountData, 'id')
      .then((newId) => {
        res
          .status(201)
          .json({ data: newId })
          .catch((err) => {
            handleError(err);
          });
      });
  } else {
    res
      .status(400)
      .json({ error: 'name and budget are required for account' });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db('accounts')
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ data: count });
      } else {
        res
          .status(404)
          .json({ message: 'there was no record to update' });
      }
    })
    .catch((error) => {
      handleError(error, res);
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db('accounts')
    .where({ id })
    .del()
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ data: count });
      } else {
        res
          .status(404)
          .json({ message: 'there was no record to delete' });
      }
    })
    .catch((error) => {
      handleError(error, res);
    });
});

function handleError(error, res) {
  console.log('error', error);
  res.status(500).json({ message: error.message });
}

function isValidAccount(data) {
  return Boolean(data.name && data.budget);
}

module.exports = router;
