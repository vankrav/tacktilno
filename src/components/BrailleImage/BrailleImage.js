import React, { useRef, useState, useEffect } from 'react';
import codes from '../../scripts/codes';

const DPI = 150; // Стандартное количество точек на дюйм
const MM_TO_INCH = 25.4; // Конвертация миллиметров в дюймы

const brailleMap = codes;

const BrailleCanvas = () => {
  const canvasRef = useRef(null);

  const [text, setText] = useState('');
  const [pageWidth, setPageWidth] = useState(100); // A4 ширина в мм
  const [pageHeight, setPageHeight] = useState(100); // A4 высота в мм
  const [marginTopMm, setMarginTopMm] = useState(10); // Отступ сверху в мм
  const [marginLeftMm, setMarginLeftMm] = useState(10); // Отступ слева в мм

  const [dotRadiusMm, setDotRadiusMm] = useState(0.9);
  const [dotSpacingMm, setDotSpacingMm] = useState(2.7);
  const [charSpacingMm, setCharSpacingMm] = useState(6.6);
  const [wordSpacingMm, setWordSpacingMm] = useState(6.4);
  const [lineSpacingMm, setLineSpacingMm] = useState(10.8);

  const mmToPixels = mm => (mm / MM_TO_INCH) * DPI;

  const settings = {
    dotRadius: mmToPixels(dotRadiusMm),
    dotSpacing: mmToPixels(dotSpacingMm),
    charSpacing: mmToPixels(charSpacingMm),
    wordSpacing: mmToPixels(wordSpacingMm),
    lineSpacing: mmToPixels(lineSpacingMm),
    marginTop: mmToPixels(marginTopMm),
    marginLeft: mmToPixels(marginLeftMm),
  };

  // Перевод мм в пиксели

  const drawBrailleChar = (ctx, x, y, dots) => {
    const positions = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 0],
      [2, 1],
    ];

    dots.forEach(dot => {
      const [row, col] = positions[dot - 1];
      const dotX = x + col * settings.dotSpacing;
      const dotY = y + row * settings.dotSpacing;

      const gradient = ctx.createRadialGradient(
        dotX,
        dotY,
        0, // Начальная точка градиента
        dotX,
        dotY,
        settings.dotRadius // Конечная точка градиента
      );
      gradient.addColorStop(0, 'black'); // Черный в центре
      gradient.addColorStop(1, 'white'); // Белый по краям

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(dotX, dotY, settings.dotRadius, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawBraille = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Установить белый фон
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = settings.marginLeft;
    let y = settings.marginTop;

    for (const char of text.toLowerCase()) {
      if (char === ' ') {
        x += settings.wordSpacing;
        continue;
      }

      if (char === '\n') {
        x = settings.marginLeft; // Начать с новой строки с учетом отступа
        y += settings.lineSpacing;
        continue;
      }

      const dots = brailleMap[char];
      if (dots) {
        drawBrailleChar(ctx, x, y, dots);
        x += settings.charSpacing;
      }

      // Переход на новую строку, если текст выходит за границы страницы
      if (x + settings.charSpacing > canvas.width) {
        x = settings.marginLeft;
        y += settings.lineSpacing;
      }

      // Если текст выходит за высоту страницы, остановить вывод
      if (y + settings.lineSpacing > canvas.height) {
        break;
      }
    }
  };

  // Изменяем размер холста, если изменяются размеры страницы
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = mmToPixels(pageWidth);
      canvas.height = mmToPixels(pageHeight);
      drawBraille();
    }
  }, [pageWidth, pageHeight, settings, text]);

  const saveCanvasAsImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'braille.png';
      link.click();
    }
  };

  return (
    <div style={{ marginBottom: '10px', marginTop: '10px', marginLeft: '40px' }} role="main">
      <h2 tabIndex="0" aria-label="Преобразователь текста в шрифт Брайля">Преобразователь текста в шрифт Брайля</h2>
      <div role="form" aria-label="Настройки преобразования">
        <h3 tabIndex="0" aria-label="Настройки страницы">Настройки страницы</h3>
        <div role="group" aria-labelledby="page-settings">
          <label htmlFor="page-width">
            Ширина страницы (мм):
            <input
              id="page-width"
              type="number"
              value={pageWidth}
              onChange={e => setPageWidth(parseFloat(e.target.value))}
              style={{ marginLeft: '10px' }}
              aria-label="Ширина страницы в миллиметрах"
            />
          </label>
          <br />
          <label htmlFor="page-height">
            Высота страницы (мм):
            <input
              id="page-height"
              type="number"
              value={pageHeight}
              onChange={e => setPageHeight(parseFloat(e.target.value))}
              style={{ marginLeft: '10px' }}
              aria-label="Высота страницы в миллиметрах"
            />
          </label>
          <br />
          <label htmlFor="margin-top">
            Отступ сверху (мм):
            <input
              id="margin-top"
              type="number"
              value={marginTopMm}
              onChange={e => setMarginTopMm(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              min="0.1"
              style={{ marginLeft: '10px' }}
              aria-label="Отступ сверху в миллиметрах"
            />
          </label>
          <br />
          <label htmlFor="margin-left">
            Отступ слева (мм):
            <input
              id="margin-left"
              type="number"
              value={marginLeftMm}
              onChange={e => setMarginLeftMm(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              min="0.1"
              style={{ marginLeft: '10px' }}
              aria-label="Отступ слева в миллиметрах"
            />
          </label>
        </div>
        <br />
        <h3 tabIndex="0" aria-label="Настройки шрифта Брайля">Настройки шрифта Брайля</h3>
        <div role="group" aria-labelledby="braille-settings">
          <label htmlFor="dot-radius">
            Радиус точки (мм):
            <input
              id="dot-radius"
              type="number"
              value={dotRadiusMm}
              onChange={e => setDotRadiusMm(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              min="0.1"
              style={{ marginLeft: '10px' }}
              aria-label="Радиус точки в миллиметрах"
            />
          </label>
          <br />
          <label htmlFor="dot-spacing">
            Расстояние между точками (мм):
            <input
              id="dot-spacing"
              type="number"
              value={dotSpacingMm}
              onChange={e => setDotSpacingMm(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              min="0.1"
              style={{ marginLeft: '10px' }}
              aria-label="Расстояние между точками в миллиметрах"
            />
          </label>
          <br />
          <label htmlFor="char-spacing">
            Расстояние между символами (мм):
            <input
              id="char-spacing"
              type="number"
              value={charSpacingMm}
              onChange={e => setCharSpacingMm(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              min="0.1"
              style={{ marginLeft: '10px' }}
              aria-label="Расстояние между символами в миллиметрах"
            />
          </label>
          <br />
          <label htmlFor="word-spacing">
            Расстояние между словами (мм):
            <input
              id="word-spacing"
              type="number"
              value={wordSpacingMm}
              onChange={e => setWordSpacingMm(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              min="0.1"
              style={{ marginLeft: '10px' }}
              aria-label="Расстояние между словами в миллиметрах"
            />
          </label>
          <br />
          <label htmlFor="line-spacing">
            Межстрочное расстояние (мм):
            <input
              id="line-spacing"
              type="number"
              value={lineSpacingMm}
              onChange={e => setLineSpacingMm(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              min="0.1"
              style={{ marginLeft: '10px' }}
              aria-label="Межстрочное расстояние в миллиметрах"
            />
          </label>
        </div>
        <br />

        <h3>Текст</h3>
        <label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Введите текст"
            style={{ width: '50%', height: '100px' }}
          />
        </label>
        <br />
        <button onClick={saveCanvasAsImage} style={{ marginTop: '10px', marginBottom: '10px' }}>
          Сохранить как изображение
        </button>
        <br />
        <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
      </div>
    </div>
  );
};

export default BrailleCanvas;
