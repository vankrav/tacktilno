import { Card } from '@gravity-ui/uikit';
import { Row } from '@gravity-ui/uikit';
import { Col } from '@gravity-ui/uikit';
import { TextArea } from '@gravity-ui/uikit';
import { NumberInput } from '@gravity-ui/uikit';
import { Text } from '@gravity-ui/uikit';
import { Button } from '@gravity-ui/uikit';
import { Switch } from '@gravity-ui/uikit';
import { Slider } from '@gravity-ui/uikit';
import { Link } from '@gravity-ui/uikit';
import { Tooltip } from '@gravity-ui/uikit';
import { ArrowShapeDownToLine } from '@gravity-ui/icons';
import { Icon } from '@gravity-ui/uikit';
import styles from './ModelConfigurator.module.scss';
import { useRef, useState, useEffect } from 'react';
import { useModelConfigurator } from './useModelConfigurator';
import ArrowUpRightFromSquareIcon from '@gravity-ui/icons/svgs/arrow-up-right-from-square.svg';
import MagicWandIcon from '@gravity-ui/icons/svgs/magic-wand.svg';
import {MagicWand} from '@gravity-ui/icons';
import dynamic from 'next/dynamic';
import CurvesEditor from './CurvesEditor';

// Динамически импортируем transformers только на клиенте
const ModelConfiguratorClient = dynamic(() => import('./ModelConfiguratorClient'), {
  ssr: false,
});

