'use client'
import { PageConstructorProvider, PageConstructor } from '@gravity-ui/page-constructor';

import '@gravity-ui/page-constructor/styles/styles.scss';

import navigation from '../../content/navigation/navigation-data.js';

const TacktileModel = () => {
  return (
    <PageConstructorProvider>
      <PageConstructor navigation={navigation}/>
      <h1>Braille</h1>
    </PageConstructorProvider>
  );
};

export default TacktileModel;