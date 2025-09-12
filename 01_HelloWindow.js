// Global constants
const canvas = document.getElementById('glCanvas'); // Get the canvas element
const gl = canvas.getContext('webgl2'); // Get the WebGL2 context

if (!gl) {
    console.error('WebGL 2 is not supported by your browser.');
}

// Scissor를 통해서 캔버스를 자르고,
// 각 캔버스의 위치에 색을 칠하는 기능을 구현한 함수입니다.
function drawCanvas(length) {
    // enable을 통해서 scissor 기능을 사용 가능하게 활성
    gl.enable(gl.SCISSOR_TEST);

    // 현재 캔버스를 4등분하기 위해서 length를 2로 나눈 값을 기준으로 활용
    // 우측 상단 (length/2, length/2)를 왼쪽 아래 좌표로 가지는 뷰포0
    gl.scissor(length/2, length/2, length/2, length/2);
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 좌측 상단 (0, length/2)를 왼쪽 아래 좌표로 가지는 뷰포트
    gl.scissor(0, length/2, length/2, length/2);
    gl.clearColor(0, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 우측 하단 (length/2, 0)를 왼쪽 아래 좌표로 가지는 뷰포트
    gl.scissor(length/2, 0, length/2, length/2);
    gl.clearColor(0, 0, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 좌측 하단 (0, 0)를 왼쪽 아래 좌표로 가지는 뷰포트
    gl.scissor(0, 0, length/2, length/2);
    gl.clearColor(1, 1, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Set canvas size: 현재 window 전체를 canvas로 사용
// 초기 사이즈는 500*500 고정이기에 500으로 설정
var length = 500
canvas.width = length;
canvas.height = length;

// Initialize WebGL settings: viewport and clear color
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.1, 0.2, 0.3, 1.0);

// drawCanvas 함수 호출을 통해서 캔버스 그리기
drawCanvas(length);

// Start rendering
render();

// Render loop
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw something here
}

// Resize viewport when window size changes
window.addEventListener('resize', () => {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var length = width;

    if (width > height)
    {
        length = height
    }

    canvas.width = length;
    canvas.height = length;
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawCanvas(length);
    render();
});
