const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const app = express();
const port = 3000;

// 정적 파일 서비스 설정 (HTML, JS, CSS 파일 등)
app.use(express.static(path.join(__dirname, 'homepage_test')));

// 기본 라우트 설정
// 접속자의 IP를 바탕으로 위치 및 기상 정보를 가져오는 라우트
app.get('/', async (req, res) => {
    try {
        // 클라이언트의 IP 주소 추출 (프록시 환경에서도 제대로 동작하도록 설정)
        let clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (clientIP === '::1' || clientIP === '127.0.0.1') {
            clientIP = '8.8.8.8'; // 로컬 테스트를 위한 IP 주소
        }

        // IP 정보 요청 (ipinfo.io API 사용)
        const ipInfoUrl = `https://ipinfo.io/${clientIP}/json?token=91a7e3dadef147`;
        console.log('API 호출 URL', ipInfoUrl);
        const ipInfoResponse = await axios.get(ipInfoUrl);
        const locationData = ipInfoResponse.data;

        if (!locationData.loc) {
            throw new Error('위치 정보가 없습니다.');
        }

        // 위치 정보에서 위도와 경도 추출
        const [latitude, longitude] = locationData.loc.split(',');

        // 기상 정보 요청 (OpenWeatherMap API 사용)
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=34ca17f9b51486bfaeaf8d66c7fde8fd&units=metric`;
        console.log('API 호출 URL:', weatherApiUrl);
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
        console.error('Error fetching data:', error);
        res.status(500).json({ error: '정보를 가져오는 데 실패했습니다.' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
