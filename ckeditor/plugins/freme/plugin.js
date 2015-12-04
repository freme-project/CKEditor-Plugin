/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.plugins.add( 'freme', {
    icons: 'freme',
    init: function( editor ) {
        editor.addCommand( 'freme', new CKEDITOR.dialogCommand( 'fremeDialog' ) );
        editor.ui.addButton( 'Freme', {
            label: 'Do the FREME',
            command: 'freme',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'fremeDialog', this.path + 'dialogs/freme.js' );
    }
});