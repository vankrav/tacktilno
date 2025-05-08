'use client';
import { PageConstructorProvider, PageConstructor } from '@gravity-ui/page-constructor';
import '@gravity-ui/page-constructor/styles/styles.scss';
import navigation from '../../content/navigation/navigation-data.js';
import content from '../../content/tactile_model/tactile_model-data.js';
import customBlocks from '../../content/custom_blocks/custom_blocks-data.js';

const TactileModel = () => {
  return (
    <PageConstructorProvider>
      <PageConstructor navigation={navigation} custom={customBlocks} content={content} />
    </PageConstructorProvider>
  );
};

export default TactileModel;
