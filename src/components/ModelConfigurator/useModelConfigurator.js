import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

export const useModelConfigurator = (containerRef) => {
  const [width, setWidth] = useState(100);
  const [plateThickness, setPlateThickness] = useState(5);
  const [reliefHeight, setReliefHeight] = useState(10);
  const [file, setFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(150, 150, 150);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 50;
    controls.maxDistance = 500;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(50, 100, 100);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 500;
    mainLight.shadow.camera.left = -100;
    mainLight.shadow.camera.right = 100;
    mainLight.shadow.camera.top = 100;
    mainLight.shadow.camera.bottom = -100;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-50, 50, -50);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, -50, 0);
    scene.add(rimLight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (file) {
      generateModel();
    }
  }, [width, plateThickness, reliefHeight, file]);

  const generateModel = async () => {
    if (!file) return;

    const imgBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = imgBitmap.width + 10;
    canvas.height = imgBitmap.height + 10;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(imgBitmap, 5, 5);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const ratio = canvas.height / canvas.width;
    setAspectRatio(ratio);

    const cols = canvas.width;
    const rows = canvas.height;
    const positions = [];
    const indices = [];

    const depth = width * ratio;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const idx = (j * cols + i) * 4;
        const brightness = imgData[idx];
        const h = (brightness / 255) * reliefHeight;
        const x = (i / (cols - 1) - 0.5) * width;
        const y = (j / (rows - 1) - 0.5) * depth;
        positions.push(x, y, h);
      }
    }

    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = j * cols + i;
        const b = j * cols + i + 1;
        const c = (j + 1) * cols + i;
        const d = (j + 1) * cols + i + 1;
        indices.push(a, b, d, a, d, c);
      }
    }

    const reliefGeo = new THREE.BufferGeometry();
    reliefGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    reliefGeo.setIndex(indices);
    reliefGeo.computeVertexNormals();

    const reliefMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.3,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });

    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.2,
      roughness: 0.5,
    });

    const reliefMesh = new THREE.Mesh(reliefGeo, reliefMaterial);
    reliefMesh.castShadow = true;
    reliefMesh.receiveShadow = true;

    const plateGeo = new THREE.BoxGeometry(width, depth, plateThickness);
    const plateMesh = new THREE.Mesh(plateGeo, plateMaterial);
    plateMesh.position.set(0, 0, -plateThickness / 2);
    plateMesh.castShadow = true;
    plateMesh.receiveShadow = true;

    const group = new THREE.Group();
    group.add(plateMesh);
    group.add(reliefMesh);

    const scene = sceneRef.current;
    if (groupRef.current) scene.remove(groupRef.current);
    scene.add(group);
    groupRef.current = group;
  };

  const exportSTL = () => {
    const group = groupRef.current;
    if (!group) {
      alert('Сначала сгенерируйте модель');
      return;
    }
    const exporter = new STLExporter();
    const stlString = exporter.parse(group, { binary: false });
    const blob = new Blob([stlString], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    link.download = 'relief_plate.stl';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return {
    width,
    setWidth,
    plateThickness,
    setPlateThickness,
    reliefHeight,
    setReliefHeight,
    file,
    setFile,
    exportSTL,
    aspectRatio,
  };
}; 