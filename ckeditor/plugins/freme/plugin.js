/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.plugins.add('freme', {
    init: function (editor) {
        editor.addContentsCss(this.path + '/styles/style-freme.css');

        editor.addCommand('fremeTranslate', new CKEDITOR.dialogCommand('fremeTranslateDialog'));
        editor.ui.addButton('FremeTranslate', {
            label: 'Translate',
            command: 'fremeTranslate',
            icon: this.path + '/icons/fremeTranslate.png',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add('fremeTranslateDialog', this.path + 'dialogs/translate.js');

        editor.addCommand('fremeEntity', new CKEDITOR.dialogCommand('fremeEntityDialog'));
        editor.ui.addButton('FremeEntity', {
            label: 'Link to entities',
            command: 'fremeEntity',
            icon: this.path + '/icons/fremeEntity.png',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add('fremeEntityDialog', this.path + 'dialogs/entity.js');
    }
});