'use client';

import { useState, useRef, useEffect } from 'react';
import { pipeline, env } from '@xenova/transformers';
import './styles.scss';

// Настройка путей для загрузки моделей
env.localModelPath = '/models';
env.allowRemoteModels = true;
env.useBrowserCache = true;

export default function DepthMapPage() {
    const [image, setImage] = useState(null);
    const [depthMap, setDepthMap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modelLoading, setModelLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const modelRef = useRef(null);

    useEffect(() => {
        const initModel = async () => {
            try {
                setModelLoading(true);
                modelRef.current = await pipeline('depth-estimation', 'Xenova/depth-anything-small-hf');
                setModelLoading(false);
            } catch (err) {
                setError('Ошибка при инициализации модели: ' + err.message);
                setModelLoading(false);
            }
        };
        initModel();
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                setDepthMap(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = async () => {
        if (!image || !modelRef.current) return;

        setLoading(true);
        setError(null);

        try {
            const output = await modelRef.current(image);
            
            // Проверяем, что canvas существует и доступен
            if (!canvasRef.current) {
                throw new Error('Canvas не инициализирован');
            }

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Не удалось получить контекст canvas');
            }

            // Создаем временный canvas для обработки
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            // Устанавливаем размеры временного canvas
            tempCanvas.width = output.depth.width;
            tempCanvas.height = output.depth.height;
            
            // Преобразуем одноканальные данные в RGBA
            const depthData = output.depth.data;
            const rgbaData = new Uint8ClampedArray(depthData.length * 4);
            
            for (let i = 0; i < depthData.length; i++) {
                const depth = depthData[i];
                // Используем одно и то же значение для RGB каналов (grayscale)
                rgbaData[i * 4] = depth;     // R
                rgbaData[i * 4 + 1] = depth; // G
                rgbaData[i * 4 + 2] = depth; // B
                rgbaData[i * 4 + 3] = 255;   // A (полная непрозрачность)
            }
            
            // Создаем ImageData из RGBA данных
            const imageData = new ImageData(
                rgbaData,
                output.depth.width,
                output.depth.height
            );
            
            // Отображаем результат на временном canvas
            tempCtx.putImageData(imageData, 0, 0);
            
            // Устанавливаем размеры основного canvas
            canvas.width = output.depth.width;
            canvas.height = output.depth.height;
            
            // Копируем данные с временного canvas на основной
            ctx.drawImage(tempCanvas, 0, 0);
            
            // Сохраняем результат
            const dataUrl = canvas.toDataURL('image/png');
            setDepthMap(dataUrl);

            // Скачиваем результат
            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = 'depth-map.png';
            downloadLink.click();
        } catch (err) {
            setError('Ошибка при обработке изображения: ' + err.message);
            console.error('Детали ошибки:', err);
        } finally {
            setLoading(false);
        }
    };

    if (modelLoading) {
        return (
            <div className="container">
                <div className="card">
                    <div className="loading">
                        <div className="spinner"></div>
                        <span>Загрузка модели...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                <h1 className="title">Генерация карты высот</h1>
                
                <div className="content">
                    <button
                        className="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                    >
                        Загрузить изображение
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    {image && (
                        <div className="image-container">
                            <img
                                src={image}
                                alt="Загруженное изображение"
                                className="preview-image"
                            />
                            <button
                                className="button"
                                onClick={processImage}
                                disabled={loading}
                            >
                                Сгенерировать карту высот
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <span>Обработка изображения...</span>
                        </div>
                    )}

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}

                    <div className="depth-map-container" style={{ display: depthMap ? 'block' : 'none' }}>
                        <h2>Карта высот:</h2>
                        <canvas
                            ref={canvasRef}
                            className="depth-map"
                        />
                        <p className="info-text">
                            Карта высот автоматически скачается в формате PNG.
                            Более светлые области соответствуют более высоким точкам.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 