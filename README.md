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

### 2️⃣ </body> 태그 바로 위에 아래 코드를 추가하고,
👉 이미지 경로와 설정값만 원하는 값으로 수정하세요

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
        speed: 6,      // 낙하 속도 (숫자 ↓ = 빠름 / 숫자 ↑ = 느림)
        minSize: 12,   // 이미지 최소 크기 (px)
        maxSize: 26,   // 이미지 최대 크기 (px)
        newOn: 220,    // 생성 간격 (작을수록 많이 생성됨, 클수록 적게 생성됨)
        maxItems: 80   // 화면에 동시에 존재하는 최대 개수
    });
});
</script>
```

🌸 벚꽃 효과 예제
```html
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
          speed: 9,       // 낙하 속도 (숫자 ↓ = 빠름 / 숫자 ↑ = 느림)
          minSize: 10,    // 이미지 최소 크기 (px)
          maxSize: 15,    // 이미지 최대 크기 (px)
          newOn: 400,     // 생성 간격 (작을수록 많이 생성됨, 클수록 적게 생성됨)
          maxItems: 60    // 화면에 동시에 존재하는 최대 개수
      });
  });
</script>
```

