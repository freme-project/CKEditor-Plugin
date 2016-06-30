/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeEntityDialog', function (editor) {
    var $ = window.$ || window.jQuery;

    if (!$) {
        editor.showNotification('jQuery not found!', 'warning');
    }

    var langs = [['Dutch', 'NL'], ['English', 'EN'], ['French', 'FR'], ['German', 'DE'], ['Italian', 'IT'], ['Spanish', 'ES'], ['Russian', 'RU']];
    var datasetsJSON = [
        {
            "Name": "dbpedia",
            "label": 'General information from Wikipedia',
            "desc": 'DBPedia is the structured version of Wikipedia: a free-access, free-content Internet encyclopedia, supported and hosted by the non-profit Wikimedia Foundation.<br/>See <a href="http://dbpedia.org">here</a> for more information.',
            "Description": "DBpedia datasets for all languages",
            "TotalEntities": 14200830,
            "CreationTime": 1435966058019
        },
        {
            "Name": "geopolitical",
            "label": 'Country information',
            "desc": "The FAO geopolitical ontology and related services have been developed to facilitate data exchange and sharing in a standardized manner among systems managing information about countries and/or regions.<br/>The geopolitical ontology ensures that FAO and associated partners can rely on a master reference for geopolitical information, as it manages names in multiple languages (English, French, Spanish, Arabic, Chinese, Russian and Italian); maps standard coding systems (UN, ISO, FAOSTAT, AGROVOC, etc); provides relations among territories (land borders, group membership, etc); and tracks historical changes.<br/>See <a href='http://www.fao.org/countryprofiles/geoinfo/en/'>here</a> for more information.",
            "Description": "Geopolitical ontology (http://www.fao.org/countryprofiles/geoinfo/en/)",
            "TotalEntities": 5905,
            "CreationTime": 1442405451333
        },
        {
            "Name": "viaf",
            "label": "Information about authors, artists, etc.",
            "desc": "The VIAF® (Virtual International Authority File) combines multiple name authority files into a single OCLC-hosted name authority service. The goal of the service is to lower the cost and increase the utility of library authority files by matching and linking widely-used authority files and making that information available on the Web.<br/>See <a href='http://viaf.org/'>here</a> for more information.",
            "Description": "The VIAF® (Virtual International Authority File) dataset is a collection of multiple name authority files. (http://viaf.org/)",
            "TotalEntities": 44119711,
            "CreationTime": 1444922284386
        },
        {
            "Name": "orcid",
            "label": "Information on scientific researchers",
            "desc": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers. ORCID is unique in its ability to reach across disciplines, research sectors and national boundaries. It is a hub that connects researchers and research through the embedding of ORCID identifiers in key workflows, such as research profile maintenance, manuscript submissions, grant applications, and patent applications.<br/>See <a href='http://orcid.org/'>here</a> for more information.",
            "Description": "The ORCID dataset provides persistent digital identifier for researchers (http://orcid.org/)",
            "TotalEntities": 1321116,
            "CreationTime": 1444922402140
        }
    ];
    var datasets = [];
    var desc = {};
    for (var i = 0; i < datasetsJSON.length; i++) {
        var currSet = datasetsJSON[i];
        if (currSet.Description !== '' && currSet.TotalEntities > 0) {
            datasets.push([currSet.label, currSet.Name]);
            desc[currSet.Name] = currSet.desc;
        }
    }

    function link(sourceText, lang, dataset, cb) {
        doRequest('POST',
            'http://api.freme-project.eu/0.6/e-entity/freme-ner/documents?informat=text%2Fhtml&outformat=text%2Fhtml&language=' + lang.toLowerCase() + '&dataset=' + dataset + '&mode=all',
            '<p>' + sourceText + '</p>',
            {'Content-Type': 'text/html', Accept: 'text/n3'},
            function (results) {
                var result = '';
                if (results.indexOf('<p>') === -1 && results.indexOf('<p') >= 0) {
                    // entire paragraph is recognized as one entity
                    result = '<span' + results.slice(results.indexOf('<p') + 2, results.lastIndexOf('</p>')) + '</span>';
                }
                else {
                    result = results.slice(results.indexOf('<p>') + 3, results.lastIndexOf('</p>'));
                }
                cb(null, result);
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

    return {
        title: 'Detect concepts',
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
                        label: 'Language of the text',
                        items: langs,
                        default: 'EN'
                    },
                    {
                        type: 'select',
                        id: 'dataset',
                        label: 'What are you looking for?',
                        items: datasets,
                        default: 'dbpedia',
                        onChange: function () {
                            this.getDialog().getContentElement('tab-main', 'dataset-desc').getElement().$.innerHTML = desc[this.getValue()];
                        }
                    },
                    {
                        type: 'html',
                        id: 'dataset-desc',
                        html: '<div style="white-space: initial; color: gray; border-left: gainsboro solid 4px; padding-left: 8px;">' + desc['dbpedia'] + '</div>'
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
            var eEntityNot = editor.showNotification('Detecting...', 'progress', 0);
            var nodes = [];
            for (var i = 0; i < goodTags.length; i++) {
                var nodeList = doc.getElementsByTag(goodTags[i]);
                for (var j = 0; j < nodeList.count(); j++) {
                    nodes.push(nodeList.getItem(j));
                }
            }
            asyncLoop({
                length: nodes.length,
                functionToLoop: function (loop, i) {
                    var node = nodes[i];
                    var $el = $(node.$.outerHTML);
                    $el.find('[its-ta-class-ref]').each(function () {
                        this.outerHTML = $(this).text();
                    });
                    link($el.html(), lang, dataset, function (err, html) {
                        todo--;
                        if (err) {
                            return console.log(err);
                        }
                        node.setHtml(html);
                        eEntityNot.update({progress: (i + 1) / nodes.length});
                        return loop();
                    });
                },
                callback: function () {
                    eEntityNot.update({type: 'success', message: 'Detection done.'});
                }
            });
        }
    };
});

var asyncLoop = function (o) {
    var i = -1;

    var loop = function () {
        i++;
        if (i == o.length) {
            o.callback();
            return;
        }
        o.functionToLoop(loop, i);
    };
    loop();//init
};
