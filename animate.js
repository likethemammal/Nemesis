function animate() {

    requestAnimationFrame(animate);

    if (controlsEnabled && loaded) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects(objects);
        var isOnObject = intersections.length > 0;
        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if (moveForward) velocity.z -= 400.0 * delta;
        if (moveBackward) velocity.z += 400.0 * delta;

        if (moveLeft) velocity.x -= 400.0 * delta;
        if (moveRight) velocity.x += 400.0 * delta;

        if (moveLeft || moveRight || moveForward || moveBackward) {
            Sounds.playFootstep();
        }

        if (isOnObject === true) {
            velocity.y = Math.max(0, velocity.y);

            canJump = true;
        }

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);


        if (controls.getObject().position.y < 10) {

            velocity.y = 0;
            canJump = true;
            controls.getObject().position.y = 10;
        }

        moveGhosts();
        checkFlashlightCollision();
        prevTime = time;

        renderer.render(scene, camera);
    }

    function moveGhosts() {
        var pos = controls.getObject().position,
            now = Date.now(),
            canGetHurt = lastHurt + 500 < now,
            x, y, xVal, yVal;

        ghosts.map(function(ghost, i) {
            x = ghost.position.x;
            y = ghost.position.z;

            if (pos.x > x) {
                xVal = (1 / 4);
            } else {
                xVal = -(1 / 4)
            }

            if (pos.z > y) {
                yVal = (1 / 4);
            } else {
                yVal = - (1 / 4);
            }

            ghost.position.x = xVal + x;
            ghost.position.z = yVal + y;

            if (now % 10 === 0) {
                ghost.lookAt(pos);
            }

            if (canGetHurt) {

                lastHurt = now;
                if (ghost.position.distanceTo(pos) < 40) {
                    $('#hurt').fadeIn(75);
                    $('#hurt').fadeOut(375);

                    Sounds.playHurtSound();
                }
            }
        });
    }

    function checkFlashlightCollision() {
        if (!tried) {
            tried = true;
            return;
        }

        var cont = controls.getObject(),
            dir = camera.getWorldDirection(),
            pos = cont.position,
            ray = new THREE.Raycaster(pos, dir, pos, 80),
            intersects = ray.intersectObjects(ghosts);

        if (intersects.length > 0) {

            intersects.map(function(intersect, i) {
                var ghost = intersect.object;
                var gho = ghost.position;
                var fromGhost = gho.distanceTo(pos);
                var tooClose = fromGhost < 10;

                if (!tooClose) {
                    var health = ghostsHealth[ghost.userData.index];
                    var now = Date.now();

                    if (!health) {
                        health = {value: 11, lastChanged: now};
                        removeHealth(ghost, health);
                    } else if (health.lastChanged + 500 < now) {
                        removeHealth(ghost, health)
                    }
                }
            });
        }
    }

    function removeHealth(ghost, health) {
        var index = ghost.userData.index;
        var color = ghost.material.color;
        var percent;

        ghost = ghosts[index];
        health.value -= 1;
        health.lastChanged = Date.now();

        percent = health.value / 10;

        ghostsHealth[index] = health;

        ghost.material.color.setRGB(
            percent * color.r,
            percent * color.g,
            percent * color.b
        );

        if (health.value <= 0) {
            killGhost(ghost, index);
        }
    }

    function killGhost(ghost, index) {
        scene.remove(ghost);
    }
}