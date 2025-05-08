'use client';

import '@gravity-ui/page-constructor/styles/styles.scss';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

const ReliefPlateConfigurator = () => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(100);
  const [depth, setDepth] = useState(100);
  const [plateThickness, setPlateThickness] = useState(5);
  const [reliefHeight, setReliefHeight] = useState(10);
  const [file, setFile] = useState(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(150, 150, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 100, 100);
    scene.add(dirLight);

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
  }, [width, depth, plateThickness, reliefHeight, file]);

  const generateModel = async () => {
    if (!file) return;

    const imgBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = imgBitmap.width;
    canvas.height = imgBitmap.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgBitmap, 0, 0);
    const imgData = ctx.getImageData(0, 0, imgBitmap.width, imgBitmap.height).data;

    const cols = imgBitmap.width;
    const rows = imgBitmap.height;
    const positions = [];
    const indices = [];

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
    const material = new THREE.MeshStandardMaterial({ color: 0xffd700, side: THREE.DoubleSide });
    const reliefMesh = new THREE.Mesh(reliefGeo, material);

    const plateGeo = new THREE.BoxGeometry(width, depth, plateThickness);
    const plateMesh = new THREE.Mesh(plateGeo, material);
    plateMesh.position.set(0, 0, -plateThickness / 2);

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

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: 250, padding: 10, background: '#f0f0f0' }}>
        <label>
          Длина X (мм):
          <input type="number" value={width} onChange={e => setWidth(+e.target.value)} />
        </label>
        <label>
          Ширина Y (мм):
          <input type="number" value={depth} onChange={e => setDepth(+e.target.value)} />
        </label>
        <label>
          Толщина пластины (мм):
          <input
            type="number"
            value={plateThickness}
            onChange={e => setPlateThickness(+e.target.value)}
          />
        </label>
        <label>
          Высота рельефа (мм):
          <input
            type="number"
            value={reliefHeight}
            onChange={e => setReliefHeight(+e.target.value)}
          />
        </label>
        <label>
          Heightmap (ч/б):
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        </label>
        <button onClick={exportSTL}>Экспорт в STL</button>
      </div>
      <div ref={containerRef} style={{ flex: 1 }} />
    </div>
  );
};

export default ReliefPlateConfigurator;
