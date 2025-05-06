'use client';

// import Link from 'next/link';
// import styles from './page.module.css';
import { Button, Col } from '@gravity-ui/uikit';


export default function Page1() {
  return (
    <div>
      <h1>Страница 1</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Button href="/" view="action" size="l">Главная</Button>
        <Button href="/page2" view="action" size="l">Страница 2</Button>
      </div>
    </div>
  );
} 