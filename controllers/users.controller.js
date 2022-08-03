const { selectUsers } = require("../models/users.model");

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.send({ users });
  });
};
