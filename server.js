const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// 환경 변수에서 OpenWeatherMap API 키 가져오기
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'homepage_test')));

// /api/weather 엔드포인트 설정
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: '위도와 경도 정보가 제공되지 않았습니다.' });
        }

        // OpenWeatherMap API를 사용하여 날씨 정보 가져오기
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=kr`;
        const weatherResponse = await axios.get(weatherApiUrl);
        const weatherData = weatherResponse.data;

        // 클라이언트에게 날씨 데이터 전달
        res.json(weatherData);
    } catch (error) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', error.message);
        res.status(500).json({ error: '날씨 정보를 가져오는 데 실패했습니다.' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});