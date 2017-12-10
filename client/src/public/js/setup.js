(function() {
    'use strict';

    function takePhoto(addFace) {
        console.log('windows.tools.takePhoto starting...');

        // var captureUI = new Windows.Media.Capture.CameraCaptureUI();
        // captureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.png;
        // captureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (capturedItem) {
        //   // Do something with the picture
        // });
    };

    function init()
    {
        console.log('windows.tools.init starting...');

        buttonAddProfil = document.getElementById('buttonAddProfil');
        buttonAddProfil.hidden = false;
        buttonAddProfil.addEventListener('click', function() {
            takePhoto(true);
        });
    }

    if (typeof Windows == 'undefined') {
        console.log('Windows is not available');
        return;
    }

    var buttonAddProfil;
    document.addEventListener('DOMContentLoaded', init);
}());