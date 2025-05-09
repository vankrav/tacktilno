import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import codes from '../../scripts/codes';

const DPI = 150;
const MM_TO_INCH = 25.4;
const DOT_HEIGHT = 1; // Константа высоты точки в мм

export const useBrailleConfigurator = containerRef => {
  const [text, setText] = useState('привет, мир');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(25);
  const [plateThickness, setPlateThickness] = useState(3);
  const [marginTop, setMarginTop] = useState(10);
  const [marginLeft, setMarginLeft] = useState(10);
  const [gridResolution, setGridResolution] = useState(200);
  const [isWireframe, setIsWireframe] = useState(false);
  const [canvas, setCanvas] = useState(null);

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
      powerPreference: 'high-performance',
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
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
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
    fillLight.position.set(-50, 50, -50);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
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
    if (text) {
      generateModel();
    }
  }, [text, width, height, plateThickness, marginTop, marginLeft, gridResolution]);

  const mmToPixels = mm => (mm / MM_TO_INCH) * DPI;

  const generateModel = () => {
    if (!width || !height || width <= 0 || height <= 0) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = mmToPixels(width);
    canvas.height = mmToPixels(height);
    const ctx = canvas.getContext('2d');

    // Проверяем, что размеры canvas больше 0
    if (canvas.width <= 0 || canvas.height <= 0) {
      return;
    }

    // Установить белый фон
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = mmToPixels(marginLeft);
    let y = mmToPixels(marginTop);

    const settings = {
      dotRadius: mmToPixels(0.8),
      dotSpacing: mmToPixels(2.7),
      charSpacing: mmToPixels(6.6),
      wordSpacing: mmToPixels(6.4),
      lineSpacing: mmToPixels(10.8),
    };

    const drawBrailleChar = (ctx, x, y, dots) => {
      const positions = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
      ];

      dots.forEach(dot => {
        const [row, col] = positions[dot - 1];
        const dotX = x + col * settings.dotSpacing;
        const dotY = y + row * settings.dotSpacing;

        const gradient = ctx.createRadialGradient(
          dotX,
          dotY,
          0, // Начальная точка градиента (центр)
          dotX,
          dotY,
          settings.dotRadius // Конечная точка градиента (край)
        );
        gradient.addColorStop(0, '#000000'); // Черный в центре
        gradient.addColorStop(0.3, '#111111'); // Темно-серый
        gradient.addColorStop(0.5, '#333333'); // Серый
        gradient.addColorStop(0.7, '#666666'); // Светло-серый
        gradient.addColorStop(0.9, '#999999'); // Очень светло-серый
        gradient.addColorStop(1, '#ffffff'); // Белый по краям

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dotX, dotY, settings.dotRadius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    for (const char of text.toLowerCase()) {
      if (char === ' ') {
        x += settings.wordSpacing;
        continue;
      }

      if (char === '\n') {
        x = mmToPixels(marginLeft);
        y += settings.lineSpacing;
        continue;
      }

      const dots = codes[char];
      if (dots) {
        drawBrailleChar(ctx, x, y, dots);
        x += settings.charSpacing;
      }

      if (x + settings.charSpacing > canvas.width) {
        x = mmToPixels(marginLeft);
        y += settings.lineSpacing;
      }

      if (y + settings.lineSpacing > canvas.height) {
        break;
      }
    }

    setCanvas(canvas);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const cols = Math.min(gridResolution, canvas.width);
    const rows = Math.round(cols * (canvas.height / canvas.width));
    const positions = [];
    const indices = [];

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const srcX = Math.floor((i / (cols - 1)) * canvas.width);
        const srcY = Math.floor((j / (rows - 1)) * canvas.height);
        const idx = (srcY * canvas.width + srcX) * 4;
        const brightness = imgData[idx];
        const h = DOT_HEIGHT * (1 - brightness / 255);
        const x = isNaN(i / (cols - 1)) ? 0 : (i / (cols - 1) - 0.5) * width;
        const y = isNaN(j / (rows - 1)) ? 0 : -(j / (rows - 1) - 0.5) * height;
        positions.push(
          isNaN(x) ? 0 : x,
          isNaN(y) ? 0 : y,
          isNaN(h) ? 0 : h
        );
      }
    }

    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = j * cols + i;
        const b = j * cols + i + 1;
        const c = (j + 1) * cols + i;
        const d = (j + 1) * cols + i + 1;
        if (a >= 0 && b >= 0 && c >= 0 && d >= 0 &&
            a < positions.length / 3 && b < positions.length / 3 &&
            c < positions.length / 3 && d < positions.length / 3) {
          indices.push(a, b, d, a, d, c);
        }
      }
    }

    const reliefGeo = new THREE.BufferGeometry();
    reliefGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    reliefGeo.setIndex(indices);
    
    if (positions.length > 0 && indices.length > 0) {
      reliefGeo.computeVertexNormals();
    }

    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.0,
      roughness: 0.7,
      side: THREE.DoubleSide,
      wireframe: isWireframe,
    });

    const reliefMesh = new THREE.Mesh(reliefGeo, material);
    reliefMesh.castShadow = true;
    reliefMesh.receiveShadow = true;

    const plateGeo = new THREE.BoxGeometry(width, height, plateThickness);
    const plateMesh = new THREE.Mesh(plateGeo, material);
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

  // Обновляем модель при изменении wireframe режима
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach(mesh => {
        mesh.material.wireframe = isWireframe;
      });
    }
  }, [isWireframe]);

  const exportSTL = () => {
    const group = groupRef.current;
    if (!group) {
      alert('Сначала введите текст');
      return;
    }
    const exporter = new STLExporter();
    const stlString = exporter.parse(group, { binary: false });
    const blob = new Blob([stlString], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    link.download = 'braille_plate.stl';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return {
    text,
    setText,
    width,
    setWidth,
    height,
    setHeight,
    plateThickness,
    setPlateThickness,
    marginTop,
    setMarginTop,
    marginLeft,
    setMarginLeft,
    gridResolution,
    setGridResolution,
    isWireframe,
    setIsWireframe,
    exportSTL,
    canvas,
  };
}; 