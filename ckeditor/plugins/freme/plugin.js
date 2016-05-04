/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.plugins.add('freme', {
    init: function (editor) {
        var $ = window.$ || window.jQuery;

        if (!$) {
            editor.showNotification('jQuery not found!', 'warning');
        }
        editor.addContentsCss(this.path + '/styles/style-freme.css');

        editor.addCommand('fremeTranslate', new CKEDITOR.dialogCommand('fremeTranslateDialog'));
        editor.ui.addButton('FremeTranslate', {
            label: 'Translate',
            command: 'fremeTranslate',
            icon: this.path + '/icons/fremeTranslate.png',
            toolbar: 'freme'
        });

        CKEDITOR.dialog.add('fremeTranslateDialog', this.path + 'dialogs/translate.js');

        editor.addCommand('fremeEntity', new CKEDITOR.dialogCommand('fremeEntityDialog'));
        editor.ui.addButton('FremeEntity', {
            label: 'Detect concepts',
            command: 'fremeEntity',
            icon: this.path + '/icons/fremeEntity.png',
            toolbar: 'freme'
        });

        CKEDITOR.dialog.add('fremeEntityDialog', this.path + 'dialogs/entity.js');

        editor.addCommand('fremeLink', new CKEDITOR.dialogCommand('fremeLinkDialog'));
        editor.ui.addButton('FremeLink', {
            label: 'Get additional info',
            command: 'fremeLink',
            icon: this.path + '/icons/fremeLink.png',
            toolbar: 'freme'
        });

        CKEDITOR.dialog.add('fremeLinkDialog', this.path + 'dialogs/link.js');

        editor.on('instanceReady', function () {
            editor.commands.fremeLink.disable();
        });

        editor.on('mode', function () {
            editor.commands.fremeLink.disable();
        });

        editor.on('doubleclick', function() {
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