
var canvas = document.querySelector("#scene"),
    ctx = canvas.getContext("2d"),
    particles = [],
    amount = 0,
    mouse = { x: 0, y: 0 },
    radius = 1;

var colors = ["#468966", "#FFF0A5", "#FFB03B", "#B64926", "#8E2800"];

var copy = document.querySelector("#copy");

var ww = canvas.width = window.innerWidth;
var wh = canvas.height = window.innerHeight;

function Particle(x, y) {
    this.x = Math.random() * ww;
    this.y = Math.random() * wh;
    this.dest = {
        x: x,
        y: y
    };
    this.r = Math.random() * 5 + 2;
    this.vx = (Math.random() - 0.5) * 20;
    this.vy = (Math.random() - 0.5) * 20;
    this.accX = 0;
    this.accY = 0;
    this.friction = Math.random() * 0.05 + 0.94;

    this.color = colors[Math.floor(Math.random() * 6)];
}

Particle.prototype.render = function () {


    this.accX = (this.dest.x - this.x) / 1000;
    this.accY = (this.dest.y - this.y) / 1000;
    this.vx += this.accX;
    this.vy += this.accY;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
    ctx.fill();

    var a = this.x - mouse.x;
    var b = this.y - mouse.y;

    var distance = Math.sqrt(a * a + b * b);
    if (distance < (radius * 70)) {
        this.accX = (this.x - mouse.x) / 100;
        this.accY = (this.y - mouse.y) / 100;
        this.vx += this.accX;
        this.vy += this.accY;
    }

}

function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function onTouchMove(e) {
    if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }
}

function onTouchEnd(e) {
    mouse.x = -9999;
    mouse.y = -9999;
}

function initScene() {
    ww = canvas.width = window.innerWidth;
    wh = canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold " + (ww / 10) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(copy.value, ww / 2, wh / 2);

    var data = ctx.getImageData(0, 0, ww, wh).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "screen";

    particles = [];
    for (var i = 0; i < ww; i += Math.round(ww / 150)) {
        for (var j = 0; j < wh; j += Math.round(ww / 150)) {
            if (data[((i + j * ww) * 4) + 3] > 150) {
                particles.push(new Particle(i, j));
            }
        }
    }
    amount = particles.length;

}

function onMouseClick() {
    radius++;
    if (radius === 5) {
        radius = 0;
    }
}

function render(a) {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < amount; i++) {
        particles[i].render();
    }
};

copy.addEventListener("keyup", initScene);
window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);
window.addEventListener("touchend", onTouchEnd);
initScene();
requestAnimationFrame(render);




var site = site || {};
site.window = $(window);
site.document = $(document);
site.Width = site.window.width();
site.Height = site.window.height();

var Background = function () {

};

Background.headparticle = function () {

    if (!Modernizr.webgl) {
        alert('Your browser dosent support WebGL');
    }

    var camera, scene, renderer;
    var mouseX = 0, mouseY = 0;
    var p;

    var windowHalfX = site.Width / 2;
    var windowHalfY = site.Height / 2;

    Background.camera = new THREE.PerspectiveCamera(35, site.Width / site.Height, 1, 2000);
    Background.camera.position.z = 300;

    // scene
    Background.scene = new THREE.Scene();

    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        //console.log('webgl, twice??');
        //console.log( item, loaded, total );
    };


    // particles
    var p_geom = new THREE.Geometry();
    var p_material = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 1.5
    });

    // model
    var loader = new THREE.OBJLoader(manager);
    loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/40480/head.obj', function (object) {

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                // child.material.map = texture;

                var scale = 8;

                $(child.geometry.vertices).each(function () {
                    p_geom.vertices.push(new THREE.Vector3(this.x * scale, this.y * scale, this.z * scale));
                })
            }
        });

        Background.scene.add(p)
    });

    p = new THREE.ParticleSystem(
        p_geom,
        p_material
    );

    Background.renderer = new THREE.WebGLRenderer({ alpha: true });
    Background.renderer.setSize(site.Width, site.Height);
    Background.renderer.setClearColor(0x000000, 0);

    $('.particlehead').append(Background.renderer.domElement);
    $('.particlehead').on('mousemove', onDocumentMouseMove);
    site.window.on('resize', onWindowResize);

    function onWindowResize() {
        windowHalfX = site.Width / 2;
        windowHalfY = site.Height / 2;
        //console.log(windowHalfX);

        Background.camera.aspect = site.Width / site.Height;
        Background.camera.updateProjectionMatrix();

        Background.renderer.setSize(site.Width, site.Height);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 2;
        mouseY = (event.clientY - windowHalfY) / 2;
    }

    Background.animate = function () {

        Background.ticker = TweenMax.ticker;
        Background.ticker.addEventListener("tick", Background.animate);

        render();
    }

    function render() {
        Background.camera.position.x += ((mouseX * .5) - Background.camera.position.x) * .05;
        Background.camera.position.y += (-(mouseY * .5) - Background.camera.position.y) * .05;

        Background.camera.lookAt(Background.scene.position);

        Background.renderer.render(Background.scene, Background.camera);
    }

    render();

    Background.animate();
};


Background.headparticle();