/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeTranslateDialog', function (editor) {
    var inLangs = [['Dutch', 'NL'], ['English', 'EN']];
    var outLangs = {
        'NL': [['English', 'EN'], ['French ', 'FR'], ['German ', 'DE']],
        'EN': [['Bulgarian ', 'BG'], ['Czech ', 'CS'], ['Danish ', 'DA'], ['Dutch', 'NL'], ['Estonian ', 'ET'], ['Finnish ', 'FI'], ['French ', 'FR'], ['German ', 'DE'], ['Greek ', 'EL'], ['Hungarian', 'HU'], ['Italian ', 'IT'], ['Latvian ', 'LV'], ['Lithuanian ', 'LT'], ['Polish ', 'PL'], ['Portuguese ', 'PT'], ['Romanian ', 'RO'], ['Russian ', 'RU'], ['Slovenian ', 'SL'], ['Spanish ', 'ES'], ['Swedish ', 'SV']]
    };

    function translate(sourceText, sourceLang, targetLang, cb) {
        doRequest('POST',
            'http://api.freme-project.eu/current/e-translation/tilde?informat=text&outformat=json-ld&source-lang=' + sourceLang.toLowerCase() + '&target-lang=' + targetLang.toLowerCase(),
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
                method: method,
                headers: headers,
                data: data,
                url: url
            })
            .done(success)
            .fail(error);
    }

    function endIt(todo) {
        if (todo === 0) {
            editor.showNotification('e-Translate completed!', 'success');
        }
    }

    //function doOldRequest(method, url, data, headers, success, error) {
    //    var httprequest;
    //    if (window.XMLHttpRequest) {
    //        httprequest = new XMLHttpRequest();
    //    } else {
    //        // code for older browsers
    //        httprequest = new ActiveXObject("Microsoft.XMLHTTP");
    //    }
    //    httprequest.onreadystatechange = function () {
    //        if (httprequest.readyState == 4 && httprequest.status == 200) {
    //            success(httprequest, httprequest.responseText);
    //        }
    //        else {
    //            error(httprequest);
    //        }
    //    };
    //    httprequest.open(method, url, true);
    //    for (var key in headers) {
    //        if (headers.hasOwnProperty(key)) {
    //            httprequest.setRequestHeader(key, headers[key]);
    //        }
    //    }
    //    httprequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //    httprequest.send(data);
    //}

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
                        default: 'EN',
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
                        items: outLangs['EN'],
                        default: 'FR'
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
            editor.showNotification('e-Translate started!');
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
                                editor.showNotification('e-Translate failed!', 'warning');
                                return console.log(err);
                            }
                            var newNode = new CKEDITOR.dom.element(currTag);
                            newNode.setText(text);
                            newNode.setStyle('color', 'red');
                            newNode.insertAfter(node);
                            endIt(todo);
                        });
                    })(node, currTag, inLang, outLang);
                }
            }

        }
    };
});
