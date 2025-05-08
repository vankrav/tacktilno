import HelloWorld from '../../components/HelloWorld/HelloWorld';
import CubeGenerator from '../../components/CubeGenerator/CubeGenerator';
import BrailleConfigurator from '../../components/BrailleConfigurator/BrailleConfigurator';
import ModelConfigurator from '../../components/ModelConfigurator/ModelConfigurator';
const customBlocks = {
  blocks: {
    'hello-world': HelloWorld,
    'cube-generator': CubeGenerator,
    'braille-configurator': BrailleConfigurator,
    'model-configurator': ModelConfigurator,
  },
};

export default customBlocks;
