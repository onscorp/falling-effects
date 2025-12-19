# Falling Effects
눈, 꽃잎 등의 이미지가 화면 위에서 아래로 떨어지는 효과입니다.

---

## 📌 사용 방법

### 1️⃣ `<head>` 태그 안에 CSS / JS 추가
아래 코드를 **`<head></head>` 사이**에 추가하세요.

```html
<link rel="stylesheet" href="https://onscorp.github.io/falling-effects/verticalFalling.css">
<script src="https://onscorp.github.io/falling-effects/verticalFalling.js"></script>
```

### 2️⃣ `</body>` 태그 바로 위에 아래 코드를 추가

```html
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
```

### 3️⃣ 이미지의 속도, 크기 등의 조절을 희망하면 설정을 추가하여 값을 조정
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
```
