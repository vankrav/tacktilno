'use client'
import {PageConstructor, PageConstructorProvider} from '@gravity-ui/page-constructor';
import '@gravity-ui/page-constructor/styles/styles.scss';

import navigation from '../../content/navigation/navigation-data.js';
const Braille = () => {

  return (
    <PageConstructorProvider>
      <PageConstructor navigation={navigation}/>
      <h1>Braille</h1>
    </PageConstructorProvider>
  );
};

export default Braille;