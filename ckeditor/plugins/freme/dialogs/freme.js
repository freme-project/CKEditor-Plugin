/**
 * Created by bjdmeest on 4/12/2015.
 */
CKEDITOR.dialog.add('fremeDialog', function (editor) {
    return {
        title: 'FREME Magic',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    // TODO
                ]
            }
        ],
        onOk: function () {
            var dialog = this;
            editor.insertHtml('<b>TODO</b>');
        }
    };
});
