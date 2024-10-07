const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const app = express();
const port = 3000;

// 환경 변수에서 API 키와 토큰 가져오기
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const IPINFO_TOKEN = process.env.IPINFO_TOKEN;

// 정적 파일 서비스 설정
app.use(express.static(path.join(__dirname, 'homepage_test')));

// /weather 엔드포인트 설정
app.get('/weather', async (req, res) => {
    try {
        // 클라이언트로부터 IP 주소 받기
        let clientIP = req.query.ip;

        if (!clientIP) {
            throw new Error('IP 주소가 제공되지 않았습니다.');
        }

        // IP 정보 요청 (ipinfo.io API 사용)
        const ipInfoUrl = `https://ipinfo.io/${clientIP}/json?token=${IPINFO_TOKEN}`;
        console.log('IP 정보 API 호출 URL:', ipInfoUrl);
        const ipInfoResponse = await axios.get(ipInfoUrl);
        const locationData = ipInfoResponse.data;

        if (!locationData.loc) {
            throw new Error('위치 정보가 없습니다.');
        }

        // 위치 정보에서 위도와 경도 추출
        const [latitude, longitude] = locationData.loc.split(',');

        // 기상 정보 요청 (OpenWeatherMap API 사용)
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=kr`;
        console.log('날씨 API 호출 URL:', weatherApiUrl);
        const weatherResponse = await axios.get(weatherApiUrl);
        const weatherData = weatherResponse.data;

        // 위치 정보와 기상 정보를 클라이언트에게 전달
        res.json({
            location: {
                city: locationData.city,
                region: locationData.region,
                country: locationData.country
            },
            weather: {
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description,
                humidity: weatherData.main.humidity
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: '정보를 가져오는 데 실패했습니다.' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
