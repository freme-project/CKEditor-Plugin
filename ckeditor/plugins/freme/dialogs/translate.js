/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeTranslateDialog', function (editor) {
    var $ = editor.config.freme.$;

    var inLangs = editor.config.freme.translate.languages.in;
    var outLangs = editor.config.freme.translate.languages.out;
    var langDefault = editor.config.freme.translate.languages.default;
    var fremeEndpoint = editor.config.freme.endpoint;

    function translate(sourceText, sourceLang, targetLang, cb) {
        var url = fremeEndpoint + 'e-translation/tilde?nif-version=2.1&useI18N=true&source-lang=' + sourceLang.toLowerCase() + '&target-lang=' + targetLang.toLowerCase();   
        doRequest('POST',
            url,
            sourceText,
            {'Content-Type': 'text/html', Accept: 'text/html'},
            function (data) {;
                cb(null, data.toString());
            },
            function () {
                cb(new Error('Translation error'));
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

    function endIt(todo, eTransNot) {
        if (todo === 0) {
            eTransNot.update({type: 'success', message: 'e-Translate completed!'});
        }
    }

    return {
        title: 'FREME Translate',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-main',
                label: 'Language Selection',
                elements: [
                    {
                        type: 'select',
                        id: 'lang-in',
                        label: 'Source Language',
                        items: inLangs,
                        default: langDefault[0],
                        onChange: function (api) {
                            var currVal = this.getValue();
                            var langOut = this.getDialog().getContentElement('tab-main', 'lang-out');
                            langOut.clear();
                            for (var i = 0; i < outLangs[currVal].length; i++) {
                                langOut.add(outLangs[currVal][i][0], outLangs[currVal][i][1]);
                            }
                        }
                    },
                    {
                        type: 'select',
                        id: 'lang-out',
                        label: 'Target Language',
                        items: outLangs[langDefault[0]],
                        default: langDefault[1]
                    }
                ]
            }
        ],
        onOk: function () {
            var inLang = this.getValueOf('tab-main', 'lang-in'),
                outLang = this.getValueOf('tab-main', 'lang-out'),
                doc = editor.document,
                goodTags = ['h1', 'h2', 'h3', 'blockquote', 'p'],
                todo = 0;
            // TODO take into account the async stuff..
            var eTransNot = editor.showNotification('e-Translate started!');
            for (var i = 0; i < goodTags.length; i++) {
                var currTag = goodTags[i];
                var nodes = doc.getElementsByTag(currTag);
                todo += nodes.count();
                for (var j = 0; j < nodes.count(); j++) {
                    var node = nodes.getItem(j);
                    (function (node, currTag, inLang, outLang) {
                        translate($(node.$).html(), inLang, outLang, function (err, html) {
                            todo--;
                            if (err) {
                                eTransNot.update({type: 'warning', message: 'e-Translate failed!'});
                                return console.log(err);
                            }
                            var newNode = new CKEDITOR.dom.element(currTag);
                            newNode.setHtml(html);
                            newNode.setStyle('color', 'red');
                            newNode.insertAfter(node);
                            endIt(todo, eTransNot);
                        });
                    })(node, currTag, inLang, outLang);
                }
            }

        }
    };
});
