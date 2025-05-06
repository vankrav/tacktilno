// src/components/CubeGenerator/CubeGenerator.tsx
'use client'
import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button, TextInput, Slider } from '@gravity-ui/uikit';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

function Box(props) {
  const { width = 1, height = 1, depth = 1 } = props;
  
  return (
    <mesh>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

function CubeGenerator() {
  const [dimensions, setDimensions] = useState({
    width: 1,
    height: 1,
    depth: 1
  });
  
  const handleExport = () => {
    const exporter = new STLExporter();
    const scene = sceneRef.current;
    
    if (scene) {
      const result = exporter.parse(scene, { binary: true });
      const blob = new Blob([result], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cube.stl';
      link.click();
      
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="cube-generator">
      <div className="cube-generator__viewport">
        <Canvas camera={{ position: [5, 5, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Box {...dimensions} />
          <OrbitControls />
        </Canvas>
      </div>
      
      <div className="cube-generator__controls">
        <div className="cube-generator__control">
          <label>Ширина (мм):</label>
          <Slider
            value={[dimensions.width]}
            min={1}
            max={100}
            onChange={([value]) => setDimensions(prev => ({ ...prev, width: value }))}
          />
        </div>
        
        <div className="cube-generator__control">
          <label>Высота (мм):</label>
          <Slider
            value={[dimensions.height]}
            min={1}
            max={100}
            onChange={([value]) => setDimensions(prev => ({ ...prev, height: value }))}
          />
        </div>
        
        <div className="cube-generator__control">
          <label>Глубина (мм):</label>
          <Slider
            value={[dimensions.depth]}
            min={1}
            max={100}
            onChange={([value]) => setDimensions(prev => ({ ...prev, depth: value }))}
          />
        </div>
        
        <Button view="action" onClick={handleExport}>
          Экспорт STL
        </Button>
      </div>
    </div>
  );
}

export default CubeGenerator;