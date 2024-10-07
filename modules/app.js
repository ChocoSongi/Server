// 리디렉션 함수
function redirect() {
    window.location.href = "https://play.google.com/store/apps/details?id=com.yodo1.crossyroad&pcampaignid=merch_published_cluster_promotion_battlestar_browse_all_games&hl=ko";
}

// 덧셈 연산 함수
function calculateSum() {
    const number1 = parseFloat(document.getElementById('number1').value);
    const number2 = parseFloat(document.getElementById('number2').value);
    
    if (!isNaN(number1) && !isNaN(number2)) {
        const sum = number1 + number2;
        document.getElementById('resultBox').innerText = '결과: ' + sum;
    } else {
        document.getElementById('resultBox').innerText = '유효한 숫자를 입력하세요.';
    }
}

// 서버에서 위치 및 기상 정보를 받아오는 함수
function fetchInfo() {
    fetch('/')
        .then(response => response.json())
        .then(data => {
            // 위치 정보 표시
            const locationBox = document.getElementById('locationBox');
            locationBox.innerText = `현재 위치: ${data.location.city}, ${data.location.region}, ${data.location.country}`;
            
            // 기상 정보 표시
            const weatherBox = document.getElementById('weatherBox');
            weatherBox.innerText = `기온: ${data.weather.temperature}°C, 날씨: ${data.weather.description}, 습도: ${data.weather.humidity}%`;
        })
        .catch(error => {
            document.getElementById('locationBox').innerText = '위치 정보를 불러올 수 없습니다.';
            document.getElementById('weatherBox').innerText = '기상 정보를 불러올 수 없습니다.';
            console.error('Error fetching data:', error);
        });
}

// 페이지 로드 시 위치 및 기상 정보를 가져옴
window.onload = function() {
    fetchInfo();
};