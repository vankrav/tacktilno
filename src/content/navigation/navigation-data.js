import PlusIcon from '@gravity-ui/icons/svgs/plus.svg';
import BulbIcon from '@gravity-ui/icons/svgs/bulb.svg';
import HandIcon from '@gravity-ui/icons/svgs/hand.svg';

const navigation = {
  header: {
    leftItems: [
      {
        items: [
          {
            text: 'Тактильная модель по изображению',
            type: 'link',
            url: '/tactile_model',
          },
          {
            text: 'Табличка с шрифтом Брайля',
            type: 'link',
            url: '/braille',
          },
        ],
        icon: PlusIcon,
        text: 'Создать 3D-модель',
        type: 'dropdown',
      },

      {
        icon: BulbIcon,
        text: 'База знаний',
        type: 'link',
        url: '/',
      },
    ],
    rightItems: [
      {
        text: 'Обратная связь',
        theme: 'action',
        type: 'button',
        url: '/',
      },
    ],
  },
  logo: {
    dark: {
      icon: HandIcon,
      text: 'тактильно',
    },
    icon: HandIcon,
    light: {
      text: 'тактильно',
    },
    text: 'Logo',
  },
};

export default navigation;
