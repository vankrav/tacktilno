import { Card } from '@gravity-ui/uikit';
import { Row } from '@gravity-ui/uikit';
import { Col } from '@gravity-ui/uikit';
import { TextArea } from '@gravity-ui/uikit';
import { NumberInput } from '@gravity-ui/uikit';
import { Text } from '@gravity-ui/uikit';
import { Button } from '@gravity-ui/uikit';
import { Switch } from '@gravity-ui/uikit';
import { Slider } from '@gravity-ui/uikit';
import { Tooltip } from '@gravity-ui/uikit';
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
      <Text variant="display-1" style={{ padding: '0px'}} aria-label="Конфигуратор шрифта Брайля" tabIndex="0">Конфигуратор шрифта Брайля</Text>
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

                {/* Группа 1: Текст */}
                <div className={styles.settingsGroup}>
                  <Text variant="subheader-2">Текст</Text>
                  <Text variant="body-2" color="secondary">
                    Введите текст, который будет преобразован в шрифт Брайля. Поддерживаются русские и английские буквы, цифры и знаки препинания.
                  </Text>
                  <TextArea
                    value={text}
                    onUpdate={setText}
                    placeholder="Введите текст"
                    minRows={3}
                    maxRows={6}
                  />
                </div>

                {/* Группа 2: Основные параметры модели */}
                <div className={styles.settingsGroup} role="group" aria-labelledby="basic-params">
                  <Text variant="subheader-2" id="basic-params" tabIndex="0">Основные параметры</Text>
                  <Tooltip content="Ширина пластины в миллиметрах. Определяет общую ширину модели.">
                    <NumberInput
                      label="Ширина (мм):"
                      placeholder="Введите ширину"
                      min={1}
                      max={3000}
                      value={width || ''}
                      onUpdate={(value) => setWidth(value || 1)}
                      aria-label="Ширина пластины в миллиметрах"
                    />
                  </Tooltip>
                  <Tooltip content="Высота пластины в миллиметрах. Определяет общую высоту модели.">
                    <NumberInput
                      label="Высота (мм):"
                      placeholder="Введите высоту"
                      min={1}
                      max={3000}
                      value={height || ''}
                      onUpdate={(value) => setHeight(value || 1)}
                    />
                  </Tooltip>
                  <Tooltip content="Толщина базовой пластины в миллиметрах. Это минимальная толщина модели.">
                    <NumberInput
                      label="Толщина (мм):"
                      placeholder="Введите толщину"
                      min={1}
                      max={3000}
                      value={plateThickness || ''}
                      onUpdate={(value) => setPlateThickness(value || 1)}
                    />
                  </Tooltip>
                </div>

                {/* Группа 3: Позиционирование */}
                <div className={styles.settingsGroup} role="group" aria-labelledby="positioning-params">
                  <Text variant="subheader-2" id="positioning-params" tabIndex="0">Позиционирование</Text>
                  <Text variant="body-2" color="secondary">
                    Настройте положение текста на пластине с помощью отступов.
                  </Text>
                  <Tooltip content="Отступ от верхнего края пластины в миллиметрах. Определяет, насколько высоко будет расположен текст.">
                    <NumberInput
                      label="Отступ сверху (мм):"
                      placeholder="Введите отступ"
                      min={1}
                      max={100}
                      value={marginTop || ''}
                      onUpdate={(value) => setMarginTop(value || 1)}
                    />
                  </Tooltip>
                  <Tooltip content="Отступ от левого края пластины в миллиметрах. Определяет, насколько далеко от левого края будет расположен текст.">
                    <NumberInput
                      label="Отступ слева (мм):"
                      placeholder="Введите отступ"
                      min={1}
                      max={100}
                      value={marginLeft || ''}
                      onUpdate={(value) => setMarginLeft(value || 1)}
                    />
                  </Tooltip>
                </div>

                {/* Группа 4: Настройки визуализации */}
                <div className={styles.settingsGroup} role="group" aria-labelledby="visualization-params">
                  <Text variant="subheader-2" id="visualization-params" tabIndex="0">Настройки визуализации</Text>
                  <div className={styles.switchContainer}>
                    <div>
                      <Tooltip content="Отображает модель в виде сетки, что помогает лучше понять структуру текста и оценить качество модели.">
                        <Text variant="body-2">Показать сетку</Text>
                      </Tooltip>
                    </div>
                    <Switch checked={isWireframe} onUpdate={setIsWireframe} />
                  </div>
                  <div className={styles.sliderContainer}>
                    <Tooltip content="Определяет детализацию модели. Более высокое разрешение даёт более плавные точки Брайля, но увеличивает время обработки и размер файла. Рекомендуется использовать значение от 100 до 256 для оптимального баланса между качеством и производительностью.">
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
                    <Button
                      size="xl"
                      view="action"
                      width="max"
                      onClick={exportSTL}
                      aria-label="Экспорт модели в формате STL"
                    >
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

export default BrailleConfigurator;
