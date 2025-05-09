import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

export const useModelConfigurator = containerRef => {
  const [width, setWidth] = useState(100);
  const [plateThickness, setPlateThickness] = useState(5);
  const [reliefHeight, setReliefHeight] = useState(10);
  const [file, setFile] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [gridResolution, setGridResolution] = useState(100);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
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
    if (file) {
      generateModel();
    }
  }, [width, plateThickness, reliefHeight, file, gridResolution, isInverted]);

  const generateModel = async () => {
    if (!file) return;

    const imgBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');

    // Вычисляем новые размеры с сохранением пропорций
    let newWidth, newHeight;
    if (imgBitmap.width > imgBitmap.height) {
      newWidth = 512;
      newHeight = Math.round((imgBitmap.height * 512) / imgBitmap.width);
    } else {
      newHeight = 512;
      newWidth = Math.round((imgBitmap.width * 512) / imgBitmap.height);
    }

    // Добавляем 10 пикселей для рамки
    canvas.width = newWidth + 10;
    canvas.height = newHeight + 10;
    const ctx = canvas.getContext('2d');

    // Заполняем весь канвас черным цветом
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем масштабированное изображение с отступом 5 пикселей
    ctx.drawImage(imgBitmap, 5, 5, newWidth, newHeight);

    // Инвертируем изображение, если нужно
    if (isInverted) {
      const imageData = ctx.getImageData(5, 5, newWidth, newHeight);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Инвертируем только пиксели внутри изображения (не трогаем черную рамку)
        data[i] = 255 - data[i];     // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
      }
      ctx.putImageData(imageData, 5, 5);
    }

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const ratio = canvas.height / canvas.width;
    setAspectRatio(ratio);

    // Используем разрешение сетки для создания геометрии
    const cols = Math.min(gridResolution, canvas.width);
    const rows = Math.round(cols * ratio);
    const positions = [];
    const indices = [];

    const depth = width * ratio;

    // Создаем сетку с заданным разрешением
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        // Вычисляем соответствующие координаты в исходном изображении
        const srcX = Math.floor((i / (cols - 1)) * canvas.width);
        const srcY = Math.floor((j / (rows - 1)) * canvas.height);
        const idx = (srcY * canvas.width + srcX) * 4;
        const brightness = imgData[idx];
        const h = (brightness / 255) * reliefHeight;
        const x = isNaN(i / (cols - 1)) ? 0 : (i / (cols - 1) - 0.5) * width;
        const y = isNaN(j / (rows - 1)) ? 0 : -(j / (rows - 1) - 0.5) * depth;
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
        // Проверяем, что все индексы валидны
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
    
    // Проверяем геометрию перед вычислением нормалей
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

    const plateGeo = new THREE.BoxGeometry(width, depth, plateThickness);
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
    gridResolution,
    setGridResolution,
    isWireframe,
    setIsWireframe,
    isInverted,
    setIsInverted,
  };
};
