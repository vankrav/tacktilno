import { useEffect, useRef, useState } from 'react';
import { Button } from '@gravity-ui/uikit';
import styles from './ModelConfigurator.module.scss';

const CurvesEditor = ({ onChange, value = Array.from({ length: 256 }, (_, i) => i), onReset }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activePoint, setActivePoint] = useState(null);
  const [points, setPoints] = useState([
    { x: 0, y: 0 },
    { x: 255, y: 255 }
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    ctx.scale(dpr, dpr);
    
    drawCurve();
  }, [points]);

  useEffect(() => {
    if (onReset) {
      const resetPoints = [
        { x: 0, y: 0 },
        { x: 255, y: 255 }
      ];
      setPoints(resetPoints);
      const resetValues = Array.from({ length: 256 }, (_, i) => i);
      onChange(resetValues);
    }
  }, [onReset]);

  useEffect(() => {
    // Проверяем, является ли value линейной кривой
    const isLinearCurve = value.every((v, i) => v === i);
    if (isLinearCurve) {
      setPoints([
        { x: 0, y: 0 },
        { x: 255, y: 255 }
      ]);
    }
  }, [value]);

  const drawCurve = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    // Очищаем канвас
    ctx.clearRect(0, 0, width, height);

    // Рисуем сетку
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const pos = (width / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(width, pos);
      ctx.stroke();
    }

    // Рисуем диагональ
    ctx.strokeStyle = '#cccccc';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, 0);
    ctx.stroke();

    // Сортируем точки по x для корректного построения кривой
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);

    // Рисуем кривую Безье
    ctx.strokeStyle = 'var(--g-color-base-brand)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Для каждой пары точек создаем сегмент кривой Безье
    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const p0 = sortedPoints[i];
      const p1 = sortedPoints[i + 1];
      
      if (i === 0) {
        ctx.moveTo(p0.x * width / 255, height - p0.y * height / 255);
      }

      // Вычисляем контрольные точки для кривой Безье
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      
      // Используем более плавное распределение контрольных точек
      const tension = 0.7; // Увеличиваем натяжение для более плавной кривой
      const cp1x = p0.x + dx * tension;
      const cp1y = p0.y + dy * tension;
      const cp2x = p1.x - dx * tension;
      const cp2y = p1.y - dy * tension;

      // Преобразуем координаты в пространство канваса
      const x0 = p0.x * width / 255;
      const y0 = height - p0.y * height / 255;
      const x1 = p1.x * width / 255;
      const y1 = height - p1.y * height / 255;
      const cp1x_canvas = cp1x * width / 255;
      const cp1y_canvas = height - cp1y * height / 255;
      const cp2x_canvas = cp2x * width / 255;
      const cp2y_canvas = height - cp2y * height / 255;

      ctx.bezierCurveTo(
        cp1x_canvas, cp1y_canvas,
        cp2x_canvas, cp2y_canvas,
        x1, y1
      );
    }
    
    ctx.stroke();

    // Рисуем точки
    points.forEach((point, index) => {
      ctx.fillStyle = activePoint === index ? 'var(--g-color-base-danger)' : 'var(--g-color-base-brand)';
      ctx.beginPath();
      ctx.arc(
        point.x * width / 255,
        height - point.y * height / 255,
        6,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  };

  const getPointFromEvent = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 255;
    const y = 255 - ((e.clientY - rect.top) / rect.height) * 255;
    return { x: Math.max(0, Math.min(255, x)), y: Math.max(0, Math.min(255, y)) };
  };

  const findClosestPoint = (point, threshold = 10) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / 255;
    const scaleY = rect.height / 255;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const dx = (point.x - p.x) * scaleX;
      const dy = (point.y - p.y) * scaleY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < threshold) {
        return i;
      }
    }
    return null;
  };

  const handleMouseDown = (e) => {
    const point = getPointFromEvent(e);
    const index = findClosestPoint(point);
    
    if (index !== null) {
      setActivePoint(index);
      setIsDragging(true);
    } else if (e.target === canvasRef.current) {
      // Добавляем новую точку
      const newPoints = [...points, point].sort((a, b) => a.x - b.x);
      setPoints(newPoints);
      setActivePoint(newPoints.findIndex(p => p.x === point.x && p.y === point.y));
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || activePoint === null) return;
    
    const point = getPointFromEvent(e);
    const newPoints = [...points];
    
    // Ограничиваем перемещение точки по x, чтобы не пересекать соседние точки
    const prevPoint = points[activePoint - 1];
    const nextPoint = points[activePoint + 1];
    
    let newX = point.x;
    if (prevPoint) newX = Math.max(newX, prevPoint.x + 1);
    if (nextPoint) newX = Math.min(newX, nextPoint.x - 1);
    
    newPoints[activePoint] = { x: newX, y: point.y };
    setPoints(newPoints);
    
    // Генерируем массив значений для кривой
    const curveValues = generateCurveValues(newPoints);
    onChange(curveValues);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActivePoint(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Delete' && activePoint !== null && points.length > 2) {
      const newPoints = points.filter((_, i) => i !== activePoint);
      setPoints(newPoints);
      setActivePoint(null);
      
      // Генерируем массив значений для кривой
      const curveValues = generateCurveValues(newPoints);
      onChange(curveValues);
    }
  };

  const generateCurveValues = (points) => {
    const values = new Array(256);
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    
    // Для каждого значения x находим соответствующее значение y
    for (let x = 0; x < 256; x++) {
      // Находим два ближайших опорных точки
      let p1 = sortedPoints[0];
      let p2 = sortedPoints[sortedPoints.length - 1];
      
      for (let i = 0; i < sortedPoints.length - 1; i++) {
        if (sortedPoints[i].x <= x && sortedPoints[i + 1].x >= x) {
          p1 = sortedPoints[i];
          p2 = sortedPoints[i + 1];
          break;
        }
      }
      
      // Вычисляем параметр t для интерполяции
      const t = (x - p1.x) / (p2.x - p1.x);
      
      // Используем кубическую интерполяцию для более плавного перехода
      const tension = 0.6; // Увеличиваем натяжение для более плавной интерполяции
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      
      // Вычисляем контрольные точки с дополнительным сглаживанием
      const cp1x = p1.x + dx * tension;
      const cp1y = p1.y + dy * tension;
      const cp2x = p2.x - dx * tension;
      const cp2y = p2.y - dy * tension;
      
      // Кубическая интерполяция Безье с дополнительным сглаживанием
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;
      const t2 = t * t;
      const t3 = t2 * t;
      
      // Добавляем сглаживающий коэффициент
      const smoothFactor = 0.5;
      const smoothedY = 
        mt3 * p1.y +
        3 * mt2 * t * (cp1y * (1 - smoothFactor) + p1.y * smoothFactor) +
        3 * mt * t2 * (cp2y * (1 - smoothFactor) + p2.y * smoothFactor) +
        t3 * p2.y;
      
      values[x] = Math.round(smoothedY);
    }
    
    return values;
  };

  useEffect(() => {
    const curveValues = generateCurveValues(points);
    onChange(curveValues);
  }, []);

  return (
    <div className={styles.curvesEditor}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{ width: '100%', height: '200px', cursor: 'crosshair' }}
      />
    </div>
  );
};

export default CurvesEditor; 