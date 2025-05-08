const content = {
  blocks: [
    {
      buttons: [
        {
          text: 'Тактильная модель по изображению\r',
          theme: 'action',
          url: '/tactile_model',
        },
        {
          text: 'Табличка с шрифтом Брайля',
          theme: 'outlined',
          url: '/braille',
        },
      ],
      description:
        '<p> Создавайте 3D-модели тактильных информационных материалов, <br/>адаптированных для 3D-печати.</p> ',
      title: 'Простой конфигуратор тактильных моделей.',
      type: 'header-block',
      verticalOffset: 'm',
      width: 'm',
      image: {
        disableCompress: true,
        dark: '/heart.png',
        light: '/heart.webp',
        style: {
          height: 'auto',
          width: 'auto',
        },
      },
    },
    {
      centered: true,
      description: 'Тут написано как работает\n',
      items: [
        {
          additionalInfo: undefined,
          border: 'shadow',
          buttons: [
            {
              text: 'Button 1',
              theme: 'action',
              url: 'https://example.com',
            },
            {
              text: 'Button 2',
              theme: 'outlined',
              url: '#',
            },
          ],
          caption: undefined,
          list: [
            {
              icon: {
                dark: '/page-constructor/story-assets/icon_1_dark.svg',
                light: '/page-constructor/story-assets/icon_1_light.svg',
              },
              text: '<p><strong>Ut enim ad minim veniam</strong> <a href="https://example.com">quis nostrud</a> exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>\n',
            },
            {
              icon: {
                dark: '/page-constructor/story-assets/icon_3_dark.svg',
                light: '/page-constructor/story-assets/icon_3_light.svg',
              },
              text: '<p><strong>Ut enim ad minim veniam</strong> <a href="https://example.com">quis nostrud</a> exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>\n',
            },
            {
              icon: {
                dark: '/page-constructor/story-assets/icon_2_dark.svg',
                light: '/page-constructor/story-assets/icon_2_light.svg',
              },
              text: '<p><strong>Ut enim ad minim veniam</strong> <a href="https://example.com">quis nostrud</a> exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>\n',
            },
          ],
          media: {
            dark: {
              image: '/page-constructor/story-assets/img_8-12_dark.png',
            },
            light: {
              image: '/heart.webp',
            },
          },
          tabName: 'Тактильная модель по изображению',
          text: '<p><strong>Ut enim ad minim veniam</strong> <a href="https://example.com">quis nostrud</a> exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n',
          title: 'Тактильная модель по изображению',
        },
        {
          additionalInfo: undefined,
          border: 'shadow',
          caption: '<p>Dolor sit amet</p>\n',
          links: [
            {
              arrow: true,
              text: 'Link',
              theme: 'normal',
              url: 'https://example.com',
            },
          ],
          list: undefined,
          media: {
            dark: {
              video: {
                loop: {
                  start: 0,
                },
                src: [
                  '/page-constructor/story-assets/video_8-12_dark.webm',
                  '/page-constructor/story-assets/video_8-12_dark.mp4',
                  '/page-constructor/story-assets/video_8-12_dark.png',
                ],
              },
            },
            light: {
              video: {
                loop: {
                  start: 0,
                },
                src: [
                  '/page-constructor/story-assets/video_8-12_light.webm',
                  '/page-constructor/story-assets/video_8-12_light.mp4',
                  '/page-constructor/story-assets/video_8-12_light.png',
                ],
              },
            },
          },
          tabName: 'Табличка с шрифтом Брайля',
          text: '<ul>\n<li>Ut enim ad minim veniam</li>\n<li>Ut enim ad minim veniam</li>\n</ul>\n',
          title: 'Lorem ipsum',
        },
      ],
      title: {
        text: 'Как это работает?',
      },
      type: 'tabs-block',
    },
    {
      items: [
        {
          link: {
            arrow: true,
            text: 'Documentation',
            theme: 'normal',
            url: '#',
          },
          text: '<p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> ',
          title: 'Lorem ipsum dolor sit amet 0',
        },
        {
          link: {
            arrow: true,
            text: 'Documentation',
            theme: 'normal',
            url: '#',
          },
          text: '<p>laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> ',
          title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco? 1',
        },
        {
          link: {
            arrow: true,
            text: 'Documentation',
            theme: 'normal',
            url: '#',
          },
          text: '<p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> ',
          title: 'Lorem ipsum dolor sit amet 2',
        },
        {
          link: {
            arrow: true,
            text: 'Documentation',
            theme: 'normal',
            url: '#',
          },
          text: '<p>laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> ',
          title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco? 3',
        },
        {
          link: {
            arrow: true,
            text: 'Documentation',
            theme: 'normal',
            url: '#',
          },
          text: '<p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> ',
          title: 'Lorem ipsum dolor sit amet 4',
        },
        {
          link: {
            arrow: true,
            text: 'Documentation',
            theme: 'normal',
            url: '#',
          },
          text: '<p>laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> ',
          title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco? 5',
        },
        {
          link: {
            arrow: true,
            text: 'Documentation',
            theme: 'normal',
            url: '#',
          },
          text: '<p>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> ',
          title: 'Lorem ipsum dolor sit amet 6',
        },
        {
          link: {
            arrow: true,
            text: 'Documentation',
            theme: 'normal',
            url: '#',
          },
          text: '<p>laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> ',
          title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco? 7',
        },
      ],
      links: [
        {
          arrow: true,
          text: 'Посмотреть оригинал',
          theme: 'normal',
          url: '/security',
        },
      ],
      text: 'Здесь представлены рекомендации по настройкам 3д печати и общие сведенья о тактильных моделях<br/><br/> Данные рекомендации основаны на том-то том-то такой-то сайт',
      title: 'База знаний',
      type: 'foldable-list-block',
    },
    {
      children: [
        {
          icon: '/page-constructor/story-assets/icon_1_light.svg',
          text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          title: 'Lorem ipsum dolor sit amet',
          type: 'basic-card',
          url: 'https://example.com',
        },
        {
          icon: '/page-constructor/story-assets/icon_2_light.svg',
          text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          title: 'Lorem ipsum dolor sit amet',
          type: 'basic-card',
          url: 'https://example.com',
        },
        {
          icon: '/page-constructor/story-assets/icon_3_light.svg',
          text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          title: 'Lorem ipsum dolor sit amet',
          type: 'basic-card',
          url: 'https://example.com',
        },
        {
          icon: '/page-constructor/story-assets/icon_4_light.svg',
          text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          title: 'Lorem ipsum dolor sit amet',
          type: 'basic-card',
          url: 'https://example.com',
        },
        {
          icon: '/page-constructor/story-assets/icon_1_light.svg',
          text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          title: 'Lorem ipsum dolor sit amet',
          type: 'basic-card',
          url: 'https://example.com',
        },
      ],
      title: {
        text: 'Slider',
        url: 'https://example.com',
      },
      type: 'slider-block',
    },

    {
      button: {
        text: 'Learn more',
        url: 'https://example.com',
      },
      color: {
        dark: '#262626',
        light: '#EFF2F8',
      },
      disableCompress: true,
      image: {
        dark: '/page-constructor/story-assets/img_8-12_dark.png',
        light: '/page-constructor/story-assets/img_8-12_light.png',
      },
      subtitle:
        '<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p> ',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      type: 'banner-block',
    },
  ],
};

export default content;
