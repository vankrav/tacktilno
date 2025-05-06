'use client';

// import Link from 'next/link';
// import styles from './page.module.css';
import { Button, Col } from '@gravity-ui/uikit';


export default function Page2() {
  return (
    <div>
      <h1>Страница 2</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Button href="/" view="action" size="l">Главная</Button>
        <Button href="/page1" view="action" size="l">Страница 1</Button>
      </div>
    </div>
  );
}