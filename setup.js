function setup() {
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    var element;

    $('#hurt').hide();

    if (havePointerLock) {

        element = document.body;

        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

        instructions.addEventListener('click', pointerlocksetup, false);

    } else {
        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }

    setInterval(Sounds.playRandomVoice.bind(Sounds), 7000);

    Sounds.playRandomVoice();

    loadObjs();

    function pointerlocksetup(event) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if (/Firefox/i.test(navigator.userAgent)) {

            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

        } else {

            element.requestPointerLock();

        }

    }

    function fullscreenchange(event) {

        if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

            document.removeEventListener('fullscreenchange', fullscreenchange);
            document.removeEventListener('mozfullscreenchange', fullscreenchange);

            element.requestPointerLock();
        }

    }

    function pointerlockchange(event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

            controlsEnabled = true;
            controls.enabled = true;

            instructions.style.display = 'none';

        } else {

            controlsEnabled = false;
            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

        }

    }

    function pointerlockerror(event) {

        instructions.style.display = '';

    }

    function loadObjs() {
        var loader = new t.OBJMTLLoader();

        loader.load('./models/torch.obj', './materials/torch.mtl', function(flashlight) {

            var loader = new t.TextureLoader();

            loader.load('./images/ghost.png', function(texture) {

                start(flashlight, texture);
                setTimeout(animate, 100);

            }, function() {}, function(err) {
                console.log('error', err);
            });
        });
    }
}