function start(flashlight, texture) {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0, 750);
    scene.add(camera);

//    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
//    light.position.set(0.5, 1, 0.75);
//    scene.add(light);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

    addFlashlight();
    addFloor();
    addBoxes();
    addGhosts();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    loaded = true;

    function addFlashlight() {
        var light = new t.SpotLight(0xffffff,2,300);

        flashlight.position.copy(camera.position); // and reset spotlight position if camera moves
        flashlight.rotateY(Math.PI / Math.PI - 1);
        flashlight.position.set(8, 0, -10);

        light.position.copy(camera.position);
        light.position.set(8, 0, -13);
        light.castShadow = true;
        light.shadowDarkness = 0.5;
        light.shadowCameraVisible = true;

        target = new t.Object3D();

        target.position.copy(camera.position);
        target.position.z = -50;

        camera.add(target);

        light.target = target;

        camera.add(light);

        camera.add(flashlight);

    }

    function addGhosts() {
        var geometry = new THREE.PlaneGeometry(20, 20, 2, 2),
            material = new THREE.MeshPhongMaterial({ map: texture, shading: THREE.FlatShading, transparent: true}),
            mesh, i;


        for (i = 0, l = 10; i < l; i ++) {
            mesh = new THREE.Mesh(geometry, material);
            mesh.material.side = THREE.DoubleSide;

            mesh.position.set(Math.floor(Math.random()*200) , 15, -(Math.floor(Math.random()*200) + 50));
            mesh.userData = {index: i};

            scene.add(mesh);
            objects.push(mesh);
            ghosts.push(mesh);

            mesh.lookAt(controls.getObject().position);
        }
    }

    function addBoxes() {
        var geometry = new THREE.BoxGeometry(20, 20, 20),
            material = new THREE.MeshPhongMaterial({ specular: 0x000000, shading: THREE.FlatShading, vertexColors: THREE.VertexColors }),
            mesh, face, i;

        for (i = 0, l = geometry.faces.length; i < l; i ++) {

            face = geometry.faces[ i ];
            face.vertexColors[ 0 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[ 1 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[ 2 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

        }

        for (i = 0; i < 500; i ++) {

            material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20;
            mesh.position.y = Math.floor(Math.random() * 20) * 20 + 40;
            mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20

            scene.add(mesh);

            objects.push(mesh);
        }
    }

    function addFloor() {
        var geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100),
            material = new THREE.MeshPhongMaterial({ specular: 0x000000, shading: THREE.FlatShading, vertexColors: THREE.VertexColors }),
            face, mesh, i;

        geometry.rotateX(- Math.PI / 2);

        for (i = 0, l = geometry.vertices.length; i < l; i++) {

            var vertex = geometry.vertices[ i ];
            vertex.x += Math.random() * 20 - 10;
            vertex.y += Math.random() * 2;
            vertex.z += Math.random() * 20 - 10;

        }

        for (i = 0, l = geometry.faces.length; i < l; i++) {

            face = geometry.faces[ i ];
            face.vertexColors[ 0 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[ 1 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            face.vertexColors[ 2 ] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

        }

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0,0,40);

        scene.add(mesh);

        objects.push(mesh);
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function onKeyDown(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

        }

    }

    function onKeyUp(event) {

        switch(event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    }

}
