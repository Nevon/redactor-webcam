#Redactor-webcam

Redactor-webcam is a plugin for the WYSIWYG editor [Redactor](http://imperavi.com/redactor/) to allow a user to take a photo with their webcam and (optionally) upload it to the server.

##Installation

Include redactor-webcam.js in your markup:

    <script src="redactor-webcam.js"></script>

Add the plugin to the `plugins` option:

    $('#redactor-editor').redactor({
        'plugins' : ['webcam']
    });

##Usage

Click on the webcam button and allow the webpage access to your webcam. Then use the buttons to take an image and insert it into the editor.

If `imageUpload` has been set, the image will be POSTed there in the exact same way as when you upload an image normally through the editor. For information on how to configure image uploading, see the [Redactor documentation](http://imperavi.com/redactor/docs/images/).

###Browser support

This plugin makes use of some very new APIs that may or may not be available in your web browser. It has been tested in Google Chrome 25+, Firefox 19 and Opera 12.14, but I can't give any guarantees that it will work in any browser at all, as their implementations are still changing.

If there's no support for `getUserMedia`, the plugin button will not be shown.

##Translation

Look in redactor-webcam for an structure with all the translation strings in. Simply add those to your translation object. Ex:

    var RELANG = {};
    RELANG['sv'] = {
        //Standard Redactor strings
        webcam_title : 'Sätt in bild från webbkamera',
        webcam_help_msg : 'Var god ge webbsidan tillgång till din webbkamera via knapparna i toppen av fönstret.',
        webcam_btn_take : 'Ta foto',
        webcam_btn_insert : 'Sätt in bild',
        webcam_btn_reset : 'Ta ny bild'
    ]

##Credits

Camera icon by [Stanislav Levin](http://thenounproject.com/brandcut), from The Noun Project

##License

Copyright (c) 2013 Tommy Brunn (tommy.brunn@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  
    