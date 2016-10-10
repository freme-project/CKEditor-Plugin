/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.plugins.add('freme', {
    init: function (editor) {
        var $ = window.$ || window.jQuery;

        if (!editor.config.extraConfig) {
            editor.config.extraConfig = {};
        }
        if (!editor.config.extraConfig.plugins) {
            editor.config.extraConfig.plugins = {};
        }
        if (!editor.config.extraConfig.plugins.freme) {
            editor.config.extraConfig.plugins.freme = {};
        }

        if (!$) {
            editor.showNotification('jQuery not found!', 'warning');
        }
        editor.addContentsCss(this.path + 'styles/style-freme.css');

        var defaultConfig = {
            $: $,
            endpoint: 'https://api.freme-project.eu/current/',
            entity: {
                languages: [['Dutch', 'NL'], ['English', 'EN'], ['French', 'FR'], ['German', 'DE'], ['Italian', 'IT'], ['Spanish', 'ES'], ['Russian', 'RU']],
                datasets: [
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
                    },
                    {
                        "Name": "europeana",
                        "label": "Cultural information",
                        "desc": "Europeana.eu is an internet portal that acts as an interface to millions of books, paintings, films, museum objects and archival records that have been digitised throughout Europe.",
                        "Description": "The Europeana.eu dataset provides all sorts of cultural information (http://europeana.eu)",
                        "TotalEntities": 3619192,
                        "CreationTime": 1467280746152
                    }
                ],
                defaults: {
                    language: 'EN',
                    dataset: 'dbpedia'
                },
                /**
                 * Templates: variables are
                 * $text: original recognized text
                 * $identifier: uri to the identified resource
                 * $class: uri to the identified class
                 * $confidence: uri to the confidence of the resource
                 */
                templates: {
                    class: '$text',
                    identifier: '$text'
                }
            },
            link: {
                templates: [
                    {
                        label: 'all',
                        id: 17,
                        properties: [
                            {
                                types: ['http://nerd.eurecom.fr/ontology#Person', 'http://dbpedia.org/ontology/Person'],
                                data: [
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
                                ]
                            },
                            {
                                types: ['http://nerd.eurecom.fr/ontology#Location', 'http://dbpedia.org/ontology/PopulatedPlace', 'http://dbpedia.org/ontology/Location'],
                                data: [
                                    ["abstract", "http://dbpedia.org/ontology/abstract"],
                                    ["thumbnail", "http://dbpedia.org/ontology/thumbnail"],
                                    ["subject", "http://purl.org/dc/terms/subject"],
                                    ["label", "http://www.w3.org/2000/01/rdf-schema#label"],
                                    ["homepage", "http://xmlns.com/foaf/0.1/homePage"],
                                    ["total population", "http://dbpedia.org/ontology/populationTotal"]
                                ]
                            }
                        ]
                    },
                    {
                        label: 'based near',
                        id: 1,
                        properties: [
                        ]
                    }
                ]
            },
            translate: {
                languages: {
                    in: [['Dutch', 'NL'], ['English', 'EN']],
                    out: {
                        'NL': [['French ', 'FR'], ['German ', 'DE'], ['English', 'EN']],
                        'EN': [['Bulgarian ', 'BG'], ['Czech ', 'CS'], ['Danish ', 'DA'], ['Dutch', 'NL'], ['Finnish ', 'FI'], ['French', 'FR'], ['German ', 'DE'], ['Greek ', 'EL'], ['Hungarian', 'HU'], ['Italian ', 'IT'], ['Polish ', 'PL'], ['Portuguese ', 'PT'], ['Romanian ', 'RO'], ['Slovenian ', 'SL'], ['Swedish ', 'SV']]
                    },
                    default: ['EN', 'DE']
                }
            }

        };

        editor.config.freme = CKEDITOR.tools.extend(editor.config.extraConfig.plugins.freme, defaultConfig);

        editor.addCommand('fremeTranslate', new CKEDITOR.dialogCommand('fremeTranslateDialog'));
        editor.ui.addButton('FremeTranslate', {
            label: 'Translate',
            command: 'fremeTranslate',
            icon: this.path + 'icons/fremeTranslate.png',
            toolbar: 'freme'
        });
        CKEDITOR.dialog.add('fremeTranslateDialog', this.path + 'dialogs/translate.js');

        editor.addCommand('fremeEntity', new CKEDITOR.dialogCommand('fremeEntityDialog', {
            allowedContent: 'span[its-ta-class-ref,its-ta-ident-ref,its-ta-confidence]'
        }));
        editor.ui.addButton('FremeEntity', {
            label: 'Detect concepts',
            command: 'fremeEntity',
            icon: this.path + 'icons/fremeEntity.png',
            toolbar: 'freme'
        });
        CKEDITOR.dialog.add('fremeEntityDialog', this.path + 'dialogs/entity.js');

        editor.addCommand('fremeLink', new CKEDITOR.dialogCommand('fremeLinkDialog'));
        editor.ui.addButton('FremeLink', {
            label: 'Get additional info',
            command: 'fremeLink',
            icon: this.path + 'icons/fremeLink.png',
            toolbar: 'freme'
        });
        CKEDITOR.dialog.add('fremeLinkDialog', this.path + 'dialogs/link.js');

        editor.on('instanceReady', function () {
            editor.commands.fremeLink.disable();
        });

        editor.on('mode', function () {
            editor.commands.fremeLink.disable();
        });

        editor.on('doubleclick', function () {
            if ($(editor.document.getSelection().getStartElement().$).attr('its-ta-ident-ref')) {
                editor.openDialog('fremeLinkDialog');
            }
        });

        editor.on('selectionChange', function () {
            if ($(editor.document.getSelection().getStartElement().$).attr('its-ta-ident-ref')) {
                editor.commands.fremeLink.enable();
            }
            else {
                editor.commands.fremeLink.disable();
            }
        });
    }
});