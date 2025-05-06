'use client'
import { PageConstructorProvider, PageConstructor } from '@gravity-ui/page-constructor';
import '@gravity-ui/page-constructor/styles/styles.scss';
import navigation from '../../content/navigation/navigation-data.js';
import content from '../../content/tactile_model/tactile_model-data.js';
import HelloWorld from '../../components/HelloWorld/HelloWorld';

const customBlocks = {
  blocks: 
    {
      'hello-world': HelloWorld,
    }
};

const TactileModel = () => {
  return (
    <PageConstructorProvider>
      <PageConstructor 
        navigation={navigation} 
        custom={customBlocks}
        content={content}
      />
    </PageConstructorProvider>
  );
};

export default TactileModel;