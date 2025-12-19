# Falling Effects 
눈, 꽃잎 등의 이미지가 떨어지는 효과

## 📌 사용 방법
1. 아래 스크립트를 <head> </head> 사이에 추가

<link rel="stylesheet" href="https://onscorp.github.io/falling-effects/verticalFalling.css">
<script src="https://onscorp.github.io/falling-effects/verticalFalling.js"></script>

2. </body> 바로 위에 아래 스크립트를 추가 후 저장

<script>
window.addEventListener('load', function () {
  new VerticalFalling({
    images: [
      "snow/snow_1.png",
      "snow/snow_2.png",
      "snow/snow_3.png",
      "snow/snow_4.png"
    ]
  });
});
</script>


* 이미지의 속도, 크기 등의 조절을 희망하면 설정을 추가하여 값을 조정
<script>
window.addEventListener('load', function () {
  new VerticalFalling({
    images: [
      "snow/snow_1.png",
      "snow/snow_2.png",
      "snow/snow_3.png",
      "snow/snow_4.png"
    ],

    /* 설정 */
    maxFlakes: 30,     // 화면에 동시에 존재하는 최대 개수
    minSize: 10,       // 최소 크기(px)
    maxSize: 32,       // 최대 크기(px)
    minSpeed: 5,       // 최소 속도(=애니메이션 시간, 초) - 작을수록 빨라짐
    maxSpeed: 12       // 최대 속도(초)
  });
});
</script>




   
