import { PageConstructor as BasePageConstructor } from '@gravity-ui/page-constructor';
import { useEffect } from 'react';

const AccessiblePageConstructor = (props) => {
  useEffect(() => {
    // Находим все элементы с aria-hidden и делаем их недоступными для фокуса
    const hiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    hiddenElements.forEach(element => {
      element.setAttribute('tabindex', '-1');
      const focusableElements = element.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements.forEach(focusable => {
        focusable.setAttribute('tabindex', '-1');
      });
    });
  }, []);

  return <BasePageConstructor {...props} />;
};

export default AccessiblePageConstructor; 