/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeLinkDialog', function (editor) {
    var $ = editor.config.freme.$,
        fremeEndpoint = editor.config.freme.endpoint,
        templates = editor.config.freme.link.templates;

    var endpointTypes = {
        'http://dbpedia.org/sparql': 'sparql'
    };

    var labelBase = {
        labels: {
            'en': {
                '@id': 'entity url',
                '@type': 'type',
                'http://www.w3.org/2000/01/rdf-schema#label': 'label',
                'http://www.w3.org/2002/07/owl#sameAs': 'same as',
                'http://purl.org/dc/terms/subject': 'subject',
                'http://nerd.eurecom.fr/ontology#Organization': 'Organization',
                'http://nerd.eurecom.fr/ontology#Person': 'Person',
                'http://nerd.eurecom.fr/ontology#Location': 'Location',
                'http://dbpedia.org/ontology/Location': 'Location',
                'http://www.georss.org/georss/point': 'geo point',
                'http://www.w3.org/2000/01/rdf-schema#seeAlso': 'see also',
                'http://xmlns.com/foaf/0.1/name': 'name',
                'http://www.w3.org/2003/01/geo/wgs84_pos#geometry': 'geometry',
                'http://www.w3.org/2003/01/geo/wgs84_pos#lat': 'latitude',
                'http://www.w3.org/2003/01/geo/wgs84_pos#long': 'longitude',
                'http://www.w3.org/ns/prov#wasDerivedFrom': 'was derived from',
                'http://dbpedia.org/property/languages': 'languages',
                'http://xmlns.com/foaf/0.1/depiction': 'depiction',
                'http://xmlns.com/foaf/0.1/based_near': 'based near',
                'http://xmlns.com/foaf/0.1/isPrimaryTopicOf': 'is primary topic of',
                'http://dbpedia.org/property/imageFlag': 'image flag',
                'http://www.w3.org/2000/01/rdf-schema#comment': 'comment'
            }
        },
        getLabel: function (resource, cb, lang) {
            var self = this;
            if (!lang) {
                lang = 'en'
            }
            if (!self.labels[lang]) {
                self.labels[lang] = {};
            }
            if (self.labels[lang][resource]) {
                return cb(null, self.labels[lang][resource]);
            }
            else {
                fetchLabel(resource, lang, function (err, label) {
                    if (err) {
                        if (self.labels['en'][resource]) {
                            return cb(null, self.labels['en'][resource]);
                        }
                        return cb(err);
                    }
                    self.labels[lang][resource] = label;
                    cb(null, label);
                });
            }
        }
    };

    var typeElements = [];
    var currentInsertingEl = null;
    var $el = null;

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

    var definition = {
        title: 'Information about <>',
        minWidth: 600,
        minHeight: 200,
        buttons: [CKEDITOR.dialog.okButton],
        contents: [],
        onShow: function () {
            var dialog = this;
            $el = $(editor.document.getSelection().getStartElement().$);
            placeCaretAfterIdentRef(editor);
            resetTabs(dialog);
            loadTab(dialog, 'tab-' + templates[0].label);
        },
        onLoad: function () {
            var dialog = this;
            dialog.on('selectPage', function (e) {
                loadTab(dialog, e.data.page);
            });
            for (var key in tabs) {
                if (tabs.hasOwnProperty(key)) {
                    $(dialog.getContentElement(key, 'contentbox').getElement().$).find('button.btn-insert-o').on('click', function (e) {
                        insertInEditor();
                    });
                }
            }
        }
    };

    var tabs = {};
    for (var i = 0; i < templates.length; i++) {
        var tabId = 'tab-' + templates[i].label;
        tabs[tabId] = {
            index: i,
            id: tabId
        };
        definition.contents.push({
            id: tabId,
            title: templates[i].label,
            label: templates[i].label,
            elements: [
                {
                    type: 'html',
                    id: 'html-spinner',
                    html: '<p>Please hold on, we are fetching the content...</p>'
                },
                {
                    type: 'html',
                    id: 'general-info',
                    html: '<div style="display: none">Type: <span class="resource-type"></span> (<a style="color: blue; text-decoration: underline;" class="resource-url" target="_blank"></a> &crarr;)</div>'
                },
                {
                    type: 'html',
                    id: 'contentbox',
                    html: '' +
                    '<div class="contentbox override" style="display: none">' +
                    '  <div class="row">' +
                    '    <div class="col-md-4" id="contentbox-radios">' +
                    '      <div class="type-radio"></div>' +
                    '      <hr style="border-bottom: 1px lightgrey solid;"/>' +
                    '      <div class="general-radio"></div>' +
                    '      <hr style="border-bottom: 1px lightgrey solid;"/>' +
                    '      <div class="reverse-radio"></div>' +
                    '    </div>' +
                    '    <div class="col-md-8">' +
                    '      <p>Resource preview <span class="right"><button class="btn btn-insert-o">Insert</button></span></p>' +
                    '      <div class="viewbox"></div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
                }
            ]
        });
    }

    return definition;

    function resetTabs(dialog, tabs) {
        for (var key in tabs) {
            if (tabs.hasOwnProperty(key)) {
                dialog.getContentElement(key, 'general-info').getElement().hide();
                dialog.getContentElement(key, 'contentbox').getElement().hide();
                dialog.getContentElement(key, 'html-spinner').getElement().show();
            }
        }
    }

    function loadTab(dialog, tabId) {
        var text = $el.text();
        var template = templates[tabs[tabId].index];
        var typeProperties = {};
        var properties = template.properties;
        for (var i = 0; i < properties.length; i++) {
            for (var j = 0; j < properties[i].types.length; j++) {
                typeProperties[properties[i].types[j]] = properties[i].data;
            }
        }
        dialog.getElement().getFirst().find('.cke_dialog_title').getItem(0).setText('Information about <' + text + '>');
        var type = $el.attr('its-ta-class-ref');
        dialog.getContentElement(tabId, 'general-info').getElement().getElementsByTag('span').getItem(0).setText(type);
        labelBase.getLabel(type, function (err, label) {
            if (!err) {
                dialog.getContentElement(tabId, 'general-info').getElement().getElementsByTag('span').getItem(0).setText(label);
            }
        });
        var resource = $el.attr('its-ta-ident-ref');
        dialog.getContentElement(tabId, 'general-info').getElement().getElementsByTag('a').getItem(0).setText(resource);
        dialog.getContentElement(tabId, 'general-info').getElement().getElementsByTag('a').getItem(0).setAttribute('href', resource);
        var $typeRadio = $(dialog.getContentElement(tabId, 'contentbox').getElement().$).find('div.type-radio');
        var $generalRadio = $(dialog.getContentElement(tabId, 'contentbox').getElement().$).find('div.general-radio');
        var $reverseRadio = $(dialog.getContentElement(tabId, 'contentbox').getElement().$).find('div.reverse-radio');
        $typeRadio.empty();
        $generalRadio.empty();
        $reverseRadio.empty();
        doTemplate(resource, template.id, function (err, results) {
            results = removeContext(results);
            var niceResults = {};
            for (var i = 0; i < results['@graph'].length; i++) {
                niceResults[results['@graph'][i]['@id']] = results['@graph'][i];
            }
            var resourceData = niceResults[resource];
            var reverseResults = {};
            for (var reverseSub in niceResults) {
                if (niceResults.hasOwnProperty(reverseSub)) {
                    if (reverseSub[0] === '_') {
                        continue;
                    }
                    if (reverseSub === resource) {
                        continue;
                    }
                    for (var predicate in niceResults[reverseSub]) {
                        if (niceResults[reverseSub][predicate] === resource) {
                            if (!reverseResults[predicate]) {
                                reverseResults[predicate] = [];
                            }
                            reverseResults[predicate].push(reverseSub);
                        }
                    }
                }
            }
            typeElements = [];
            if (resourceData && typeProperties[type]) {
                for (i = 0; i < typeProperties[type].length; i++) {
                    if (resourceData[typeProperties[type][i][1]]) {
                        typeElements.push(typeProperties[type][i][1]);
                    }
                }
                typeElements.sort(function (a, b) {
                    return getLabelLD(niceResults, a) < getLabelLD(niceResults, b);
                });
                $typeRadio.empty();
                var $ul = $('<ul></ul>');
                $typeRadio.append($ul);
                for (i = 0; i < typeElements.length; i++) {
                    var $li = $('<li data-url="' + typeElements[i] + '">' + getLabelLD(niceResults, typeElements[i]) + '</li>');
                    $ul.append($li);
                }
                $ul.find('li').on('click', function () {
                    updateView(dialog, tabId, niceResults, $(this).attr('data-url'), resourceData[$(this).attr('data-url')]);
                });
                $typeRadio.css('display', 'block');
            }
            $generalRadio.empty();
            var $gUl = $('<ul></ul>');
            $generalRadio.append($gUl);
            var lis = [];
            for (var key in resourceData) {
                if (resourceData.hasOwnProperty(key)) {
                    if (key.indexOf('http') !== 0) {
                        continue;
                    }
                    var $gLi = $('<li data-url="' + key + '">' + getLabelLD(niceResults, key) + '</li>');
                    lis.push($gLi);

                }
            }
            lis.sort(function (a, b) {
                return a.text().toLowerCase() > b.text().toLowerCase();
            });
            if (lis.length === 0) {
                $gUl.append('<li>No results found</li>');
            }
            else {
                for (i = 0; i < lis.length; i++) {
                    $gUl.append(lis[i]);
                }
                $gUl.find('li').on('click', function () {
                    updateView(dialog, tabId, niceResults, $(this).attr('data-url'), resourceData[$(this).attr('data-url')]);
                });

                $reverseRadio.empty();
                for (var predicate in reverseResults) {
                    if (!reverseResults.hasOwnProperty(predicate)) {
                        continue;
                    }
                    var $rUl = $('<ul data-title="' + getLabelLD({}, predicate) + '"></ul>');
                    var lis = [];
                    $reverseRadio.append($rUl);
                    for (i = 0; i < reverseResults[predicate].length; i++) {
                        var $rLi = $('<li data-url="' + reverseResults[predicate][i] + '">' + getLabelLD({}, reverseResults[predicate][i]) + '</li>');
                        lis.push($rLi);
                    }
                    lis.sort(function (a, b) {
                        return a.text().toLowerCase() > b.text().toLowerCase();
                    });
                    if (lis.length === 0) {
                        $rUl.append('<li>No results found</li>');
                    }
                    else {
                        for (i = 0; i < lis.length; i++) {
                            $rUl.append(lis[i]);
                        }
                        $rUl.find('li').on('click', function () {
                            updateView(dialog, tabId, niceResults, $(this).attr('data-url'), $(this).attr('data-url'));
                        });
                    }
                }
            }

            dialog.getContentElement(tabId, 'general-info').getElement().show();
            dialog.getContentElement(tabId, 'contentbox').getElement().show();
            dialog.getContentElement(tabId, 'html-spinner').getElement().hide();
            // dialog.showPage('tab-main');
            // dialog.selectPage('tab-main');
            // dialog.hidePage('tab-spinner');

            $('#contentbox-radios').find('li').on('click', function () {
                $('#contentbox-radios').find('li').removeClass('active');
                $(this).addClass('active');
            });
        });
    }

    function getLabelLD(results, resource, lang) {
        lang = lang || 'en';
        if (!results[resource] || !results[resource]['http://www.w3.org/2000/01/rdf-schema#label']) {
            if (labelBase.labels[lang] && labelBase.labels[lang][resource]) {
                return labelBase.labels[lang][resource];
            }
            return resource;
        }
        var labels = results[resource]['http://www.w3.org/2000/01/rdf-schema#label'];
        if (Object.prototype.toString.call(labels) !== '[object Array]') {
            return labels['@value'];
        }
        else {
            for (var i = 0; i < labels.length; i++) {
                if (labels[i]['@language'] === lang) {
                    return labels[i]['@value']
                }
            }
        }
        return labels[0]['@value'];
    }

    function updateView(dialog, tabId, results, predicate, data) {
        var txt = '';
        var html = '';
        if (Object.prototype.toString.call(data) === '[object Array]') {
            var els, i;
            if (data[0]['@language']) {
                html = '<div id="tab-container" class="tab-container"><ul class="etabs"><li class="tab">';
                var lis = [];
                els = [];
                for (i = 0; i < data.length; i++) {
                    lis.push('<a href="#tab-' + i + '">' + getLanguageLabel(data[i]['@language']) + '</a>');
                    els.push('<div id="tab-' + i + '">' + getValueLabel(data[i]) + '</div>');
                }
                html += lis.join('</li><li class="tab">');
                html += '</li></ul>' + els.join('') + '</div>';
                currentInsertingEl = {
                    type: 'text',
                    value: getValueLabel(data[0])
                };
                var $viewbox = $(dialog.getContentElement(tabId, 'contentbox').getElement().$).find('div.viewbox');
                $viewbox.html(html);
                $viewbox.find('#tab-container').easytabs();
                $viewbox.find('#tab-container')
                    .bind('easytabs:midTransition', function (e, $clicked, $panel) {
                        currentInsertingEl = {
                            type: 'text',
                            value: $panel.text()
                        };
                    });
            } else {
                els = [];
                for (i = 0; i < data.length; i++) {
                    els.push(getValueLabel(data[i]));
                }
                txt = els.join(', ');
                html = '<ul><li>' + els.join('</li><li>') + '</li></ul>';
                currentInsertingEl = {
                    type: 'text',
                    value: txt
                };
                $(dialog.getContentElement(tabId, 'contentbox').getElement().$).find('div.viewbox').html(html);
            }
        }
        else {
            txt = html = getValueLabel(data);
            currentInsertingEl = {
                type: 'text',
                value: txt
            };
            $(dialog.getContentElement(tabId, 'contentbox').getElement().$).find('div.viewbox').html(html);
        }

        function getValueLabel(el) {
            if (el['@value']) {
                return getLabelLD(results, el['@value']);
            }
            else if (el['@id']) {
                return getLabelLD(results, el['@id']);
            }
            else {
                return getLabelLD(results, el);
            }
        }

        function getLanguageLabel(lang) {
            var langMap = {
                'nl': 'Dutch',
                'en': 'English',
                'pt': 'Portuguese',
                'it': 'Italian',
                'es': 'Spanish',
                'ar': 'Arabic',
                'de': 'German',
                'ja': 'Japanese',
                'fr': 'French',
                'ru': 'Russian',
                'zh': 'Chinese',
                'pl': 'Polish'
            };
            if (langMap[lang]) {
                return langMap[lang];
            }
            return lang;
        }
    }

    function insertInEditor() {
        if (currentInsertingEl) {
            editor.insertText(' ' + currentInsertingEl.value);
        }
    }

    function explore(url, endpoint, cb) {
        doRequest('POST', fremeEndpoint + 'e-link/explore?resource=' + encodeURIComponent(url) + '&endpoint=' + encodeURIComponent(endpoint) + '&endpoint-type=' + endpointTypes[endpoint], null, {
            'Content-Type': 'application/json',
            'Accept': 'application/ld+json'
        }, function (results) {
            cb(null, removeContext(results)['@graph'][0]);
        }, function () {
            cb(new Error('Exploring error'));
        });
    }

    function fetchLabel(resource, lang, cb) {
        if (!lang) {
            lang = 'en';
        }
        doRequest('GET', 'http://preflabel.org/api/v1/label/' + encodeURIComponent(resource), null, {
            'Accept-Language': lang
        }, function (results) {
            cb(null, results)
        }, function () {
            cb(new Error('Exploring error'));
        });
    }

    function doTemplate(entity, templateId, cb) {
        var turtle = '_:d1 <http://www.w3.org/2005/11/its/rdf#taIdentRef> <' + entity + '>';
        doRequest('POST', fremeEndpoint + 'e-link/documents/?informat=turtle&outformat=json-ld&templateid=' + templateId, turtle, {
            'Content-Type': 'text/turtle',
            Accept: 'application/ld+json'
        }, function (results) {
            cb(null, results);
        }, function (err) {
            cb(new Error('Templating error'));
        });
    }

    /**
     * Removes the context of a JSON-LD object, returns a new object
     * @param obj
     * @returns {{@graph: Array}}
     */
    function removeContext(obj) {
        var newObj = {
            '@graph': []
        };
        var context = obj['@context'];
        var graph = obj['@graph'];
        if (!obj['@graph']) {
            var copy = JSON.parse(JSON.stringify(obj));
            delete copy['@context'];
            graph = [copy];
        }
        for (var i = 0; i < graph.length; i++) {
            var newSubj = {};
            newObj['@graph'].push(newSubj);
            for (var key in graph[i]) {
                if (!graph[i].hasOwnProperty(key)) {
                    continue;
                }
                var newKey = key;
                if (context[key]) {
                    if (typeof context[key] === 'object') {
                        newKey = context[key]['@id'];
                    }
                    else {
                        newKey = context[key];
                    }
                }
                newSubj[newKey] = graph[i][key];
            }
        }
        return newObj;
    }

    /**
     * @param editor
     */
    function placeCaretAfterIdentRef(editor) {
        var sel = editor.document.getSelection();
        var range = editor.createRange();
        var $identRef = $(sel.getRanges()[0].startContainer.$).parents('span[its-ta-ident-ref]');
        if ($identRef.length === 0) {
            return;
        }
        var el = new CKEDITOR.dom.element($identRef[0]);
        range.selectNodeContents(el.getNext());
        range.collapse(true);
        sel.selectRanges([range]);
    }
});
