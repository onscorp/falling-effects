# Falling Effects
눈, 꽃잎 등의 이미지가 화면 위에서 아래로 떨어지는 효과입니다.
이미지만 교체하면 다양한 연출이 가능합니다.

---

## 📌 사용 방법

### 1️⃣ `<head>` 태그 안에 CSS / JS 추가
아래 코드를 **`<head></head>` 사이**에 추가하세요.

```html
<link rel="stylesheet" href="https://onscorp.github.io/falling-effects/verticalFalling.css">
<script src="https://onscorp.github.io/falling-effects/verticalFalling.js"></script>
```

### 2️⃣ `</body>` 태그 바로 위에 아래 코드를 추가하고, 설정값을 조정
❄️ 눈 효과 예제
```html
<script>
window.addEventListener('load', function () {
  new VerticalFalling({
    images: [
      "snow/snow_1.png",
      "snow/snow_2.png",
      "snow/snow_3.png",
      "snow/snow_4.png"
    ],

    // 설정
    maxFlakes: 30,     // 화면에 동시에 존재하는 최대 개수
    minSize: 10,       // 최소 크기(px)
    maxSize: 32,       // 최대 크기(px)
    minSpeed: 5,       // 최소 속도(=애니메이션 시간, 초) - 작을수록 빨라짐
    maxSpeed: 12       // 최대 속도(초)
  });
});
</script>

🌸 벚꽃 효과 예제
<script>
window.addEventListener('load', function () {
    new VerticalFalling({
        images: [
            "flower/flower_1.png",
            "flower/flower_2.png",
            "flower/flower_3.png",
            "flower/flower_4.png",
            "flower/flower_5.png",
            "flower/flower_6.png"
        ],

        // 이미지 로드 실패 시 대체 이미지
        fallbackImage: "flower/flower_1.png",

        // 설정
        maxFlakes: 45,               // 화면에 동시에 존재하는 최대 개수
        minSize: 12,                 // 최소 크기(px)
        maxSize: 18,                 // 최대 크기(px)
        minSpeed: 7,                 // 최소 낙하 시간(초) - 작을수록 빠름
        maxSpeed: 11,                // 최대 낙하 시간(초)
        spawnMin: 320,               // 최소 생성 간격(ms)
        spawnMax: 520,               // 최대 생성 간격(ms)
        excludeSelector: "#header",  // 해당 영역 높이 제외 후 시작
        zIndex: 99999                // z-index
    });
});
</script>

```

