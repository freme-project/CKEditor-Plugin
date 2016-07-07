/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeTranslateDialog', function (editor) {
    var $ = window.$ || window.jQuery;

    if (!$) {
        editor.showNotification('jQuery not found!', 'warning');
    }
    var inLangs = [['Dutch', 'NL'], ['English', 'EN']];
    var outLangs = {
        'NL': [['French ', 'FR'], ['German ', 'DE'], ['English', 'EN']],
        'EN': [['Bulgarian ', 'BG'], ['Czech ', 'CS'], ['Danish ', 'DA'], ['Dutch', 'NL'], ['Finnish ', 'FI'], ['French', 'FR'], ['German ', 'DE'], ['Greek ', 'EL'], ['Hungarian', 'HU'], ['Italian ', 'IT'], ['Polish ', 'PL'], ['Portuguese ', 'PT'], ['Romanian ', 'RO'], ['Slovenian ', 'SL'], ['Swedish ', 'SV']]
    };
    var langDefault = ['EN','DE'];

    function translate(sourceText, sourceLang, targetLang, cb) {
        doRequest('POST',
            'http://api.freme-project.eu/0.6/e-translation/tilde?informat=text&outformat=json-ld&source-lang=' + sourceLang.toLowerCase() + '&target-lang=' + targetLang.toLowerCase(),
            sourceText,
            {'Content-Type': 'text/plain', Accept: 'application/json+ld'},
            function (data) {
                cb(null, data.target['@value']);
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
            eTransNot.update({ type: 'success', message: 'e-Translate completed!' });
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
                        translate($(node.$).text(), inLang, outLang, function (err, text) {
                            todo--;
                            if (err) {
                                eTransNot.update({ type: 'warning', message: 'e-Translate failed!' });
                                return console.log(err);
                            }
                            var newNode = new CKEDITOR.dom.element(currTag);
                            newNode.setText(text);
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
