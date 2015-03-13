var express = require('express');
var mongoose = require('mongoose');

var connectionStrings = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/conf'
mongoose.connect(connectionStrings);
var app = express();

app.use(express.static(__dirname + '/public'));

var WebsiteSchema = new mongoose.Schema({
    name: String,
    Create: { type: Date, default: Date.now}
}, {collection:'website'});

var Website = mongoose.model('website', WebsiteSchema);
app.get('/rest/website/:name/create', function (req, res) {
    var website = new Website({ name: req.params.name });
    website.save(function (err, doc) {
        res.json(doc);
    });
});
app.delete('/rest/website/:id', function (req, res) {
    Website.remove({ _id: req.params.id }, function () {
        Website.find(function (err, docs) {
            res.json(docs);})
    })});

app.get('/rest/website', function (req, res) {
    Website.find(function (err, docs) {
        res.json(docs);
    })
});

app.get('/rest/process', function (req, res) {
       res.json(process.env);
});
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);