import { Card } from '@gravity-ui/uikit';
import { Row } from '@gravity-ui/uikit';
import { Col } from '@gravity-ui/uikit';
import { TextArea } from '@gravity-ui/uikit';
import { NumberInput } from '@gravity-ui/uikit';
import { Text } from '@gravity-ui/uikit';
import { Button } from '@gravity-ui/uikit';
import { ArrowShapeDownToLine } from '@gravity-ui/icons';
import { Icon } from '@gravity-ui/uikit';

const ModelConfigurator = () => {
  return (
    <>
      <Text variant="display-1">Конфигуратор 3D-модели</Text>
      <div style={{ marginTop: '20px' }}>
        <Row space="2">
          <Col s="8" space="2">
            <Card type="container" view="filled" style={{ height: '500px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                3D-модель
              </div>
            </Card>
          </Col>

          <Col s="4" space="2">
            <Card type="container" view="outlined" style={{ height: '100%' }}>
              <div
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  height: '100%',
                }}
              >
                <Text variant="header-1">Настройки</Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Text variant="subheader-2">Карта высот</Text>
                  <Button size="l" view="normal" width="max">
                    <Icon data={ArrowShapeDownToLine} size={18} />
                    Загрузить изображение
                  </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Text variant="subheader-2">Размеры пластины</Text>
                  <NumberInput
                    label="Ширина (мм):"
                    placeholder="Введите ширину"
                    min={10}
                    max={3000}
                    defaultValue={100}
                  />
                  <NumberInput
                    label="Высота (мм):"
                    placeholder="Введите высоту"
                    min={10}
                    max={3000}
                    defaultValue={100}
                  />
                  <NumberInput
                    label="Толщина (мм):"
                    placeholder="Введите толщину"
                    min={10}
                    max={3000}
                    defaultValue={3}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Text variant="subheader-2">Высота рельефа</Text>
                  <NumberInput
                    label="Высота рельефа (мм):"
                    placeholder="Введите высоту рельефа"
                    min={10}
                    max={3000}
                    defaultValue={10}
                  />
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Button size="xl" view="action" width="max">
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
