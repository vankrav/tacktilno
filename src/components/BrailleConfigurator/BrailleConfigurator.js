import { Card } from '@gravity-ui/uikit';
import { Row } from '@gravity-ui/uikit';
import { Col } from '@gravity-ui/uikit';
import { TextArea } from '@gravity-ui/uikit';
import { NumberInput } from '@gravity-ui/uikit';
import { Text } from '@gravity-ui/uikit';
import { Button } from '@gravity-ui/uikit';
import { Switch } from '@gravity-ui/uikit';
import { Slider } from '@gravity-ui/uikit';
import styles from './BrailleConfigurator.module.scss';
import { useRef } from 'react';
import { useBrailleConfigurator } from './useBrailleConfigurator';

const BrailleConfigurator = () => {
  const containerRef = useRef(null);
  const {
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
  } = useBrailleConfigurator(containerRef);

  return (
    <>
      <Text variant="display-1" style={{ padding: '0px'}}>Конфигуратор шрифта Брайля</Text>
      <div className={styles.container}>
        <Row space="2">
          <Col s="8" space="2">
            <Card type="container" view="outlined" style={{ height: '500px' }}>
              <div ref={containerRef} className={styles.modelContainer} />
            </Card>
            {/* {canvas && (
              <div className={styles.canvasContainer}>
                <Text variant="subheader-2">Предпросмотр изображения:</Text>
                <div className={styles.canvasWrapper}>
                  <img src={canvas.toDataURL()} alt="Предпросмотр" />
                </div>
              </div>
            )} */}
          </Col>

          <Col s="4" space="2">
            <Card type="container" view="outlined" style={{ height: '100%' }}>
              <div className={styles.settingsContainer}>
                <Text variant="header-1">Настройки</Text>
                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Текст</Text>
                  <TextArea
                    value={text}
                    onUpdate={setText}
                    placeholder="Введите текст"
                    minRows={3}
                    maxRows={6}
                  />
                </div>

                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Размеры пластины</Text>
                  <NumberInput
                    label="Ширина (мм):"
                    placeholder="Введите ширину"
                    min={1}
                    max={3000}
                    value={width || ''}
                    onUpdate={(value) => setWidth(value || 1)}
                  />
                  <NumberInput
                    label="Высота (мм):"
                    placeholder="Введите высоту"
                    min={1}
                    max={3000}
                    value={height || ''}
                    onUpdate={(value) => setHeight(value || 1)}
                  />
                  <NumberInput
                    label="Толщина (мм):"
                    placeholder="Введите толщину"
                    min={1}
                    max={3000}
                    value={plateThickness || ''}
                    onUpdate={(value) => setPlateThickness(value || 1)}
                  />
                </div>

                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Отступы</Text>
                  <NumberInput
                    label="Отступ сверху (мм):"
                    placeholder="Введите отступ"
                    min={1}
                    max={100}
                    value={marginTop || ''}
                    onUpdate={(value) => setMarginTop(value || 1)}
                  />
                  <NumberInput
                    label="Отступ слева (мм):"
                    placeholder="Введите отступ"
                    min={1}
                    max={100}
                    value={marginLeft || ''}
                    onUpdate={(value) => setMarginLeft(value || 1)}
                  />
                </div>

                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Настройки сетки</Text>
                  <div className={styles.sliderContainer}>
                  <div className={styles.switchContainer}>
                    <Text variant="body-2">Wireframe режим</Text>
                    <Switch checked={isWireframe} onUpdate={setIsWireframe} />
                  </div>
                    
                    <Slider
                      value={gridResolution}
                      onUpdate={setGridResolution}
                      min={10}
                      max={512}
                      step={1}
                      tooltipDisplay="on"
                     
                    />
                  </div>
                  <Text variant="body-2">Разрешение сетки: {gridResolution}</Text>
                  
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

export default BrailleConfigurator;
