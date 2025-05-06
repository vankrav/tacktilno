'use client'
import {PageConstructor, PageConstructorProvider} from '@gravity-ui/page-constructor';
import '@gravity-ui/page-constructor/styles/styles.scss';

import navigation from '../content/navigation/navigation-data.js';
import content from '../content/home/home-data.js';
const Home = () => {

  return (
    <PageConstructorProvider>
      <PageConstructor content={content} navigation={navigation}/>
    </PageConstructorProvider>
  );
};

export default Home;