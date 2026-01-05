// header.html을 가져와서 header-placeholder에 넣기
fetch('components/header.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector('#header-placeholder').innerHTML = data;
    })
    .catch(error => console.error('헤더 로드 실패:', error));

// 테마 토글 함수
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'point-yellow': '#FACC15',
                'pastel-yellow': '#FEF9C3',
            }
        }
    }
}

// 테마 토글 함수
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}
