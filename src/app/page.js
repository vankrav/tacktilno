'use client';
import { PageConstructorProvider } from '@gravity-ui/page-constructor';
import '@gravity-ui/page-constructor/styles/styles.scss';
import AccessiblePageConstructor from '../components/AccessiblePageConstructor/AccessiblePageConstructor';

import navigation from '../content/navigation/navigation-data.js';
import content from '../content/home/home-data.js';

const Home = () => {
  return (
    <PageConstructorProvider>
      <AccessiblePageConstructor content={content} navigation={navigation} />
    </PageConstructorProvider>
  );
};

export default Home;
