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
        var jqxhr = $.ajax({
            method: 'POST',
            headers: {'Content-Type': 'text/n3', Accept: 'text/n3'},
            data: sourceText,
            url: 'http://api-dev.freme-project.eu/current/e-translation/tilde?informat=text&outformat=json-ld&source-lang=' + sourceLang.toLowerCase() + '&target-lang=' + targetLang.toLowerCase()
        }).done(function (data) {
                var outString = data.target['@value'];
                var result = '<p>' + outString + '</p>';
                cb(null, result);
            })
            .fail(function () {
                cb(new Error('Translation error'));
            });
    }

    //function doRequest(method, url, data, headers, success, error) {
    //    var httprequest;
    //    if (window.XMLHttpRequest) {
    //        httprequest = new XMLHttpRequest();
    //    } else {
    //        // code for older browsers
    //        httprequest = new ActiveXObject("Microsoft.XMLHTTP");
    //    }
    //    httprequest.onreadystatechange = function() {
    //        if (httprequest.readyState == 4 && httprequest.status == 200) {
    //            success(httprequest, httprequest.responseText);
    //        }
    //        else {
    //            error(httprequest);
    //        }
    //    };
    //    httprequest.open(method, url, true);
    //    for (var key in headers) {
    //        xhh
    //    }
    //    httprequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //    xhttp.send("fname=Henry&lname=Ford");
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
            var dialog = this;
            translate($(editor.getData()).text(), dialog.getValueOf('tab-main', 'lang-in'), dialog.getValueOf('tab-main', 'lang-out'), function (err, html) {
                if (err) {
                    return console.log(err);
                }
                editor.setData(html, {
                    callback: function () {
                        console.log('Joepie!');
                    }
                });
            });
        }
    };
});
