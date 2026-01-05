// footer.html을 가져와서 footer-placeholder에 넣기
fetch('components/footer.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector('#footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('푸터 로드 실패:', error));