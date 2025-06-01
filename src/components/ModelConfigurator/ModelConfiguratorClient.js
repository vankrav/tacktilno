'use client';

import { useState, useEffect, useRef } from 'react';
import { pipeline, env } from '@xenova/transformers';
import { Button, Icon, Switch, Slider, Text, Spin } from '@gravity-ui/uikit';
import { MagicWand, ArrowShapeDownToLine } from '@gravity-ui/icons';
import styles from './ModelConfigurator.module.scss';

// Настройка путей для загрузки моделей
env.localModelPath = '/models';
env.allowRemoteModels = true;
env.useBrowserCache = true;

const ModelConfiguratorClient = ({
  fileInputRef,
  setFile,
  isInverted,
  setIsInverted,
  contrast,
  setContrast,
  isCurvesMode,
  setIsCurvesMode,
  curveValues,
  setCurveValues,
  file,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const uploadInputRef = useRef(null);

  useEffect(() => {
    const initModel = async () => {
      try {
        console.log('Начало загрузки модели');
        setModelLoading(true);
        modelRef.current = await pipeline('depth-estimation', 'Xenova/depth-anything-small-hf');
        console.log('Модель загружена успешно');
        setModelLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке модели:', err);
        setError('Ошибка при инициализации модели: ' + err.message);
        setModelLoading(false);
      }
    };
    initModel();
  }, []);

  const processImage = async (imageUrl) => {
    if (!imageUrl || !modelRef.current) return;

    console.log('Начало обработки изображения');
    setIsProcessing(true);
    setError(null);

    try {
      const output = await modelRef.current(imageUrl);
      
      if (!canvasRef.current) {
        throw new Error('Canvas не инициализирован');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Не удалось получить контекст canvas');
      }

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCanvas.width = output.depth.width;
      tempCanvas.height = output.depth.height;
      
      const depthData = output.depth.data;
      const rgbaData = new Uint8ClampedArray(depthData.length * 4);
      
      for (let i = 0; i < depthData.length; i++) {
        const depth = depthData[i];
        rgbaData[i * 4] = depth;
        rgbaData[i * 4 + 1] = depth;
        rgbaData[i * 4 + 2] = depth;
        rgbaData[i * 4 + 3] = 255;
      }
      
      const imageData = new ImageData(
        rgbaData,
        output.depth.width,
        output.depth.height
      );
      
      tempCtx.putImageData(imageData, 0, 0);
      
      canvas.width = output.depth.width;
      canvas.height = output.depth.height;
      
      ctx.drawImage(tempCanvas, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'depth-map.png', { type: 'image/png' });
      setFile(file);

    } catch (err) {
      setError('Ошибка при обработке изображения: ' + err.message);
      console.error('Детали ошибки:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        await processImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={uploadInputRef}
        onChange={handleDirectUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
        <Button 
          size="l" 
          view="action" 
          width="max" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing || modelLoading}
        >
          {isProcessing ? (
            <>
              <Spin size="s" className={styles.spinnerIcon} />
              Обработка изображения...
            </>
          ) : modelLoading ? (
            <>
              <Spin size="s" className={styles.spinnerIcon} />
              Загрузка модели...
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon data={MagicWand} size={18} />
                <span>Создать карту высот</span>
              </div>
            </>
          )}
        </Button>
        <Button 
          size="l" 
          view="normal" 
          width="max" 
          onClick={() => uploadInputRef.current?.click()}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon data={ArrowShapeDownToLine} size={18} />
            <span>Загрузить карту высот</span>
          </div>
        </Button>
      </div>
      {error && (
        <Text variant="body-2" color="danger" className={styles.error}>
          {error}
        </Text>
      )}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
      
    </>
  );
};

export default ModelConfiguratorClient; 