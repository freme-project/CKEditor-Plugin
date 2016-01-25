/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeEntityDialog', function (editor) {
    var langs = [['Dutch', 'NL'], ['English', 'EN'], ['French ', 'FR'], ['German ', 'DE'], ['Italian ', 'IT'], ['Spanish ', 'ES']];
    var datasetsJSON = [
        {
            "Name": "dbpedia",
            "Description": "DBpedia datasets for all languages",
            "TotalEntities": 14200830,
            "CreationTime": 1435966058019
        },
        {
            "Name": "onld",
            "Description": "Organization Name Linked Data (http://www.lib.ncsu.edu/ld/onld/)",
            "TotalEntities": 5153,
            "CreationTime": 1442404750691
        },
        {
            "Name": "geopolitical",
            "Description": "Geopolitical ontology (http://www.fao.org/countryprofiles/geoinfo/en/)",
            "TotalEntities": 5905,
            "CreationTime": 1442405451333
        },
        {
            "Name": "global_airports",
            "Description": "A dataset of global airports featuring their names and unique IATA/ICAO identifiers.",
            "TotalEntities": 18586,
            "CreationTime": 1442580539219
        },
        {
            "Name": "viaf",
            "Description": "The VIAF® (Virtual International Authority File) dataset is a collection of multiple name authority files. (http://viaf.org/)",
            "TotalEntities": 44119711,
            "CreationTime": 1444922284386
        },
        {
            "Name": "orcid",
            "Description": "The ORCID dataset provides persistent digital identifier for researchers (http://orcid.org/)",
            "TotalEntities": 1321116,
            "CreationTime": 1444922402140
        },
        {
            "Name": "mydataset",
            "Description": "",
            "TotalEntities": 16,
            "CreationTime": 1446198583025
        },
        {
            "Name": "NAME",
            "Description": "",
            "TotalEntities": 0,
            "CreationTime": 1446201950406
        }
    ];
    var datasets = [];
    for (var i = 0; i < datasetsJSON.length; i++) {
        var currSet = datasetsJSON[i];
        if (currSet.Description !== '' && currSet.TotalEntities > 0) {
            datasets.push([currSet.Description, currSet.Name]);
        }
    }

    function link(sourceText, lang, dataset, cb) {
        doRequest('POST',
            'http://api.freme-project.eu/current/e-entity/freme-ner/documents?informat=text%2Fhtml&outformat=text%2Fhtml&language=' + lang.toLowerCase() + '&dataset=' + dataset + '&mode=all',
            '<p>' + sourceText + '</p>',
            {'Content-Type': 'text/html', Accept: 'text/n3'},
            function (results) {
                cb(null, results.slice(results.indexOf('<p>') + 3, results.lastIndexOf('</p>')));
            },
            function () {
                cb(new Error('Linking error'));
            }
        );

    }

    function doRequest(method, url, data, headers, success, error) {
        $.ajax({
                method: method,
                headers: headers,
                data: data,
                url: url
            })
            .done(success)
            .fail(error);
    }

    function endIt(todo, eEntityNot) {
        if (todo === 0) {
            eEntityNot.update({type: 'success', message: 'e-Entity completed!'});
        }
    }

    return {
        title: 'FREME Entity',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-main',
                label: 'Parameter selection',
                elements: [
                    {
                        type: 'select',
                        id: 'lang',
                        label: 'Language',
                        items: langs,
                        default: 'EN'
                    },
                    {
                        type: 'select',
                        id: 'dataset',
                        label: 'Target Language',
                        items: datasets,
                        default: 'dbpedia'
                    }
                ]
            }
        ],
        onOk: function () {
            var lang = this.getValueOf('tab-main', 'lang'),
                dataset = this.getValueOf('tab-main', 'dataset'),
                doc = editor.document,
                goodTags = ['h1', 'h2', 'h3', 'blockquote', 'p'],
                todo = 0;
            var eEntityNot = editor.showNotification('e-Entity started!');
            for (var i = 0; i < goodTags.length; i++) {
                var nodes = doc.getElementsByTag(goodTags[i]);
                todo += nodes.count();
                for (var j = 0; j < nodes.count(); j++) {
                    var node = nodes.getItem(j);
                    (function (node, lang, dataset) {
                        var $el = $(node.$.outerHTML);
                        $el.find('[its-ta-class-ref]').each(function() {
                            this.outerHTML = $(this).text();
                        });
                        link($el.html(), lang, dataset, function (err, html) {
                            todo--;
                            if (err) {
                                return console.log(err);
                            }
                            node.setHtml(html);
                            endIt(todo, eEntityNot);
                        });
                    })(node, lang, dataset);
                }
            }

        }
    };
});
