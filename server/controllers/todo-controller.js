var { Todo } = require("../models/todo");
var { ObjectID } = require("mongodb");
const _ = require("lodash");

/**
 * Create and Add Note
 * @param {express request object} req
 * @param {express response object} res
 */
exports.create = (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo
    .save()
    .then(doc => {
      res.send(doc);
    })
    .catch(e => res.status(400).send(e));
};

/**
 * Find all Notes
 * @param {*} req
 * @param {*} res
 */
exports.findAll = (req, res) => {
  Todo.find({})
    .then(todos => {
      res.send({ todos }); //send object instead array so can add more fields to KSON
    })
    .catch(e => res.status(400).send(e));
};

/**
 * Find Todo by Id
 * @param {*} req
 * @param {*} res
 */
exports.findByID = (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
};

/**
 * Delete Todo by Id
 * @param {*} req
 * @param {*} res
 */
exports.deleteById = (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
};

exports.update = (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        res.status(404).send();
      }
      res.send(todo);
    })
    .catch(e => res.status(404).send());
};
