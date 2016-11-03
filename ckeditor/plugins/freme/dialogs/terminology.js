/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeTerminologyDialog', function (editor) {
    var $ = editor.config.freme.$,
        fremeEndpoint = editor.config.freme.endpoint;

    var langs = editor.config.freme.terminology.languages;
    var defaults = editor.config.freme.terminology.defaults;

    function link(sourceText, langSource, langTarget, collection, cb) {
        var url = fremeEndpoint + 'e-terminology/tilde?source-lang=' + langSource.toLowerCase() + '&target-lang=' + langTarget.toLowerCase() + '&mode=full' + (collection ? '&collection=' + collection : '');
        doRequest('POST',
            url,
            '<p>' + sourceText + '</p>',
            {'Content-Type': 'text/html', Accept: 'text/html'},
            function (results) {
                var result = '';
                if (results.indexOf('<p>') === -1 && results.indexOf('<p') >= 0) {
                    // entire paragraph is recognized as one entity
                    result = '<span' + results.slice(results.indexOf('<p') + 2, results.lastIndexOf('</p>')) + '</span>';
                }
                else {
                    result = results.slice(results.indexOf('<p>') + 3, results.lastIndexOf('</p>'));
                }
                addRefs(result, cb);
            },
            function () {
                cb(new Error('Terminology HTML error'));
            }
        );

        function addRefs(html, cb) {
            doRequest('POST',
                url,
                '<p>' + sourceText + '</p>',
                {'Content-Type': 'text/html', Accept: 'application/ld+json'},
                function (json) {
                    if (!json['@graph']) {
                        return cb(null, html);
                    }

                    var objs = {};

                    for (var i = 0; i < json['@graph'].length; i++) {
                        objs[json['@graph'][i]['@id']] = json['@graph'][i];
                    }

                    var $html = $('<div/>').html(html);
                    $html.find('[its-term-info-ref]').each(function () {
                        var $span = $(this);
                        var refId = $span.attr('its-term-info-ref');
                        if (objs[refId]) {
                            var refs = Array.isArray(objs[refId]['termInfoRef']) ? objs[refId]['termInfoRef'] : [objs[refId] ['termInfoRef']];
                            refs = refs.map(function (ref) {
                                return 'https://term.tilde.com/terms/' + ref.replace(/^:/, '')
                            });
                            $span[0].outerHTML = '<span its-term-info-ref="' + refs[0] + (refs.length > 0 ? '" its-term-info-refs="' + refs.join(' ') : '') + '">' + $span.text() + '</span>';
                        }
                    });

                    cb(null, $html.html());
                },
                function () {
                    cb(new Error('Terminology JSON-LD error'));
                }
            );
        }

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
        title: 'Detect terms',
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
                        default: defaults.language_source
                    },
                    {
                        type: 'text',
                        id: 'collection',
                        label: 'Collection id (only terms in that collection will be detected, leave empty to include all collections)',
                        default: defaults.collection
                    }
                ]
            }
        ],
        onOk: function () {
            var sourceLang, targetLang, collection;
            sourceLang = targetLang = this.getValueOf('tab-main', 'lang');
            collection = this.getValueOf('tab-main', 'collection');
            var doc = editor.document,
                goodTags = ['h1', 'h2', 'h3', 'blockquote', 'p'],
                todo = 0;
            var eTerminologyNotification = editor.showNotification('Detecting...', 'progress', 0);
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
                    $el.find('[its-term-info-ref]').each(function () {
                        this.outerHTML = $(this).text();
                    });
                    link($el.html(), sourceLang, targetLang, collection, function (err, html) {
                        todo--;
                        if (err) {
                            eTerminologyNotification.update({type: 'warning', message: 'Detection could not be executed!'});
                            return console.log(err);
                        }
                        node.setHtml(html);
                        eTerminologyNotification.update({progress: (i + 1) / nodes.length});
                        return loop();
                    });
                },
                callback: function () {
                    eTerminologyNotification.update({type: 'success', message: 'Detection done.'});
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
