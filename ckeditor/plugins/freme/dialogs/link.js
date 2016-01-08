/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeLinkDialog', function (editor) {

    // TODO cache old data?
    var endpoints = [['DBPedia', 'http://dbpedia.org/sparql']];

    var templateJSON = [
        {
            "id": 1,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://live.dbpedia.org/sparql/",
            "query": "PREFIX dbpedia: <http://dbpedia.org/resource/> PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> CONSTRUCT {  ?museum <http://xmlns.com/foaf/0.1/based_near> <@@@entity_uri@@@> . } WHERE {  <@@@entity_uri@@@> geo:geometry ?citygeo .  OPTIONAL { ?museum rdf:type dbo:Museum . }  ?museum geo:geometry ?museumgeo .  FILTER (<bif:st_intersects>(?museumgeo, ?citygeo, 50)) } LIMIT 10",
            "label": "Find nearest museums",
            "description": "This template enriches with a list of museums (max 10) within a 50km radius around each location entity.",
            "endpointType": "SPARQL"
        },
        {
            "id": 2,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://live.dbpedia.org/sparql",
            "query": "PREFIX dbpedia: <http://dbpedia.org/resource/> PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> CONSTRUCT { ?event <http://dbpedia.org/ontology/place> <@@@entity_uri@@@> . } WHERE { ?event rdf:type <http://dbpedia.org/ontology/Event> .  ?event <http://dbpedia.org/ontology/place> <@@@entity_uri@@@> .  } LIMIT 10",
            "label": "Events related to a place",
            "description": "The template retrieves events (max 10) related to a place. The information is retrieved from the DBpedia live SPARQL endpoint.",
            "endpointType": "SPARQL"
        },
        {
            "id": 3,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://factforge.net/sparql",
            "query": "PREFIX geo-pos: <http://www.w3.org/2003/01/geo/wgs84_pos#> CONSTRUCT { <@@@entity_uri@@@> geo-pos:lat ?lat . <@@@entity_uri@@@> geo-pos:long ?long . } WHERE { <@@@entity_uri@@@> geo-pos:lat ?lat . <@@@entity_uri@@@> geo-pos:long ?long . }",
            "label": "dataset label",
            "description": "",
            "endpointType": "SPARQL"
        },
        {
            "id": 5,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://europeana.ontotext.com/sparql",
            "query": "PREFIX edm: <http://www.europeana.eu/schemas/edm/> PREFIX ore: <http://www.openarchives.org/ore/terms/> CONSTRUCT {  ?person  <http://rdvocab.info/ElementsGr2/placeOfBirth> <@@@entity_uri@@@> ;  } WHERE {  ?person  <http://rdvocab.info/ElementsGr2/placeOfBirth> <@@@entity_uri@@@> ;  } LIMIT 10",
            "label": "Authors born in place",
            "description": "This template enriches with a list of persons (max 10) born in locations provided in the text. This template is using Europeana SPARQL endpoint as source for information.",
            "endpointType": "SPARQL"
        },
        {
            "id": 6,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://europeana.ontotext.com/sparql",
            "query": "PREFIX dbpedia: <http://dbpedia.org/resource/> PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> CONSTRUCT { ?event <http://dbpedia.org/ontology/place> <@@@entity_uri@@@> . } WHERE { ?event rdf:type <http://dbpedia.org/ontology/@@@event_type@@@> .  ?event <http://dbpedia.org/ontology/place> <@@@entity_uri@@@> .  } LIMIT 10",
            "label": "",
            "description": "",
            "endpointType": "SPARQL"
        },
        {
            "id": 7,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://linkedgeodata.org/vsnorql/",
            "query": "PREFIX owl: <http://www.w3.org/2002/07/owl#> PREFIX ogc: <http://www.opengis.net/ont/geosparql#> PREFIX geom: <http://geovocab.org/geometry#> PREFIX lgdo: <http://linkedgeodata.org/ontology/> PREFIX bif: <http://www.openlinksw.com/schemas/bif#> CONSTRUCT {\t?s <http://xmlns.com/foaf/0.1/based_near> <@@@entity_uri@@@> . } WHERE {  ?s    a lgdo:Bakery ;    geom:geometry [ ogc:asWKT ?sg ] .   ?a    owl:sameAs <@@@entity_uri@@@> ;    geom:geometry [ ogc:asWKT ?ag ] .  Filter(bif:st_intersects(?sg, ?ag, 10)) } LIMIT 10 ",
            "label": "dataset label",
            "description": "",
            "endpointType": "SPARQL"
        },
        {
            "id": 17,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://dbpedia.org/sparql",
            "query": "PREFIX dbpedia: <http://dbpedia.org/resource/>\nPREFIX dbpedia-owl: <http://dbpedia.org/ontology/>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\nCONSTRUCT {\n  ?museum <http://xmlns.com/foaf/0.1/based_near> <@@@entity_uri@@@> .\n}\nWHERE {\n  <@@@entity_uri@@@> geo:geometry ?citygeo .\n  ?museum rdf:type <http://schema.org/Museum> .\n  ?museum geo:geometry ?museumgeo .\n  FILTER (<bif:st_intersects>(?museumgeo, ?citygeo, 10))\n} LIMIT 10",
            "label": "dataset label",
            "description": "",
            "endpointType": "SPARQL"
        },
        {
            "id": 24,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://www.freme-project.eu/ns#endpoint",
            "query": "PREFIX dbpedia: <http://dbpedia.org/resource/>\n PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>\n PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\nCONSTRUCT {\n ?restaurant <http://xmlns.com/foaf/0.1/based_near> <@@@entity_uri@@@> .\n }\n WHERE {\n <@@@entity_uri@@@>\n geo:geometry ?citygeo .\n ?restaurant rdf:type <http://schema.org/Restaurant> .\n ?restaurant geo:geometry ?restaurantgeo .\n    FILTER (<bif:st_intersects>(?restaurantgeo, ?citygeo, 10))\n} LIMIT 10",
            "label": "dataset label",
            "description": "",
            "endpointType": "SPARQL"
        },
        {
            "id": 28,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://www.freme-project.eu/ns#endpoint",
            "query": "PREFIX dbpedia: <http://dbpedia.org/resource/>\n PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>\n PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\nCONSTRUCT  ?restaurant <http://xmlns.com/foaf/0.1/based_near> <@@@entity_uri@@@> .\n }\n WHERE {\n <@@@entity_uri@@@>\n geo:geometry ?citygeo .\n ?restaurant rdf:type <http://schema.org/Restaurant> .\n ?restaurant geo:geometry ?restaurantgeo .\n    FILTER (<bif:st_intersects>(?restaurantgeo, ?citygeo, 10)) LIMIT 10",
            "label": "dataset label",
            "description": "",
            "endpointType": "SPARQL"
        },
        {
            "id": 38,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://dbpedia.org/sparql",
            "query": "PREFIX dbpedia: <http://dbpedia.org/resource/>\n PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>\n PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\n CONSTRUCT {\n   ?museum <http://xmlns.com/foaf/0.1/based_near> <@@@entity_uri@@@> .\n   } WHERE {\n     <@@@entity_uri@@@> geo:geometry ?citygeo .\n     ?museum rdf:type <http://dbpedia.org/ontology/Museum> .\n     ?museum geo:geometry ?museumgeo .\n     FILTER (<bif:st_intersects>(?museumgeo, ?citygeo, 10))\n } LIMIT 10",
            "label": "dataset label",
            "description": "",
            "endpointType": "SPARQL"
        },
        {
            "id": 41,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://dbpedia.org/sparql",
            "query": "PREFIX dbo: <http://dbpedia.org/ontology/> \nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \nPREFIX foaf: <http://xmlns.com/foaf/0.1/> \nPREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \nPREFIX dbp: <http://dbpedia.org/property/> \nSELECT ?p ?o \nWHERE \n{  \nOPTIONAL {<@@@entity_uri@@@> ?p ?o } .   \nFILTER ((!isLiteral(?o) || lang(?o)=\"\" || langMatches(lang(?o), \"@@@language@@@\") ) &&        \n(?p in (dbo:abstract, rdfs:comment, foaf:depiction, foaf:isPrimaryTopicOf, foaf:homepage, dbo:birthDate, dbo:deathDate, dbo:hometown, dbo:birthPlace, dbo:deathPlace, dc:description, <http://dbpedia.org/ontology/PopulatedPlace/areaTotal>, dbo:populationTotal, geo:lat, geo:long, dbp:type, dbp:location, rdfs:label)) ) . \n}",
            "label": "dataset label",
            "description": "",
            "endpointType": "SPARQL"
        },
        {
            "id": 43,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://dbpedia.org/sparql",
            "query": "PREFIX dbo: <http://dbpedia.org/ontology/> \nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \nPREFIX foaf: <http://xmlns.com/foaf/0.1/> \nPREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \nPREFIX dbp: <http://dbpedia.org/property/> \nPREFIX dc: <http://purl.org/dc/elements/1.1/> \nSELECT ?p ?o \nWHERE \n{  \nOPTIONAL {<@@@entity_uri@@@> ?p ?o } .   \nFILTER ((!isLiteral(?o) || lang(?o)=\"\" || langMatches(lang(?o), \"@@@language@@@\") ) &&        \n(?p in (dbo:abstract, rdfs:comment, foaf:depiction, foaf:isPrimaryTopicOf, foaf:homepage, dbo:birthDate, dbo:deathDate, dbo:hometown, dbo:birthPlace, dbo:deathPlace, dc:description, <http://dbpedia.org/ontology/PopulatedPlace/areaTotal>, dbo:populationTotal, geo:lat, geo:long, dbp:type, dbp:location, rdfs:label)) ) . \n}",
            "label": "dataset label",
            "description": "",
            "endpointType": "SPARQL"
        },
        {
            "id": 70,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://dbpedia.org/sparql/",
            "query": "PREFIX dbpedia: <http://dbpedia.org/resource/> PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> CONSTRUCT {   <@@@entity_uri@@@> <http://purl.org/dc/terms/subject> ?subject .  ?subject rdfs:label ?subjlabel . } WHERE {    <@@@entity_uri@@@> rdf:type dbo:Location .   <@@@entity_uri@@@> <http://purl.org/dc/terms/subject> ?subject .  ?subject rdfs:label ?subjlabel . }",
            "label": "Retrieve Entity subjects",
            "description": "This templates retrieves all subjects assigned for the entitiy.",
            "endpointType": "SPARQL"
        },
        {
            "id": 76,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://dbpedia.org/sparql",
            "query": "PREFIX dbo: <http://dbpedia.org/ontology/> \nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \nPREFIX foaf: <http://xmlns.com/foaf/0.1/> \nPREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \nPREFIX dbp: <http://dbpedia.org/property/> \nPREFIX dc: <http://purl.org/dc/elements/1.1/> \nCONSTRUCT {<@@@entity_uri@@@> ?p ?o } \nWHERE \n{  \nOPTIONAL {<@@@entity_uri@@@> ?p ?o } .   \nFILTER ((!isLiteral(?o) || lang(?o)=\"\" || langMatches(lang(?o), \"@@@language@@@\") ) &&        \n(?p in (dbo:abstract, rdfs:comment, dbo:thumbnail, foaf:depiction, foaf:isPrimaryTopicOf, foaf:homepage, dbo:birthDate, dbo:deathDate, dbo:hometown, dbo:birthPlace, dbo:deathPlace, dc:description, <http://dbpedia.org/ontology/PopulatedPlace/areaTotal>, dbo:populationTotal, geo:lat, geo:long, dbp:type, dbp:location, rdfs:label)) ) . \n}",
            "label": "Ocelot Template",
            "description": "Ocelot Template description",
            "endpointType": "SPARQL"
        },
        {
            "id": 300,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://rv2622.1blu.de:8890/sparql/",
            "query": "CONSTRUCT {  <@@@entity_uri@@@> <http://purl.org/dc/terms/subject> ?category .  ?category <http://freme-project.eu/ns#info> ?info .  ?category <http://www.w3.org/2000/01/rdf-schema#label> ?label } WHERE { <@@@entity_uri@@@> <http://purl.org/dc/terms/subject> ?category .  ?category <http://freme-project.eu/ns#info> ?info . ?category <http://www.w3.org/2000/01/rdf-schema#label> ?label }",
            "label": "DBpedia Categories",
            "description": "DBpedia Categories",
            "endpointType": "SPARQL"
        },
        {
            "id": 301,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://rv2622.1blu.de:5000/dbpedia-types",
            "query": "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> CONSTRUCT {   <@@@entity_uri@@@> rdf:type ?type . } WHERE {  <@@@entity_uri@@@> rdf:type ?type }",
            "label": "the title of the template",
            "description": "a description of the template",
            "endpointType": "LDF"
        },
        {
            "id": 302,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://live.dbpedia.org/sparql",
            "query": "PREFIX dbpedia: <http://dbpedia.org/resource/> PREFIX dbo: <http://dbpedia.org/ontology/> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> CONSTRUCT {   ?museum <http://xmlns.com/foaf/0.1/based_near> <@@@entity_uri@@@> . } WHERE {  <@@@entity_uri@@@> geo:geometry ?citygeo .  OPTIONAL { ?museum rdf:type dbo:Museum . }  ?museum geo:geometry ?museumgeo .  FILTER (<bif:st_intersects>(?museumgeo, ?citygeo, 50)) } LIMIT 10",
            "label": "the title of the template",
            "description": "a description of the template",
            "endpointType": "SPARQL"
        },
        {
            "id": 304,
            "creationTime": 0,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://europeana.ontotext.com/sparql",
            "query": "PREFIX edm: <http://www.europeana.eu/schemas/edm/> PREFIX ore: <http://www.openarchives.org/ore/terms/> CONSTRUCT {  ?object <http://purl.org/dc/elements/1.1/creator> <@@@entity_uri@@@> ; . } WHERE {  ?object <http://purl.org/dc/elements/1.1/creator> <@@@entity_uri@@@> ; .} LIMIT 10",
            "label": "Retrieve objects created by a person",
            "description": "This template retrieves objects created by a person. The information is retrieved from the Europeana's SPARQL endpoint.",
            "endpointType": "SPARQL"
        },
        {
            "id": 4433,
            "creationTime": 1446056467753,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://dbpedia.org/sparql/",
            "query": "PREFIX dbpedia:  PREFIX dbpedia-owl: PREFIX rdf: PREFIX geo: CONSTRUCT { ?museum <@@@entity_uri@@@> . } WHERE { <@@@entity_uri@@@> geo:geometry ?citygeo . ?museum rdf:type  . ?museum geo:geometry ?museumgeo . FILTER ((?museumgeo, ?citygeo, 10)) } LIMIT 10",
            "label": "template title",
            "description": "template description",
            "endpointType": "SPARQL"
        },
        {
            "id": 4447,
            "creationTime": 1446716795534,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://rv2622.1blu.de:5000/dbpedia-categories",
            "query": "CONSTRUCT {  <@@@entity_uri@@@> <http://purl.org/dc/terms/subject> ?category .  ?category <http://www.w3.org/2000/01/rdf-schema#label> ?label } WHERE { <@@@entity_uri@@@> <http://purl.org/dc/terms/subject> ?category . ?category <http://www.w3.org/2000/01/rdf-schema#label> ?label }",
            "label": "DBpedia Categories via LDF",
            "description": "This template is using a Linked Data Frament endpoint to fetch DBpedia categories for a DBpedia resource.",
            "endpointType": "LDF"
        },
        {
            "id": 4448,
            "creationTime": 1447063868052,
            "owner": {
                "name": "asdfasdf",
                "role": "ROLE_USER"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://linkedgeodata.org/vsnorql",
            "query": "  PREFIX owl: <http://www.w3.org/2002/07/owl# >\tPREFIX ogc: <http://www.opengis.net/ont/geosparql# >\tPREFIX geom: <http://geovocab.org/geometry# >\tPREFIX lgdo: <http://linkedgeodata.org/ontology/ >\tCONSTRUCT {\t?s <http://xmlns.com/foaf/0.1/based_near > <@@@entity_uri@@@ > .\t} WHERE {\t?s\ta lgdo:Bakery ;\tgeom:geometry [ ogc:asWKT ?sg ] .\t?a\towl:sameAs <@@@entity_uri@@@ > ;\tgeom:geometry [ ogc:asWKT ?ag ] .\tFILTER(bif:st_intersects(?sg, ?ag, 10))\t} LIMIT 10 ",
            "label": "Linked Geo Data",
            "description": "Retrieve all bakeries 10km close to a place.",
            "endpointType": "SPARQL"
        },
        {
            "id": 4449,
            "creationTime": 1447171912618,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://rv2622.1blu.de:5000/geonames-foa-mappings",
            "query": "CONSTRUCT {  <@@@entity_uri@@@> <http://www.w3.org/2002/07/owl#sameAs> ?link . } WHERE {  <@@@entity_uri@@@> <http://www.w3.org/2002/07/owl#sameAs> ?link }",
            "label": "FOA sameAs link for GeoNames",
            "description": "This template returns FOA link for given GeoNames link.",
            "endpointType": "LDF"
        },
        {
            "id": 4450,
            "creationTime": 1447246904099,
            "owner": {
                "name": "admin",
                "role": "ROLE_ADMIN"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://rv2622.1blu.de:5000/mcafee",
            "query": "CONSTRUCT {  <@@@entity_uri@@@> <http://vistatec.com/relatedTo> ?product . } WHERE {  <@@@entity_uri@@@> <http://vistatec.com/relatedTo> ?product . }",
            "label": "Find related products",
            "description": "This template is using the Mcafee dataset to find related products.",
            "endpointType": "LDF"
        },
        {
            "id": 4451,
            "creationTime": 1447835149962,
            "owner": {
                "name": "semanticbook",
                "role": "ROLE_USER"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://dbpedia.org/sparql/",
            "query": "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT * WHERE { <@@@entity_uri@@@> rdfs:comment ?comment .}",
            "label": "Semantic Book Comments",
            "description": "This template is used in step of the creation of the Semantic Book.",
            "endpointType": "SPARQL"
        },
        {
            "id": 4452,
            "creationTime": 1447835954505,
            "owner": {
                "name": "semanticbook",
                "role": "ROLE_USER"
            },
            "visibility": "PUBLIC",
            "endpoint": "http://dbpedia.org/sparql/",
            "query": "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> CONSTRUCT { <@@@entity_uri@@@> rdfs:comment ?comment } WHERE { <@@@entity_uri@@@> rdfs:comment ?comment .}",
            "label": "Semantic Book Comments",
            "description": "This template is used in step of the creation of the Semantic Book.",
            "endpointType": "SPARQL"
        }
    ];
    var templates = [];
    var labels = {};
    for (var i = 0; i < templateJSON.length; i++) {
        var t = templateJSON[i];
        if (t.description !== '') {
            templates.push([t.description, t.id]);
        }
    }

    function fetchTemplate(sourceText, lang, dataset, cb) {
        // TODO
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
        title: 'FREME Link',
        minWidth: 400,
        minHeight: 200,
        buttons: [CKEDITOR.dialog.okButton],
        contents: [
            {
                id: 'tab-main',
                label: 'Main info',
                elements: [
                    {
                        type: 'html',
                        id: 'text-entity',
                        html: '<p>Entity: <span></span></p>'
                    },
                    {
                        type: 'html',
                        id: 'text-type',
                        html: '<p>Type: <span></span></p>'
                    },
                    {
                        type: 'html',
                        id: 'text-resource',
                        html: '<p>Resource: <span></span></p>'
                    }
                ]
            },
            //{
            //    id: 'tab-template',
            //    label: 'Template Selection',
            //    elements: [
            //        {
            //            type: 'select',
            //            id: 'template',
            //            label: 'Template',
            //            items: templates,
            //            default: 'basic'
            //        },
            //        {
            //            type: 'button',
            //            id: 'template-do',
            //            label: 'Fetch data',
            //            title: 'Fetch data',
            //            onClick: function () {
            //                console.log('TO BE IMPLEMENTED');
            //                //fetchTemplate(this.getDialog().getValueOf('tab-template', 'template'), function(err, turtle) {
            //                //    if (err) {
            //                //        return console.log(err);
            //                //    }
            //                //});
            //            }
            //        },
            //        {
            //            type: 'html',
            //            id: 'template-output',
            //            html: '<pre><code></code></pre>'
            //        }
            //        // TODO button
            //    ]
            //},
            {
                id: 'tab-explore',
                label: 'Explore resource',
                elements: [
                    {
                        type: 'select',
                        id: 'endpoint',
                        label: 'Endpoint',
                        items: endpoints,
                        default: 'http://dbpedia.org/sparql'
                    },
                    {
                        type: 'button',
                        id: 'explore-do',
                        label: 'Explore',
                        title: 'Explore',
                        onClick: function () {
                            var dialog = this.getDialog();
                            var url = $(dialog.getContentElement('tab-main', 'text-resource').getElement().$).find('span').text();
                            var endpoint = dialog.getValueOf('tab-explore', 'endpoint');
                            explore(url, endpoint, function (err, obj) {
                                buildOverview(editor, dialog.getContentElement('tab-explore', 'explore-output').getElement().$, obj);
                            });
                        }
                    },
                    {
                        type: 'html',
                        id: 'explore-output',
                        html: '<div style="max-width: 25vw; max-height: 60vh; overflow: auto"></div>'
                    }
                ]
            }

        ],
        onShow: function () {
            var $el = $(editor.document.getSelection().getStartElement().$);
            var text = $el.text();
            var type = $el.attr('its-ta-class-ref');
            var resource = $el.attr('its-ta-ident-ref');
            this.getContentElement('tab-main', 'text-entity').getElement().getElementsByTag('span').getItem(0).setText(text);
            this.getContentElement('tab-main', 'text-type').getElement().getElementsByTag('span').getItem(0).setText(type);
            this.getContentElement('tab-main', 'text-resource').getElement().getElementsByTag('span').getItem(0).setText(resource);
            this.getContentElement('tab-explore', 'explore-output').getElement().$.innerHTML = '';
        }
    };

    function explore(url, endpoint, cb) {
        doRequest('POST', 'http://api.freme-project.eu/current/e-link/explore?resource=' + encodeURIComponent(url) + '&endpoint=' + encodeURIComponent(endpoint) + '&endpoint-type=sparql', null, {
            'Content-Type': 'application/json',
            'Accept': 'application/ld+json'
        }, function (results) {
            cb(null, results)
        }, function () {
            cb(new Error('Exploring error'));
        });
    }

    function buildOverview(editor, el, jsonld) {
        /*jsonld = {
         "@id": "http://dbpedia.org/resource/Ai_Weiwei",
         "@type": [
         "http://dbpedia.org/class/yago/Charter08Signatories",
         "http://dbpedia.org/class/yago/Object100002684",
         "http://dbpedia.org/class/yago/Dissenter110018021",
         "http://dbpedia.org/class/yago/Prisoner110476086",
         "http://dbpedia.org/class/yago/Militant110315837",
         "http://dbpedia.org/class/yago/ChineseArchitects",
         "http://dbpedia.org/class/yago/ChineseContemporaryArtists",
         "http://www.w3.org/2002/07/owl#Thing",
         "http://dbpedia.org/class/yago/Creator109614315",
         "http://dbpedia.org/class/yago/Reformer110515194",
         "http://dbpedia.org/class/yago/PhysicalEntity100001930",
         "http://dbpedia.org/class/yago/Alumnus109786338",
         "http://schema.org/Person",
         "http://dbpedia.org/class/yago/YagoLegalActor",
         "http://dbpedia.org/class/yago/PrisonersAndDetaineesOfThePeople'sRepublicOfChina",
         "http://dbpedia.org/class/yago/Intellectual109621545",
         "http://xmlns.com/foaf/0.1/Person",
         "http://dbpedia.org/class/yago/YagoLegalActorGeo",
         "http://dbpedia.org/ontology/Artist",
         "http://dbpedia.org/class/yago/BeijingFilmAcademyAlumni",
         "http://dbpedia.org/class/yago/Whole100003553",
         "http://dbpedia.org/ontology/Agent",
         "http://dbpedia.org/class/yago/ArtistsFromBeijing",
         "http://dbpedia.org/class/yago/ChineseArtists",
         "http://dbpedia.org/class/yago/Person100007846",
         "http://dbpedia.org/class/yago/ChineseDissidents",
         "http://dbpedia.org/class/yago/Architect109805475",
         "http://dbpedia.org/class/yago/LivingThing100004258",
         "http://dbpedia.org/class/yago/Signer110597234",
         "http://dbpedia.org/class/yago/LivingPeople",
         "http://dbpedia.org/class/yago/ChineseDemocracyActivists",
         "http://dbpedia.org/ontology/Person",
         "http://dbpedia.org/class/yago/Disputant109615465",
         "http://www.wikidata.org/entity/Q215627",
         "http://www.wikidata.org/entity/Q483501",
         "http://dbpedia.org/class/yago/Artist109812338",
         "http://dbpedia.org/class/yago/CausalAgent100007347",
         "http://dbpedia.org/class/yago/Unfortunate109630641",
         "http://www.wikidata.org/entity/Q5",
         "http://dbpedia.org/class/yago/Organism100004475",
         "http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#Agent",
         "http://dbpedia.org/class/yago/Scholar110557854",
         "http://www.ontologydesignpatterns.org/ont/dul/DUL.owl#NaturalPerson"
         ],
         "abstract": [
         {
         "@language": "ru",
         "@value": "Ай Вэйвэй (кит. 艾未未; 28 августа 1957, Пекин, Китай) — китайский современный художник и архитектор, куратор и критик, основатель и директор «China Art Archive & Warehouse». В рейтинге за 2011 год «Сто самых влиятельных персон в арт-мире», составляемом журналом «ArtReview», Ай Вэйвэй занял первое место. По версии журнала «Time», он занимает 24-ю строчку в списке самых влиятельных людей мира."
         },
         {
         "@language": "ja",
         "@value": "艾 未未（がい みみ、アイ・ウェイウェイ）は中華人民共和国の現代美術家・キュレーター・建築家・文化評論家・社会評論家。中国の現代美術がまだ始まったばかりの1980年代から美術家として活躍し、中国の美術および美術評論を先導して世界各地で活動してきた。一方で、社会運動にも力を入れている。妻は芸術家の路青（ルー・チン、Lu Qing）。"
         },
         {
         "@language": "pl",
         "@value": "Ai Weiwei (ur. 1957 w Pekinie) – chiński artysta, kurator i architekt. Współtwórca chińskiego Stadionu Narodowego w Pekinie.Był zaangażowany w ujawnienie szeregu nadużyć przy budowie szkół, które zawaliły się podczas trzęsienia ziemi w prowincji Syczuan w 2008 roku."
         },
         {
         "@language": "en",
         "@value": "Ai Weiwei (Chinese: 艾未未; pinyin: Ài Wèiwèi, About this sound English pronunciation ; born 28 August 1957 in Beijing) is a Chinese contemporary artist and activist. Ai collaborated with Swiss architects Herzog & de Meuron as the artistic consultant on the Beijing National Stadium for the 2008 Olympics. As a political activist, he has been highly and openly critical of the Chinese Government's stance on democracy and human rights. He has investigated government corruption and cover-ups, in particular the Sichuan schools corruption scandal following the collapse of so-called \"tofu-dreg schools\" in the 2008 Sichuan earthquake. In 2011, following his arrest at Beijing Capital International Airport on 3 April, he was held for 81 days without any official charges being filed; officials alluded to their allegations of \"economic crimes\"."
         },
         {
         "@language": "fr",
         "@value": "Ai Weiwei (chinois : 艾未未), né le 18 mai 1957 à Pékin, est un des artistes majeurs de la scène artistique indépendante chinoise, à la fois sculpteur, performer, photographe, architecte, commissaire d'exposition et blogueur.Il est le fils du poète et intellectuel Ai Qing (1910-1996), et demi-frère du peintre Ai Xuan. Il est marié à l'artiste Lu Qing. Il a un fils, Ai Lao.Architecte, il a été conseiller artistique pour le cabinet d'architecture suisse Herzog & de Meuron lors de la réalisation du stade national de Pékin construit pour les Jeux olympiques d'été de 2008.Il est l'un des 303 intellectuels chinois signataires de la Charte 08. Dans son classement annuel, le magazine Art Review l'a désigné comme la figure la plus puissante de l'art contemporain en 2011 : « Son militantisme a rappelé comment l'art peut atteindre une large audience et se connecter au monde réel ».Ai Weiwei a été arrêté par la police le 3 avril 2011, officiellement pour évasion fiscale, et libéré sous caution le 22 juin 2011, après 81 jours d'enfermement dans un lieu inconnu et des conditions dégradantes, ce qui avait soulevé une vague d'indignation à travers le monde. Il reste en liberté conditionnelle et ne peut quitter Pékin sans autorisation."
         },
         {
         "@language": "nl",
         "@value": "Ai Weiwei (Peking, 18 mei 1957) is een Chinees conceptueel kunstenaar, politiek activist en filosoof. Hij is veelzijdig en ook actief in andere kunstvormen, zoals architectuur, fotografie en film. Ai verbindt de traditionele Chinese cultuur met zijn persoonlijke beeldtaal. Hij staat bekend om zijn kritiek op de sociale en culturele veranderingen in zijn land. Weiwei is beïnvloed door het Dadaïsme van Marcel Duchamp. Bij het bekritiseren van de mensenrechtsituatie, de economische uitbuiting en de milieuvervuiling maakt hij intensief gebruik van het internet (een blog die dagelijks door tienduizend mensen werd gelezen) en Twitter om te communiceren. Hij is begin 2011 in de problemen geraakt vanwege zijn kritiek op de Chinese regering. Formeel is hij beschuldigd van belastingontduiking."
         },
         {
         "@language": "de",
         "@value": "Ai Weiwei (chinesisch 艾未未, Pinyin Ài Wèiwèi, * 28. August 1957 in Peking) ist ein chinesischer Konzeptkünstler, Bildhauer und Kurator. Er ist der Sohn des Dichters und Malers Ai Qing und Halbbruder des Malers Ai Xuan. Nach regierungskritischen Äußerungen im Rahmen der Proteste in China 2011 war er seit dem 3. April 2011 an einem unbekannten Ort in Haft. Ihm wurde ein Wirtschaftsdelikt vorgeworfen. Der Sprecher des Außenministeriums Hong Wei erklärte: „Provokante Menschen wie Ai Weiwei muss man im Zaum halten.“ Am 22. Juni 2011 wurde Ai Weiwei unter strengen Auflagen und gegen Kaution freigelassen."
         },
         {
         "@language": "es",
         "@value": "Ai Weiwei (chino: 艾未未, pinyin: Ài Wèiwèi) (Pekín, 28 de agosto de 1957) es un artista chino, diseñador arquitectónico, comentarista y activista social."
         },
         {
         "@language": "pt",
         "@value": "Ai Weiwei (Pequim, 28 de agosto de 1957) é um artista chinês, designer arquitetônico, artista plástico, pintor, comentarista e ativista social."
         },
         {
         "@language": "zh",
         "@value": "艾未未（1957年5月18日－），本姓蔣，原名蔣未未，筆名艾未未。祖籍浙江省金華府金華縣畈田蒋村(今属浙江省金華市金東區)，生于北京，中華人民共和國艺术家兼異議人士，曾在美國居留12年，活躍於建築、艺术、影像、推特和社會文化評論领域。艾未未是积极的行动者，他认为行为即艺术，即自由表达。"
         },
         {
         "@language": "ar",
         "@value": "(Ai Weiwei) ولد في 18 أيار سنة 1957, وهو فنان صيني معاصر, مجالات عمله النحت والتنصيب والعمارة والتقييم والتصوير والسينما والنقد الاجتماعي والسياسي والثقافي. ساهم آي مع المعماريين السويسريين هيرزوغ ودي ميرون كمستشار فني في بناء ملعب بكين الوطني المشيد من أجل بطولة 2008. كناشط سياسي, يعتبر آي ويوي ناقداً بارزاً لمواقف الحكومة الصينية المتعلقة بالديمقراطية وحقوق الإنسان. حقق في فساد الحكومة وخباياها, خصوصاً في فضيحة المدارس المتضررة في زلزال سيشوان. وقد قامت السلطات الصينية باعتقاله سنة 2011 في مطار بكين في الثالث من نيسان حيث احتجز لأكثر من شهرين دون توجيه أي تهمة رسمية ضده بحجة ارتكاب ما سمته بجرائم اقتصادية. صنفته مجلة \"آرت ريفيو\" الشهيرة في تشرين الأول سنة 2011 على رأس قائمتها السنوية لأكثر الفنانين قوة وتأثيراً. غير أن الحكومة الصينية انتقدت هذا التصنيف. وجاء رد وزير الخارجية الصيني كالتالي: \" في الصين فنانين أكثر كفاءة. ونحن نرى أن تصنيفاً مبنياً على أسس سياسية قرار ينتهك أهداف المجلة.\"بوابة أعلام بوابة أعلام"
         }
         ],
         "http://dbpedia.org/ontology/birthDate": {
         "@type": "http://www.w3.org/2001/XMLSchema#date",
         "@value": "1957-08-28"
         },
         "birthYear": "1957",
         "http://dbpedia.org/ontology/viafId": "96607499",
         "wikiPageExternalLink": [
         "http://www.aiweiwei.com",
         "http://www.aok.dk/udstilling/se-verdens-allerbedste-billeder-i-koebenhavn#slide-16",
         "http://aiflowers.org/",
         "http://fakecase.com/",
         "http://weiweicam.com/",
         "http://www.spiegel.de/international/world/chinese-artist-ai-weiwei-discusses-efforts-in-china-to-monitor-him-a-943719.html"
         ],
         "http://dbpedia.org/ontology/wikiPageID": 8572928,
         "http://dbpedia.org/ontology/wikiPageRevisionID": 645615321,
         "align": {
         "@language": "en",
         "@value": "right"
         },
         "bgcolour": {
         "@language": "en",
         "@value": "#6495ED"
         },
         "birthDate": "1957-08-28",
         "birthPlace": {
         "@language": "en",
         "@value": "Beijing, China"
         },
         "c": {
         "@language": "en",
         "@value": "艾未未"
         },
         "caption": {
         "@language": "en",
         "@value": "Re:publica, 2013+ interview with Ai Weiwei"
         },
         "dateOfBirth": "1957-08-28",
         "hasPhotoCollection": "http://wifo5-03.informatik.uni-mannheim.de/flickrwrappr/photos/Ai_Weiwei",
         "image": "http://www.aok.dk/udstilling/se-verdens-allerbedste-billeder-i-koebenhavn#slide-16",
         "image:size": 220,
         "http://dbpedia.org/property/name": [
         {
         "@language": "en",
         "@value": "Ai Weiwei"
         },
         {
         "@language": "en",
         "@value": "Ai, Weiwei"
         }
         ],
         "nationality": {
         "@language": "en",
         "@value": "Chinese"
         },
         "p": {
         "@language": "en",
         "@value": "Ài Wèiwèi"
         },
         "placeOfBirth": {
         "@language": "en",
         "@value": "Beijing, China"
         },
         "shortDescription": {
         "@language": "en",
         "@value": "Chinese artist"
         },
         "spouse": {
         "@language": "en",
         "@value": "Lu Qing"
         },
         "wordnet_type": "http://www.w3.org/2006/03/wn/wn20/instances/synset-artist-noun-1",
         "works": {
         "@language": "en",
         "@value": "Sunflower Seeds, Beijing National Stadium"
         },
         "description": [
         {
         "@language": "en",
         "@value": "Chinese artist"
         },
         "Chinese artist"
         ],
         "subject": [
         "http://dbpedia.org/resource/Category:Ai_Weiwei",
         "http://dbpedia.org/resource/Category:Chinese_anti-communists",
         "http://dbpedia.org/resource/Category:Chinese_democracy_activists",
         "http://dbpedia.org/resource/Category:Weiquan_movement",
         "http://dbpedia.org/resource/Category:Beijing_Film_Academy_alumni",
         "http://dbpedia.org/resource/Category:1957_births",
         "http://dbpedia.org/resource/Category:Parsons_The_New_School_for_Design_alumni",
         "http://dbpedia.org/resource/Category:Victims_of_human_rights_abuses",
         "http://dbpedia.org/resource/Category:Charter_08_signatories",
         "http://dbpedia.org/resource/Category:Chinese_dissidents",
         "http://dbpedia.org/resource/Category:Chinese_performance_artists",
         "http://dbpedia.org/resource/Category:Political_artists",
         "http://dbpedia.org/resource/Category:Living_people",
         "http://dbpedia.org/resource/Category:Art_Students_League_of_New_York_alumni",
         "http://dbpedia.org/resource/Category:Prisoners_and_detainees_of_the_People's_Republic_of_China",
         "http://dbpedia.org/resource/Category:Artists_from_Beijing",
         "http://dbpedia.org/resource/Category:Articles_containing_video_clips",
         "http://dbpedia.org/resource/Category:Chinese_contemporary_artists",
         "http://dbpedia.org/resource/Category:Chinese_architects"
         ],
         "hasRank": "_:b0",
         "comment": [
         {
         "@language": "en",
         "@value": "Ai Weiwei (Chinese: 艾未未; pinyin: Ài Wèiwèi, About this sound English pronunciation ; born 28 August 1957 in Beijing) is a Chinese contemporary artist and activist. Ai collaborated with Swiss architects Herzog & de Meuron as the artistic consultant on the Beijing National Stadium for the 2008 Olympics. As a political activist, he has been highly and openly critical of the Chinese Government's stance on democracy and human rights."
         },
         {
         "@language": "zh",
         "@value": "艾未未（1957年5月18日－），本姓蔣，原名蔣未未，筆名艾未未。祖籍浙江省金華府金華縣畈田蒋村(今属浙江省金華市金東區)，生于北京，中華人民共和國艺术家兼異議人士，曾在美國居留12年，活躍於建築、艺术、影像、推特和社會文化評論领域。艾未未是积极的行动者，他认为行为即艺术，即自由表达。"
         },
         {
         "@language": "ar",
         "@value": "(Ai Weiwei) ولد في 18 أيار سنة 1957, وهو فنان صيني معاصر, مجالات عمله النحت والتنصيب والعمارة والتقييم والتصوير والسينما والنقد الاجتماعي والسياسي والثقافي. ساهم آي مع المعماريين السويسريين هيرزوغ ودي ميرون كمستشار فني في بناء ملعب بكين الوطني المشيد من أجل بطولة 2008. كناشط سياسي, يعتبر آي ويوي ناقداً بارزاً لمواقف الحكومة الصينية المتعلقة بالديمقراطية وحقوق الإنسان. حقق في فساد الحكومة وخباياها, خصوصاً في فضيحة المدارس المتضررة في زلزال سيشوان."
         },
         {
         "@language": "nl",
         "@value": "Ai Weiwei (Peking, 18 mei 1957) is een Chinees conceptueel kunstenaar, politiek activist en filosoof. Hij is veelzijdig en ook actief in andere kunstvormen, zoals architectuur, fotografie en film. Ai verbindt de traditionele Chinese cultuur met zijn persoonlijke beeldtaal. Hij staat bekend om zijn kritiek op de sociale en culturele veranderingen in zijn land. Weiwei is beïnvloed door het Dadaïsme van Marcel Duchamp."
         },
         {
         "@language": "ru",
         "@value": "Ай Вэйвэй (кит. 艾未未; 28 августа 1957, Пекин, Китай) — китайский современный художник и архитектор, куратор и критик, основатель и директор «China Art Archive & Warehouse». В рейтинге за 2011 год «Сто самых влиятельных персон в арт-мире», составляемом журналом «ArtReview», Ай Вэйвэй занял первое место. По версии журнала «Time», он занимает 24-ю строчку в списке самых влиятельных людей мира."
         },
         {
         "@language": "es",
         "@value": "Ai Weiwei (chino: 艾未未, pinyin: Ài Wèiwèi) (Pekín, 28 de agosto de 1957) es un artista chino, diseñador arquitectónico, comentarista y activista social."
         },
         {
         "@language": "fr",
         "@value": "Ai Weiwei (chinois : 艾未未), né le 18 mai 1957 à Pékin, est un des artistes majeurs de la scène artistique indépendante chinoise, à la fois sculpteur, performer, photographe, architecte, commissaire d'exposition et blogueur.Il est le fils du poète et intellectuel Ai Qing (1910-1996), et demi-frère du peintre Ai Xuan. Il est marié à l'artiste Lu Qing."
         },
         {
         "@language": "ja",
         "@value": "艾 未未（がい みみ、アイ・ウェイウェイ）は中華人民共和国の現代美術家・キュレーター・建築家・文化評論家・社会評論家。中国の現代美術がまだ始まったばかりの1980年代から美術家として活躍し、中国の美術および美術評論を先導して世界各地で活動してきた。一方で、社会運動にも力を入れている。妻は芸術家の路青（ルー・チン、Lu Qing）。"
         },
         {
         "@language": "de",
         "@value": "Ai Weiwei (chinesisch 艾未未, Pinyin Ài Wèiwèi, * 28. August 1957 in Peking) ist ein chinesischer Konzeptkünstler, Bildhauer und Kurator. Er ist der Sohn des Dichters und Malers Ai Qing und Halbbruder des Malers Ai Xuan. Nach regierungskritischen Äußerungen im Rahmen der Proteste in China 2011 war er seit dem 3. April 2011 an einem unbekannten Ort in Haft. Ihm wurde ein Wirtschaftsdelikt vorgeworfen."
         },
         {
         "@language": "pt",
         "@value": "Ai Weiwei (Pequim, 28 de agosto de 1957) é um artista chinês, designer arquitetônico, artista plástico, pintor, comentarista e ativista social."
         },
         {
         "@language": "pl",
         "@value": "Ai Weiwei (ur. 1957 w Pekinie) – chiński artysta, kurator i architekt. Współtwórca chińskiego Stadionu Narodowego w Pekinie.Był zaangażowany w ujawnienie szeregu nadużyć przy budowie szkół, które zawaliły się podczas trzęsienia ziemi w prowincji Syczuan w 2008 roku."
         }
         ],
         "label": [
         {
         "@language": "zh",
         "@value": "艾未未"
         },
         {
         "@language": "ja",
         "@value": "艾未未"
         },
         {
         "@language": "ar",
         "@value": "آي ويوي"
         },
         {
         "@language": "nl",
         "@value": "Ai Weiwei"
         },
         {
         "@language": "fr",
         "@value": "Ai Weiwei"
         },
         {
         "@language": "it",
         "@value": "Ai Weiwei"
         },
         {
         "@language": "pl",
         "@value": "Ai Weiwei"
         },
         {
         "@language": "es",
         "@value": "Ai Weiwei"
         },
         {
         "@language": "pt",
         "@value": "Ai Weiwei"
         },
         {
         "@language": "de",
         "@value": "Ai Weiwei"
         },
         {
         "@language": "en",
         "@value": "Ai Weiwei"
         },
         {
         "@language": "ru",
         "@value": "Ай Вэйвэй"
         }
         ],
         "seeAlso": "http://dbpedia.org/resource/Free_Ai_Weiwei_street_art_campaign",
         "sameAs": [
         "http://id.dbpedia.org/resource/Ai_Weiwei",
         "http://it.dbpedia.org/resource/Ai_Weiwei",
         "http://pt.dbpedia.org/resource/Ai_Weiwei",
         "http://es.dbpedia.org/resource/Ai_Weiwei",
         "http://pl.dbpedia.org/resource/Ai_Weiwei",
         "http://cs.dbpedia.org/resource/Aj_Wej-wej",
         "http://nl.dbpedia.org/resource/Ai_Weiwei",
         "http://yago-knowledge.org/resource/Ai_Weiwei",
         "http://ja.dbpedia.org/resource/艾未未",
         "http://fr.dbpedia.org/resource/Ai_Weiwei",
         "http://sw.cyc.com/concept/Mx4rurLsFOT_QNuLYNdyeZjzEw",
         "http://rdf.freebase.com/ns/m.0278dyq",
         "http://ko.dbpedia.org/resource/아이웨이웨이",
         "http://de.dbpedia.org/resource/Ai_Weiwei",
         "http://wikidata.org/entity/Q160115",
         "http://wikidata.dbpedia.org/resource/Q160115"
         ],
         "wasDerivedFrom": "http://en.wikipedia.org/wiki/Ai_Weiwei?oldid=645615321",
         "givenName": {
         "@language": "en",
         "@value": "Weiwei"
         },
         "homepage": "http://www.aiweiwei.com",
         "isPrimaryTopicOf": "http://en.wikipedia.org/wiki/Ai_Weiwei",
         "name": [
         {
         "@language": "en",
         "@value": "Weiwei Ai"
         },
         {
         "@language": "en",
         "@value": "Ai, Weiwei"
         },
         {
         "@language": "en",
         "@value": "Ai Weiwei"
         }
         ],
         "surname": {
         "@language": "en",
         "@value": "Ai"
         },
         "@context": {
         "caption": "http://dbpedia.org/property/caption",
         "wikiPageRevisionID": {
         "@id": "http://dbpedia.org/ontology/wikiPageRevisionID",
         "@type": "http://www.w3.org/2001/XMLSchema#integer"
         },
         "sameAs": {
         "@id": "http://www.w3.org/2002/07/owl#sameAs",
         "@type": "@id"
         },
         "comment": "http://www.w3.org/2000/01/rdf-schema#comment",
         "givenName": "http://xmlns.com/foaf/0.1/givenName",
         "abstract": "http://dbpedia.org/ontology/abstract",
         "p": "http://dbpedia.org/property/p",
         "imagesize": {
         "@id": "http://dbpedia.org/property/imagesize",
         "@type": "http://www.w3.org/2001/XMLSchema#integer"
         },
         "viafId": {
         "@id": "http://dbpedia.org/ontology/viafId",
         "@type": "http://www.w3.org/2001/XMLSchema#string"
         },
         "name": "http://xmlns.com/foaf/0.1/name",
         "subject": {
         "@id": "http://purl.org/dc/terms/subject",
         "@type": "@id"
         },
         "birthYear": {
         "@id": "http://dbpedia.org/ontology/birthYear",
         "@type": "http://www.w3.org/2001/XMLSchema#gYear"
         },
         "wikiPageExternalLink": {
         "@id": "http://dbpedia.org/ontology/wikiPageExternalLink",
         "@type": "@id"
         },
         "label": "http://www.w3.org/2000/01/rdf-schema#label",
         "wasDerivedFrom": {
         "@id": "http://www.w3.org/ns/prov#wasDerivedFrom",
         "@type": "@id"
         },
         "wikiPageID": {
         "@id": "http://dbpedia.org/ontology/wikiPageID",
         "@type": "http://www.w3.org/2001/XMLSchema#integer"
         },
         "birthPlace": "http://dbpedia.org/property/birthPlace",
         "homepage": {
         "@id": "http://xmlns.com/foaf/0.1/homepage",
         "@type": "@id"
         },
         "birthDate": {
         "@id": "http://dbpedia.org/property/birthDate",
         "@type": "http://www.w3.org/2001/XMLSchema#date"
         },
         "align": "http://dbpedia.org/property/align",
         "nationality": "http://dbpedia.org/property/nationality",
         "works": "http://dbpedia.org/property/works",
         "image": {
         "@id": "http://dbpedia.org/property/image",
         "@type": "@id"
         },
         "placeOfBirth": "http://dbpedia.org/property/placeOfBirth",
         "shortDescription": "http://dbpedia.org/property/shortDescription",
         "wordnet_type": {
         "@id": "http://dbpedia.org/property/wordnet_type",
         "@type": "@id"
         },
         "surname": "http://xmlns.com/foaf/0.1/surname",
         "hasRank": {
         "@id": "http://purl.org/voc/vrank#hasRank",
         "@type": "@id"
         },
         "isPrimaryTopicOf": {
         "@id": "http://xmlns.com/foaf/0.1/isPrimaryTopicOf",
         "@type": "@id"
         },
         "hasPhotoCollection": {
         "@id": "http://dbpedia.org/property/hasPhotoCollection",
         "@type": "@id"
         },
         "spouse": "http://dbpedia.org/property/spouse",
         "dateOfBirth": {
         "@id": "http://dbpedia.org/property/dateOfBirth",
         "@type": "http://www.w3.org/2001/XMLSchema#date"
         },
         "c": "http://dbpedia.org/property/c",
         "description": "http://purl.org/dc/elements/1.1/description",
         "seeAlso": {
         "@id": "http://www.w3.org/2000/01/rdf-schema#seeAlso",
         "@type": "@id"
         },
         "bgcolour": "http://dbpedia.org/property/bgcolour"
         }
         }; */

        var $el = $(el);
        jsonld = removeContext(jsonld);
        var properties = createProperties(jsonld);
        var html = '<dl>';
        for (var i = 0; i < properties.length; i++) {
            html += '<dt style="font-weight: bold; font-style: italic; font-size: smaller;">' + properties[i].label + '</dt>';
            for (var j = 0; j < properties[i].values.length; j++) {
                html += '<dd style="margin-left: 16px;"><span>' + properties[i].values[j] + '</span> <button style="border: 2px outset buttonface; background-color: buttonface;">Insert</button></dd>';
            }
        }
        html += '</dl>';
        $el.empty();
        $el.html(html);
        $el.find('button').on('click', function () {
            placeCaretAfterEl(editor);
            editor.insertText(' ' + $(this).parents('dd').find('span').text());
        });
    }

    function removeContext(obj) {
        var newObj = {};
        var context = obj['@context'];
        for (var key in obj) {
            if (!obj.hasOwnProperty(key) || key.indexOf('@') === 0) {
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
            newObj[newKey] = obj[key];
        }
        return newObj;
    }

    function createProperties(obj) {
        var properties = {},
            key;
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            if (typeof obj[key] === 'string') {
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
    function placeCaretAfterEl(editor) {
        var sel = editor.document.getSelection();
        var range = editor.createRange();
        var el = sel.getCommonAncestor();
        if (el.$.nodeType === 3) {
            el = el.getParent();
        }
        range.selectNodeContents(el.getNext());
        range.collapse(true);
        sel.selectRanges([range]);
    }
});
