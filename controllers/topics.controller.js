const {
    selectTopics
} = require("../models/topics.model")

exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.send({topics} )
    })
};