const ModelConfigurator = () => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
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
    contrast,
    setContrast,
    isCurvesMode,
    setIsCurvesMode,
    curveValues,
    setCurveValues,
    resetCurve,
  } = useModelConfigurator(containerRef);

  useEffect(() => {
    const initModel = async () => {
      try {
        setModelLoading(true);
        modelRef.current = await pipeline('depth-estimation', 'Xenova/depth-anything-small-hf');
        setModelLoading(false);
      } catch (err) {
        setError('Ошибка при инициализации модели: ' + err.message);
        setModelLoading(false);
      }
    };
    initModel();
  }, []);

  const processImage = async (imageUrl) => {
    if (!imageUrl || !modelRef.current) return;

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

  const handleButtonClick = async () => {
    fileInputRef.current.click();
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

  return (
    <>
      <Text variant="display-1" style={{ padding: '0px'}}>Конфигуратор 3D-модели</Text>
      <div className={styles.container}>
        <Row space="2">
          <Col s="8" space="2">
            <div className={styles.modelWrapper}>
              <Card type="container" view="outlined" style={{ height: '100%' }}>
                <div ref={containerRef} className={styles.modelContainer} />
              </Card>
            </div>
          </Col>

          <Col s="4" space="2">
            <Card type="container" view="outlined" style={{ height: '100%' }}>
              <div className={styles.settingsContainer}>
                <Text variant="header-1">Настройки</Text>

                {/* Группа 1: Карта высот */}
                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Карта высот</Text>
                  <Text variant="body-2" color="secondary">
                    Карта высот определяет форму рельефа на пластине. Более светлые области соответствуют более высоким точкам.
                  </Text>
                  <Link href="/depth-map" view="normal">
                    Подробнее о картах высот
                  </Link>
                  <ModelConfiguratorClient
                    fileInputRef={fileInputRef}
                    setFile={setFile}
                    isInverted={isInverted}
                    setIsInverted={setIsInverted}
                    contrast={contrast}
                    setContrast={setContrast}
                    isCurvesMode={isCurvesMode}
                    setIsCurvesMode={setIsCurvesMode}
                    curveValues={curveValues}
                    setCurveValues={setCurveValues}
                    file={file}
                  />
                 
                  {file && (
                    <Text variant="body-2" color="secondary" className={styles.fileName}>
                      Загруженный файл: {file.name}
                    </Text>
                  )}
                </div>

                {/* Группа 2: Настройки изображения */}
                {file && (
                  <div className={styles.settingsGroup}>
                    <Text variant="subheader-2">Настройки изображения</Text>
                    <div className={styles.switchContainer}>
                      <div>
                        <Tooltip content="Инвертирует карту высот, меняя местами высокие и низкие точки. Полезно, если рельеф получился обратным желаемому.">
                          <Text variant="body-2">Инвертировать изображение</Text>
                        </Tooltip>
                      </div>
                      <Switch checked={isInverted} onUpdate={setIsInverted} />
                    </div>
                    <div className={styles.switchContainer}>
                      <div>
                        <Tooltip content="Включите для использования кривых яркости вместо простого контраста. Кривые дают более гибкий контроль над преобразованием яркости.">
                          <Text variant="body-2">Режим кривых</Text>
                        </Tooltip>
                      </div>
                      <Switch checked={isCurvesMode} onUpdate={setIsCurvesMode} />
                    </div>
                    {isCurvesMode ? (
                      <div className={styles.curvesContainer}>
                        <div className={styles.curvesHeader}>
                          <Tooltip content="Настройте кривую яркости для более точного контроля над рельефом. Перетаскивайте точки для изменения формы кривой, добавляйте новые точки кликом, удаляйте точки клавишей Delete.">
                            <Text variant="body-2">Кривая яркости</Text>
                          </Tooltip>
                          <Button view="flat" size="s" onClick={resetCurve}>
                            Сбросить кривую
                          </Button>
                        </div>
                        <CurvesEditor
                          value={curveValues}
                          onChange={setCurveValues}
                        />
                      </div>
                    ) : (
                      <div className={styles.sliderContainer}>
                        <Tooltip content="Увеличивает или уменьшает разницу между высокими и низкими точками. Положительные значения делают рельеф более выраженным, отрицательные - более плавным.">
                          <Text variant="body-2">Контраст</Text>
                        </Tooltip>
                        <Slider
                          value={contrast}
                          onUpdate={setContrast}
                          min={-255}
                          max={255}
                          step={1}
                          tooltipDisplay="on"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Группа 3: Основные параметры модели */}
                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Основные параметры</Text>
                  <Tooltip content="Ширина пластины в миллиметрах. Высота будет рассчитана автоматически с сохранением пропорций изображения.">
                    <NumberInput
                      label="Ширина пластины (мм):"
                      placeholder="Введите ширину"
                      min={10}
                      max={3000}
                      value={width}
                      onUpdate={setWidth}
                    />
                  </Tooltip>
                  <Tooltip content="Высота пластины рассчитывается автоматически на основе ширины и пропорций изображения.">
                    <NumberInput
                      label="Высота пластины (мм):"
                      placeholder="Автоматически"
                      min={10}
                      max={3000}
                      value={Math.round(width * aspectRatio)}
                      disabled
                    />
                  </Tooltip>
                  <Tooltip content="Толщина базовой пластины в миллиметрах. Это минимальная толщина модели в самых низких точках рельефа.">
                    <NumberInput
                      label="Толщина пластины (мм):"
                      placeholder="Введите толщину"
                      min={1}
                      max={3000}
                      value={plateThickness}
                      onUpdate={setPlateThickness}
                    />
                  </Tooltip>
                  <Tooltip content="Максимальная высота рельефа в миллиметрах. Определяет, насколько сильно будут выступать самые высокие точки модели.">
                    <NumberInput
                      label="Высота рельефа (мм):"
                      placeholder="Введите высоту рельефа"
                      min={0}
                      max={3000}
                      value={reliefHeight}
                      onUpdate={setReliefHeight}
                    />
                  </Tooltip>
                </div>

                {/* Группа 4: Настройки визуализации */}
                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Настройки визуализации</Text>
                  <div className={styles.switchContainer}>
                    <div>
                      <Tooltip content="Отображает модель в виде сетки, что помогает лучше понять структуру рельефа и оценить качество модели.">
                        <Text variant="body-2">Показать сетку</Text>
                      </Tooltip>
                    </div>
                    <Switch checked={isWireframe} onUpdate={setIsWireframe} />
                  </div>
                  <div className={styles.sliderContainer}>
                    <Tooltip content="Определяет детализацию модели. Более высокое разрешение даёт более плавный рельеф, но увеличивает время обработки и размер файла. Рекомендуется использовать значение от 100 до 256 для оптимального баланса между качеством и производительностью.">
                      <Text variant="body-2">Разрешение сетки</Text>
                    </Tooltip>
                    <Slider
                      value={gridResolution}
                      onUpdate={setGridResolution}
                      min={10}
                      max={512}
                      step={1}
                      tooltipDisplay="on"
                    />
                  </div>
                </div>

                <div className={styles.exportButton}>
                  <Tooltip content="Экспортирует модель в формате STL, который можно использовать для 3D-печати или дальнейшего редактирования в программах для работы с 3D.">
                    <Button size="xl" view="action" width="max" onClick={exportSTL}>
                      Экспорт 3D-модели
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ModelConfigurator;
