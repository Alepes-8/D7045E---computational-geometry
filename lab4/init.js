function init() {
    canvas = document.getElementById("webglcanvas");
    gl = canvas.getContext("webgl2");
    if (!gl) {alert("WebGL isn't available");}
    //webgl configurations
    gl.viewport( 0, 0, canvas.width, canvas.height ); //delete
    gl.clearColor(0.2, 0.2, .2, 1 );
    gl.enable(gl.DEPTH_TEST);
    let fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    let vertexShader = new Shader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    shader = new ShaderProgram(gl, vertexShader.getter(), fragmentShader.getter());

   

    optionListiners();
    
    let boardWeith = 30;
    let boardHight = 0.1;
    let boardLength = 30;
    let sideSizeX = 8;
    let sideSizeZ = 8;
    let objectsHights = 4;

    //colors
    let monoBlue = new MonochromeMaterial(gl, vec4(0,1, 1, 1.0), shader);
    let monoBlack = new MonochromeMaterial(gl, vec4(0, 0, 0, 1.0), shader);
    let monoWhite = new MonochromeMaterial(gl, vec4(1, 1, 1, 1.0), shader);
    let monoYellow = new MonochromeMaterial(gl, vec4(1, 1, 0, 1.0), shader);

    // translatons
    let translation = translate(0,0,0);

    //transform
    let centerTransform = mat4(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
    let sunTransform = mat4(1,0,0,0, 0,1,0,17, 0,0,1,-8, 0,0,0,1);
    let firstCubeTransform = mat4(1,0,0,-boardWeith/2+boardWeith/sideSizeX/2, 0,1,0,-3, 0,0,1,boardLength/2-boardLength/sideSizeZ/2, 0,0,0,1);
    
    let moonTransform = mat4(1,0,0,1.7, 0,1,0,0, 0,0,1,0, 0,0,0,1);
    let sphereTransform = mat4(1,0,0,0, 0,1,0,2, 0,0,1,0, 0,0,0,1);
    let cubeTransform = mat4(1,0,0,0, 0,1,0,2, 0,0,1,0, 0,0,0,1);
    let torusTransform = mat4(1,0,0,0, 0,1,0,2, 0,0,1,0, 0,0,0,1);
    let cylinderTransform = mat4(1,0,0,0, 0,1,0,2, 0,0,1,0, 0,0,0,1);
    let coneTransform = mat4(1,0,0,0, 0,1,0,2, 0,0,1,0, 0,0,0,1);


    //shapes
    let centerNode = new Sphere(gl, 0.1, shader.getProgram());
    let worldNode = new Sphere(gl, 0.0, shader.getProgram());
    let sunShape = new SunSphere(gl, 2, shader.getProgram());
    let firstCubes = new Cuboid(gl, boardWeith/sideSizeX, boardHight, boardLength/sideSizeZ, shader.getProgram());

    let moonSphere = new Sphere(gl, 0.6, shader.getProgram());
    let sphere = new Sphere(gl, 2, shader.getProgram());
    let cube = new Cuboid(gl, 3, objectsHights, 2, shader.getProgram());
    let torus = new Torus(gl, objectsHights/2, 1, shader.getProgram());
    let cylinder = new Cylinder(gl, 2, objectsHights, shader.getProgram());
    let cone = new Cone(gl, 3, objectsHights, shader.getProgram());

    //center
    camera = new CameraNode(gl, shader.getProgram(),centerNode, monoWhite, centerTransform, monoBlack, translation);
    lightSource = new SunNode(gl, shader.getProgram(),sunShape, null, sunTransform, null, translation, null);
    arrayWorld[0].push(new GraphicsNode(gl, shader.getProgram(), worldNode, monoWhite, centerTransform, monoBlack, translation, camera));
    arrayWorld[0].push(new GraphicsNode(gl, shader.getProgram(), firstCubes, monoWhite, firstCubeTransform, monoBlack, translation, arrayWorld[0][0]));
    arrayWorld[0].push(new GraphicsNode(gl, shader.getProgram(), worldNode, monoWhite, centerTransform, monoBlack, translation, arrayWorld[0][0]));

    arrayWorld[0].push(lightSource);
    lightSource.giveParent(arrayWorld[0][2]);
    lightSource.giveColors(monoYellow,monoBlack);

   
    //move item
    floor = new Floor(boardWeith, boardHight ,boardLength, sideSizeX, sideSizeZ, monoBlack, monoWhite, arrayWorld[0][1], lightSource);
    floor.createFloor(gl,shader);
    arrayWorld[1].push(floor);
    floorID = arrayWorld[1].length - 1;
 

    //objects
    laborint = new Laborint(boardWeith, boardLength, sideSizeX, sideSizeZ, boardHight, floor, monoBlue);
    robot = new Robot(arrayWorld[1][floorID].objectArray[60]);
    laborint.createLaborint(gl,shader);
    robot.createRobot(gl,shader);
    
    arrayWorld[1].push(robot);
    robotID = arrayWorld[1].length - 1;
    down = true;  

    //nodes
    arrayWorld[1].push(new GraphicsNode(gl, shader.getProgram(), moonSphere, monoWhite, moonTransform, monoBlack, translation, lightSource));
    arrayWorld[1].push(new GraphicsNode(gl, shader.getProgram(), sphere, monoYellow, sphereTransform, monoBlack, translation, arrayWorld[1][floorID].objectArray[4]));
    arrayWorld[1].push(new GraphicsNode(gl, shader.getProgram(), cube, monoYellow, cubeTransform, monoBlack, translation, arrayWorld[1][floorID].objectArray[15]));
    arrayWorld[1].push(new GraphicsNode(gl, shader.getProgram(), torus, monoYellow, torusTransform, monoBlack, translation, arrayWorld[1][floorID].objectArray[57]));
    arrayWorld[1].push(new GraphicsNode(gl, shader.getProgram(), cylinder, monoYellow, cylinderTransform, monoBlack, translation, arrayWorld[1][floorID].objectArray[32]));
    arrayWorld[1].push(new GraphicsNode(gl, shader.getProgram(), cone, monoYellow, coneTransform, monoBlack, translation, arrayWorld[1][floorID].objectArray[46]));

    arrayWorld[1].push(laborint);
    render();
}