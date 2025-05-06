import { Card } from "@gravity-ui/uikit";
import { Row } from "@gravity-ui/uikit";
import { Col } from "@gravity-ui/uikit";
import { TextArea } from "@gravity-ui/uikit";

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
          <TextArea  style={{ marginTop: "10px", height: "100px" }}></TextArea>
        </Col>
       
        <Col s="4" space="2">
        
            <Card type="container" view="filled" style={{ height: "100%" }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              Настройки
            </div>
            </Card>
        </Col>
      </Row>
    </>
  );
};

export default BrailleConfigurator; 