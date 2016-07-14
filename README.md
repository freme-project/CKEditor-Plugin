# CKEditor-Plugin

## install

* download ckeditor from [here](http://ckeditor.com/download) (^4.5.X)
* unzip (root should be the same as the `ckeditor` folder in this root)
* also, download the plugin `notification`, and unzip it to the `plugins/` folder
* make sure the ckeditor is loaded with jquery and the jquery adapter (see `ckeditor/samples/freme.html` for an example)
* check out `ckeditor/samples/freme.html`, it's awesome!

## For Drupal installations
### Requirements
* CKEditor plugin installed: version >= 4.5
* jQuery >= 1.9. You can control the version of jQuery your Drupal installation uses by installing the [jQuery Update module](https://www.drupal.org/project/jquery_update)

### Instructions
* Clone the repository to some local directory
* Navigate into the downloaded plugin directory and find the 'freme' subdirectory under ckeditor/plugins
* Copy and paste the "freme" folder in your own Drupal installation's CKEditor module folder. The path to it should look like: <your_drupal_path>/sites/all/modules/ckeditor/plugins/ 
* Download the CKEditor Notification plugin from: [http://ckeditor.com/addon/notification](http://ckeditor.com/addon/notification). Place it in <your_drupal_path>/sites/all/modules/ckeditor/plugins/. 
* Navigate to <your_drupal_path>/sites/all/modules/ckeditor and add the following lines in the ckeditor.config.js file under the CKEDITOR.editorConfig variable:
`config.extraPlugins += (config.extraPlugins ? ',notification' : 'notification' );
CKEDITOR.plugins.addExternal('notification', Drupal.settings.ckeditor.module_path+'/plugins/notification/');
config.extraPlugins += (config.extraPlugins ? ',freme' : 'freme' );
CKEDITOR.plugins.addExternal('freme', Drupal.settings.ckeditor.module_path+'/plugins/freme/');`
* In your Drupal admin interface, navigate to "config/content/ckeditor/edit" and edit the CKEditor profile where you want the plugin to be included.
* Under the *Editor appearance* tab, navigate to the *Plugins* list and make sure that the options "Plugin file: notification" and "Plugin file: freme" are checked.
* In the same screen, edit the CKEditor Toolbar, so that it features the added FREME buttons, by dragging and dropping them.
* You are good to go! The buttons should now be visible in any form that uses the CKEditor Profile you defined.

## License

Copyright 2015  Agro-Know, Deutsches Forschungszentrum für Künstliche Intelligenz, iMinds, 
Institut für Angewandte Informatik e. V. an der Universität Leipzig, 
Istituto Superiore Mario Boella, Tilde, Vistatec, WRIPL

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
