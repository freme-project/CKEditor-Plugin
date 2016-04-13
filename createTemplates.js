/**
 * Created by bjdmeest on 8/01/2016.
 */

var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    request = require('request');

var fremeBase = 'http://api.freme-project.eu/current/';
var authName = 'bjdmeest',
    authPass = 'fremefreme';

request({
    url: fremeBase + 'authenticate',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        'X-Auth-Username': authName,
        'X-Auth-Password': authPass
    }
}, function (err, res, body) {
    body = JSON.parse(body);
    if (!body.token && body.status !== 200) {
        throw new Error(body.message);
    }
    var token = body.token;

    request({
            url: fremeBase + 'e-link/templates/',
            method: 'GET',
            headers: {
                Accept: 'application/json'
            },
            qs: {
                outformat: 'application/json'
            }
        },
        function (err, res, templates) {
            // TODO check if has properties: create sparql.
            templates = JSON.parse(templates);
            var exists = {};
            for (var i = 0; i < templates.length; i++) {
                exists[templates[i].label] = templates[i].id;
            }
            var templateBaseDir = path.resolve(__dirname, './templates');
            fs.readdir(templateBaseDir, function (err, files) {
                async.mapLimit(files, 4, function (file, done) {
                    if (file.indexOf('.txt') === -1 || file.indexOf('everything') === -1) {
                        return done();
                    }
                    console.log(file);

                    async.map([path.resolve(templateBaseDir, file), path.resolve(templateBaseDir, file.replace('.txt', '.json'))], function (file, readDone) {
                        fs.readFile(file, 'utf8', readDone);
                    }, function (err, data) {
                        var postObj = JSON.parse(data[1]);
                        if (exists[postObj.label]) {
                            return done(null, {label: postObj.label, id: exists[postObj.label]});
                        }

                        data[0] = data[0].replace(/http:\/\/dbpedia.org\/resource\/Barack_Obama/g, '@@@entity_uri@@@');
                        data[0] = data[0].replace(/http:\/\/dbpedia.org\/resource\/Paris/g, '@@@entity_uri@@@');
                        postObj.query = data[0];

                        request.post({
                            url: fremeBase + 'e-link/templates/',
                            headers: {
                                Accept: 'application/json',
                                'X-Auth-Token': token
                            },
                            qs: {
                                outformat: 'application/json'
                            },
                            body: JSON.stringify(postObj)
                        }, function (err, res, body) {
                            body = JSON.parse(body);
                            if (!body.id) {
                                return done(new Error(body.message));
                            }
                            return done(null, {label: postObj.label, id: body.id});
                        });
                    });
                }, function (err, results) {
                    if (err) {
                        throw err;
                    }
                    console.log(JSON.stringify(results, null, '  '));
                    console.log('done!');
                });
            });
        });
});
