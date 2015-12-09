/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.plugins.add( 'freme', {
    init: function( editor ) {
        editor.addCommand( 'fremeTranslate', new CKEDITOR.dialogCommand( 'fremeTranslateDialog' ) );
        editor.ui.addButton( 'Freme', {
            label: 'Translate',
            command: 'fremeTranslate',
            icon: this.path + '/icons/fremeTranslate.png',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'fremeTranslateDialog', this.path + 'dialogs/translate.js' );
    }
});