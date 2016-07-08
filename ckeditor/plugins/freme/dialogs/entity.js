/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeEntityDialog', function (editor) {
    var $ = editor.config.freme.$,
        fremeEndpoint = editor.config.freme.endpoint;

    var langs = editor.config.freme.entity.languages;
    var datasetsJSON = editor.config.freme.entity.datasets;
    var defaults = editor.config.freme.entity.defaults;
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
            fremeEndpoint + 'e-entity/freme-ner/documents?informat=text%2Fhtml&outformat=text%2Fhtml&language=' + lang.toLowerCase() + '&dataset=' + dataset + '&mode=all',
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
                type: method,
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
                        default: defaults.language
                    },
                    {
                        type: 'select',
                        id: 'dataset',
                        label: 'What are you looking for?',
                        items: datasets,
                        default: defaults.dataset,
                        onChange: function () {
                            this.getDialog().getContentElement('tab-main', 'dataset-desc').getElement().$.innerHTML = desc[this.getValue()];
                        }
                    },
                    {
                        type: 'html',
                        id: 'dataset-desc',
                        html: '<div style="white-space: initial; color: gray; border-left: gainsboro solid 4px; padding-left: 8px;">' + desc[defaults.dataset] + '</div>'
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
                            eEntityNot.update({type: 'warning', message: 'Detection could not be executed!'});
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
