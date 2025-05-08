import { Card } from "@gravity-ui/uikit";
import { Row } from "@gravity-ui/uikit";
import { Col } from "@gravity-ui/uikit";
import { TextArea } from "@gravity-ui/uikit";
import { NumberInput } from "@gravity-ui/uikit";
import { Text } from "@gravity-ui/uikit";
import { Button } from "@gravity-ui/uikit";
const BrailleConfigurator = () => {
  return (
    <>
      <h1>Конфигуратор шрифта Брайля</h1>
      <Row space="2">
        <Col s="8"  space="2">
          <Card type="container" view="filled" style={{ height: "500px" }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              3D-модель
            </div>
          </Card>
          <TextArea placeholder="Введите текст" style={{ marginTop: "10px", height: "100px" }}></TextArea>
        </Col>
       
        <Col s="4" space="2">
            <Card type="container" view="filled" style={{ height: "100%" }}>
              <div style={{ 
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                height: "100%"
              }}>
                <Text variant="header-1">Настройки</Text>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Text variant="subheader-2">Размеры</Text>
                  <NumberInput label="Ширина (мм):" placeholder="Введите ширину" min={10} max={3000} /> 
                  <NumberInput label="Высота (мм):" placeholder="Введите высоту" min={10} max={3000} /> 
                  <NumberInput label="Толщина (мм):" placeholder="Введите толщину" min={10} max={3000} /> 
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Text variant="subheader-2">Отступы</Text>
                  <NumberInput label="Отступ сверху (мм):" placeholder="Введите отступ сверху" min={10} max={3000} /> 
                  <NumberInput label="Отступ сбоку (мм):" placeholder="Введите отступ сбоку" min={10} max={3000} /> 
                </div>

                <div style={{ marginTop: "auto" }}>
                  <Button size="xl" view="action" width="max">Экспорт модели</Button>
                </div>
              </div>
            </Card>
        </Col>
      </Row>
    </>
  );
};

export default BrailleConfigurator; 