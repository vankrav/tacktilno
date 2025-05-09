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
import { ArrowShapeDownToLine } from '@gravity-ui/icons';
import { Icon } from '@gravity-ui/uikit';
import styles from './ModelConfigurator.module.scss';
import { useRef } from 'react';
import { useModelConfigurator } from './useModelConfigurator';
import ArrowUpRightFromSquareIcon from '@gravity-ui/icons/svgs/arrow-up-right-from-square.svg';

const ModelConfigurator = () => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
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
  } = useModelConfigurator(containerRef);

  const handleImageUpload = event => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Text variant="display-1" style={{ padding: '0px'}}>Конфигуратор 3D-модели</Text>
      <div className={styles.container}>
        <Row space="2">
          <Col s="8" space="2">
            <Card type="container" view="outlined" style={{ height: '500px' }}>
              <div ref={containerRef} className={styles.modelContainer} />
            </Card>
          </Col>

          <Col s="4" space="2">
            <Card type="container" view="outlined" style={{ height: '100%' }}>
              <div className={styles.settingsContainer}>
                <Text variant="header-1">Настройки</Text>
                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Карта высот</Text>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <Link href="/" view="normal">
                    Как сделать карту высот?
                  </Link>
                  <Button size="l" view="normal" width="max" onClick={handleButtonClick}>
                    <Icon data={ArrowShapeDownToLine} size={18} />
                    Загрузить изображение
                  </Button>
                  {file && (
                    <Text variant="body-2" color="secondary" className={styles.fileName}>
                      {file.name}
                    </Text>
                  )}
                  {file && (
                    <div className={styles.switchContainer}>
                      <Text variant="body-2">Инвертировать изображение</Text>
                      <Switch checked={isInverted} onUpdate={setIsInverted} />
                    </div>
                  )}
                  
                </div>

                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Размеры пластины</Text>
                  <NumberInput
                    label="Ширина (мм):"
                    placeholder="Введите ширину"
                    min={10}
                    max={3000}
                    value={width}
                    onUpdate={setWidth}
                  />
                  <NumberInput
                    label="Высота (мм):"
                    placeholder="Автоматически"
                    min={10}
                    max={3000}
                    value={Math.round(width * aspectRatio)}
                    disabled
                  />
                  <NumberInput
                    label="Толщина (мм):"
                    placeholder="Введите толщину"
                    min={1}
                    max={3000}
                    value={plateThickness}
                    onUpdate={setPlateThickness}
                  />
                </div>

                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Высота рельефа</Text>
                  <NumberInput
                    label="Высота рельефа (мм):"
                    placeholder="Введите высоту рельефа"
                    min={0}
                    max={3000}
                    value={reliefHeight}
                    onUpdate={setReliefHeight}
                  />
                </div>

                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Настройки сетки</Text>
                  <div className={styles.switchContainer}>
                    <Text variant="body-2">Wireframe режим</Text>
                    <Switch checked={isWireframe} onUpdate={setIsWireframe} />
                  </div>
                  <div className={styles.sliderContainer}>
                   
                    <Slider
                      value={gridResolution}
                      onUpdate={setGridResolution}
                      min={10}
                      max={512}
                      step={1}
                      tooltipDisplay="on"
                     
                    />
                     <Text variant="body-2">Разрешение сетки: {gridResolution}</Text>
                  </div>
                  
                </div>

                <div className={styles.exportButton}>
                  <Button size="xl" view="action" width="max" onClick={exportSTL}>
                    Экспорт 3D-модели
                  </Button>
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
