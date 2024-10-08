const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const app = express();
const port = 3000;

// 환경 변수에서 API 키 가져오기
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// 정적 파일 서비스 설정
app.use(express.static(path.join(__dirname, 'homepage_test')));

// /weather 엔드포인트 설정
app.get('/weather', async (req, res) => {
    try {
        const cityName = req.query.city;

        if (!cityName) {
            throw new Error('도시 이름이 제공되지 않았습니다.');
        }

        // Geocoding API를 사용하여 도시 이름을 위도와 경도로 변환
        const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`;
        console.log('Geocoding API 호출 URL:', geocodingUrl);
        const geocodingResponse = await axios.get(geocodingUrl);
        const geocodingData = geocodingResponse.data;

        if (geocodingData.length === 0) {
            throw new Error('해당 도시를 찾을 수 없습니다.');
        }

        const { lat: latitude, lon: longitude, name: city, country } = geocodingData[0];

        // 기상 정보 요청 (OpenWeatherMap API 사용)
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=kr`;
        console.log('날씨 API 호출 URL:', weatherApiUrl);
        const weatherResponse = await axios.get(weatherApiUrl);
        const weatherData = weatherResponse.data;

        // 위치 정보와 기상 정보를 클라이언트에게 전달
        res.json({
            location: {
                city: city,
                country: country
            },
            weather: {
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                humidity: weatherData.main.humidity
            }
        });
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});