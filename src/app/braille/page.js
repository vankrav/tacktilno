'use client';
import { PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';
import '@gravity-ui/page-constructor/styles/styles.scss';
import customBlocks from '../../content/custom_blocks/custom_blocks-data.js';
import navigation from '../../content/navigation/navigation-data.js';
import content from '../../content/braille/braille-data.js';
const Braille = () => {
  return (
    <PageConstructorProvider>
      <PageConstructor navigation={navigation} custom={customBlocks} content={content} />
    </PageConstructorProvider>
  );
};

export default Braille;
