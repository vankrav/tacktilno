import HelloWorld from '../../components/HelloWorld/HelloWorld';
import CubeGenerator from '../../components/CubeGenerator/CubeGenerator';
import BrailleConfigurator from '../../components/BrailleConfigurator/BrailleConfigurator';
const customBlocks = {
  blocks: {
    'hello-world': HelloWorld,
    'cube-generator': CubeGenerator,
    'braille-configurator': BrailleConfigurator,
  }
};

export default customBlocks;