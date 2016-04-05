/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeLinkDialog', function (editor) {

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

    var typeTemplates = {
        'http://nerd.eurecom.fr/ontology#Person': {},
        'http://dbpedia.org/ontology/Location': 4459
    };
    var typeProperties = {
        'http://nerd.eurecom.fr/ontology#Person': [
            ["abstract", "http://dbpedia.org/ontology/abstract"],
            ["date of birth", "http://dbpedia.org/ontology/birthDate"],
            ["place of birth", "http://dbpedia.org/ontology/birthPlace"],
            ["image", "http://dbpedia.org/property/image"],
            ["thumbnail", "http://dbpedia.org/ontology/thumbnail"],
            ["name", "http://dbpedia.org/property/name"],
            ["name", "http://xmlns.com/foaf/0.1/name"],
            ["nationality", "http://dbpedia.org/property/nationality"],
            ["subject", "http://purl.org/dc/terms/subject"],
            ["homepage", "http://xmlns.com/foaf/0.1/homePage"],
            ["page to wikipedia", "http://xmlns.com/foaf/0.1/isPrimaryTopicOf"]
        ],
        'http://nerd.eurecom.fr/ontology#Location': [
            ["abstract", "http://dbpedia.org/ontology/abstract"],
            ["thumbnail", "http://dbpedia.org/ontology/thumbnail"],
            ["subject", "http://purl.org/dc/terms/subject"],
            ["label", "http://www.w3.org/2000/01/rdf-schema#label"],
            ["homepage", "http://xmlns.com/foaf/0.1/homePage"],
            ["total population", "http://dbpedia.org/ontology/populationTotal"]
        ]
    };
    var allTemplate = 4457;
    var resourceData = {};
    var typeElements = [];
    var resourceElements = [];
    var currentInsertingEl = null;

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
        title: 'Information about <>',
        minWidth: 400,
        minHeight: 200,
        buttons: [CKEDITOR.dialog.okButton],
        contents: [
            {
                id: 'tab-spinner',
                elements: [
                    {
                        type: 'html',
                        id: 'html-spinner',
                        html: '<p>Please hold on, we are fetching the content...</p>'
                    }
                ]
            }, {
                id: 'tab-main',
                elements: [
                    {
                        type: 'html',
                        id: 'general-info',
                        html: 'Type: <span class="resource-type"></span> (<a style="color: blue; text-decoration: underline;" class="resource-url" target="_blank"></a> &crarr;)'
                    },
                    {
                        type: 'html',
                        id: 'contentbox',
                        html: '' +
                        '<div class="contentbox override">' +
                        '  <div class="row">' +
                        '    <div class="col-md-4">' +
                        '      <div class="type-radio"></div>' +
                        '      <div class="general-radio"></div>' +
                        '    </div>' +
                        '    <div class="col-md-8">' +
                        '      <p>Resource preview <span class="right"><button class="btn btn-insert-o">Insert</button></span></p>' +
                        '      <div class="viewbox"></div>' +
                        '    </div>' +
                        '  </div>' +
                        '</div>'
                    }
                ]
            }
        ],
        onShow: function () {
            var dialog = this;
            dialog.hidePage('tab-main');
            var $el = $(editor.document.getSelection().getStartElement().$);
            var text = $el.text();
            dialog.getElement().getFirst().find('.cke_dialog_title').getItem(0).setText('Information about <' + text + '>');
            var type = $el.attr('its-ta-class-ref');
            dialog.getContentElement('tab-main', 'general-info').getElement().getElementsByTag('span').getItem(0).setText(type);
            labelBase.getLabel(type, function (err, label) {
                if (!err) {
                    dialog.getContentElement('tab-main', 'general-info').getElement().getElementsByTag('span').getItem(0).setText(label);
                }
            });
            var resource = $el.attr('its-ta-ident-ref');
            dialog.getContentElement('tab-main', 'general-info').getElement().getElementsByTag('a').getItem(0).setText(resource);
            dialog.getContentElement('tab-main', 'general-info').getElement().getElementsByTag('a').getItem(0).setAttribute('href', resource);
            var $typeRadio = $(dialog.getContentElement('tab-main', 'contentbox').getElement().$).find('div.type-radio');
            var $generalRadio = $(dialog.getContentElement('tab-main', 'contentbox').getElement().$).find('div.general-radio');
            placeCaretAfterIdentRef(editor);
            explore(resource, 'http://dbpedia.org/sparql', function (err, results) { // TODO do with template
                resourceData = results;
                typeElements = [];
                resourceElements = [];
                var i;
                if (typeProperties[type]) {
                    for (i = 0; i < typeProperties[type].length; i++) {
                        if (resourceData[typeProperties[type][i][1]]) {
                            typeElements.push(typeProperties[type][i]);
                        }
                    }
                    typeElements.sort(function (a, b) {
                        return a[0] < b[0];
                    });
                    $typeRadio.empty();
                    var $ul = $('<ul></ul>');
                    $typeRadio.append($ul);
                    for (i = 0; i < typeElements.length; i++) {
                        var $li = $('<li data-url="' + typeElements[i][1] + '">' + typeElements[i][0] + '</li>');
                        $ul.append($li);
                    }
                    $ul.find('li').on('click', function () {
                        updateView(dialog, $(this).attr('data-url'));
                    });
                    $typeRadio.css('display', 'block');
                }
                $generalRadio.empty();
                var $gUl = $('<ul></ul>');
                $generalRadio.append($gUl);
                for (var key in resourceData) {
                    if (resourceData.hasOwnProperty(key)) {
                        if (key.indexOf('http') !== 0) {
                            continue;
                        }
                        var $gLi = $('<li data-url="' + key + '">' + key + '</li>'); // TODO key.label
                        $gUl.append($gLi);
                    }
                }
                $gUl.find('li').on('click', function () {
                    updateView(dialog, $(this).attr('data-url'));
                });
                $(dialog.getContentElement('tab-main', 'contentbox').getElement().$).find('button.btn-insert-o').on('click', function() {
                    insertInEditor();
                });
                dialog.showPage('tab-main');
                dialog.selectPage('tab-main');
                dialog.hidePage('tab-spinner');
            });
        }
    };

    function updateView(dialog, predicate) {
        currentInsertingEl = {
            type: 'text',
            value: JSON.stringify(resourceData[predicate])
        };
        $(dialog.getContentElement('tab-main', 'contentbox').getElement().$).find('div.viewbox').html(JSON.stringify(resourceData[predicate]));
    }

    function insertInEditor() {
        if (currentInsertingEl) {
            editor.insertText(' ' + currentInsertingEl.value);
        }
    }

    function explore(url, endpoint, cb) {
        doRequest('POST', 'http://api.freme-project.eu/current/e-link/explore?resource=' + encodeURIComponent(url) + '&endpoint=' + encodeURIComponent(endpoint) + '&endpoint-type=' + endpointTypes[endpoint], null, {
            'Content-Type': 'application/json',
            'Accept': 'application/ld+json'
        }, function (results) {
            cb(null, removeContext(results)['@graph'][0]);
        }, function () {
            cb(new Error('Exploring error'));
        });
    }

    function getLabels(obj, cb) { // TODO this is getting out of hand
        var labelObj = {};
        var total = Object.keys(obj);
        var fired = false;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if(key === '@id') {
                    labelObj[key] = {
                        label: 'resource',
                        value: obj[key]
                    };
                    myCb();
                }
                else if(key === '@type') {
                    doArray(key, 'type');
                    total += obj[key].length;
                    labelObj[key] = {
                        label: 'type',
                        value: []
                    };
                    myCb();
                    for (var i = 0; i < obj[key].length; i++) {
                        if (obj[key][i].indexOf('http') !== 0) {
                            myCb();
                            continue;
                        }
                        (function(key, i) {
                            labelBase.getLabel(obj[key][i], function(err, label) {
                                labelObj[key].value.push({
                                    label: label,
                                    value: obj[key][i]
                                });
                                myCb();
                            });
                        })(key, i);
                    }
                }
                else if(key.indexOf('http') !== 0) {
                    myCb();
                }
                else {
                    if(obj[key].length) { // array
                        total += obj[key].length;
                        for (var i = 0; i < obj[key].length; i++) {
                            if (obj[key][i].indexOf('http') !== 0) {
                                myCb();
                                continue;
                            }
                            (function(key, i) {
                                labelBase.getLabel(obj[key][i], function(err, label) {
                                    labelObj[key].value.push({
                                        label: label,
                                        value: obj[key][i]
                                    });
                                    myCb();
                                });
                            })(key, i);
                        }
                    }
                }
            }
        }

        function myCb() {
            total--;
            if (total === 0 && !fired) {
                fired = true;
                return cb(null, labelObj);
            }
        }
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
        doRequest('POST', 'http://api-dev.freme-project.eu/current/e-link/documents/?informat=turtle&outformat=json-ld&templateid=' + templateId, turtle, {
            'Content-Type': 'text/turtle',
            Accept: 'application/ld+json'
        }, function (results) {
            cb(null, results);
        }, function (err) {
            cb(new Error('Templating error'));
        });
    }

    function buildOverview(editor, el, jsonld) {
        var $el = $(el);
        if (!jsonld['@graph']) {
            var newLd = {};
            newLd['@context'] = JSON.parse(JSON.stringify(jsonld['@context']));
            newLd['@graph'] = [];
            newLd['@graph'].push(JSON.parse(JSON.stringify(jsonld)));
            delete newLd['@graph']['@context'];
            jsonld = newLd;
        }
        jsonld = removeContext(jsonld);
        var properties = createProperties(jsonld);
        var html = '<dl>';
        for (var i = 0; i < properties.length; i++) {
            html += '<dt style="font-weight: bold; font-style: italic; font-size: smaller;">' + properties[i].label + '</dt>';
            for (var j = 0; j < properties[i].values.length; j++) {
                html += '<dd style="margin-left: 16px;"><span>' + properties[i].values[j] + '</span> <button class="btn">Insert</button></dd>';
            }
        }
        html += '</dl>';
        $el.empty();
        $el.html(html);
        $el.find('button').on('click', function () {
            placeCaretAfterIdentRef(editor);
            editor.insertText(' ' + $(this).parents('dd').find('span').text());
        });
    }

    function buildDataTable(editor, el, jsonld) {
        var $el = $(el);
        if (!jsonld['@graph']) {
            var newLd = {};
            newLd['@context'] = JSON.parse(JSON.stringify(jsonld['@context']));
            newLd['@graph'] = [];
            newLd['@graph'].push(JSON.parse(JSON.stringify(jsonld)));
            delete newLd['@graph']['@context'];
            jsonld = newLd;
        }
        jsonld = removeContext(jsonld);

        var labeledTriples = createLabeledTriples(jsonld);
        var html = '<table style="width: 100%;"><thead><td>Subject</td><td>Predicate</td><td>Object</td><td></td><td>Language</td></thead><tbody>';
        for (var i = 0; i < labeledTriples.length; i++) {
            html += '<tr><td>' + labeledTriples[i].s + '</td><td>' + labeledTriples[i].p + '</td><td>' + labeledTriples[i].o + '</td><td><button class="btn btn-insert-o" title="Insert object in text">&#x2191;</button><button class="btn btn-insert-po" title="Insert predicate and object in text">&#x21D1;</button></td><td>' + labeledTriples[i].lang + '</td></tr>';
        }
        html += '</tbody></table>';
        $el.empty();
        $el.html(html);
        var $table = $el.find('table');
        $table.DataTable({
            lengthChange: false,
            columnDefs: [
                {
                    "targets": [4],
                    "visible": false
                }
            ],
            initComplete: function () {
                var langColumn = this.api().column(4);
                var select = $('<select><option value=""></option></select>')
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        langColumn
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });
                $el.prepend(select);
                $el.prepend('<span>Filter on language:</span>');
                langColumn.data().unique().sort().each(function (d, j) {
                    select.append('<option value="' + d + '">' + d + '</option>')
                });
            }
        });
        $table.find('button').on('click', function () {
            var $btn = $(this);
            var tds = $btn.parents('tr').eq(0).find('td');
            var txt = tds.eq(2).text();
            if ($btn.hasClass('btn-insert-po')) {
                txt = tds.eq(1).text() + ' ' + txt;
            }
            editor.insertText(' ' + txt);
        });
        $table.on('draw.dt', function () {
            $table.find('button').on('click', function () {
                var $btn = $(this);
                var tds = $btn.parents('tr').eq(0).find('td');
                var txt = tds.eq(2).text();
                if ($btn.hasClass('btn-insert-po')) {
                    txt = tds.eq(1).text() + ' ' + txt;
                }
                editor.insertText(' ' + txt);
            });
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

    function createLabeledTriples(jsonld) {
        var labelTriples = [];
        for (var i = 0; i < jsonld['@graph'].length; i++) {
            var subject = jsonld['@graph'][i];
            if (Object.keys(subject).length <= 2) {
                continue;
            }
            for (var predicate in subject) {
                if (!subject.hasOwnProperty(predicate)) {
                    continue;
                }
                var objects = typeof subject[predicate] === 'object' ? [].concat(subject[predicate]) : [].concat({
                    '@language': 'en',
                    '@value': subject[predicate]
                });
                for (var j = 0; j < objects.length; j++) {
                    if (typeof objects[j] !== 'object') {
                        objects[j] = {'@language': 'en', '@value': objects[j]};
                    }
                    var sLabel = getLabel(subject['@id'], objects[j]['@language'], jsonld);
                    if (sLabel === 'geen label') {
                        sLabel = getLabel(subject['@id'], 'en', jsonld);
                        if (sLabel === 'geen label') {
                            sLabel = subject['@id'];
                        }
                    }
                    var pLabel = getLabel(predicate, objects[j]['@language'], jsonld);
                    if (pLabel === 'geen label') {
                        pLabel = getLabel(predicate, 'en', jsonld);
                        if (pLabel === 'geen label') {
                            pLabel = predicate;
                        }
                    }
                    var oLabel = getLabel(objects[j]['@value'], objects[j]['@language'], jsonld);
                    if (oLabel === 'geen label') {
                        oLabel = objects[j]['@value'];
                    }
                    labelTriples.push({
                        s: sLabel, p: pLabel, o: oLabel, lang: objects[j]['@language']
                    });
                }
            }
        }
        return labelTriples;
    }

    function getLabel(subject, lang, jsonld) {
        if (!labels[lang]) {
            labels[lang] = {};
        }
        if (!labels[lang][subject]) {
            labels[lang][subject] = 'geen label';
            for (var i = 0; i < jsonld['@graph'].length; i++) {
                if (jsonld['@graph'][i]['@id'] === subject) {
                    if (jsonld['@graph'][i]['http://www.w3.org/2000/01/rdf-schema#label']) {
                        var labelValues = [].concat(jsonld['@graph'][i]['http://www.w3.org/2000/01/rdf-schema#label']);
                        for (var j = 0; j < labelValues.length; j++) {
                            if (!labels[labelValues[j]['@language']]) {
                                labels[labelValues[j]['@language']] = {}
                            }
                            labels[labelValues[j]['@language']][subject] = labelValues[j]['@value'];
                        }
                    }
                }
            }
        }
        return labels[lang][subject];
    }

    function createProperties(obj) {
        var properties = {},
            key;
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            if (typeof obj[key] !== 'object') {
                obj[key] = [obj[key]];
            }
            for (var i = 0; i < obj[key].length; i++) {
                var value = obj[key][i];
                if (typeof obj[key][i] === 'object') {
                    value = obj[key][i]['@value'];
                }

                var label = labels[key] ? labels[key] : key;
                if (!properties[label]) {
                    properties[label] = {label: label, values: []};
                    properties[label].values.push(value); // DEBUG now, only the first value is kept
                    // TODO better management of this :)
                }

            }
        }
        for (key in properties) {
            if (!properties.hasOwnProperty(key)) {
                continue;
            }
            properties[key].values.sort();
        }
        properties = Object.keys(properties).map(function (key) {
            return properties[key]
        });
        properties.sort(function (a, b) {
            return a.label < b.label;
        });
        return properties;
    }

    function placeCaretAtEndOfEl(editor) {
        var sel = editor.document.getSelection();
        var range = editor.createRange();
        range.selectNodeContents(sel.getCommonAncestor());
        range.collapse(false);
        sel.selectRanges([range]);
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
