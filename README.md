### 브라우저 타켓
Chrome: 64.0.3282
- Layout Engine: Blink 64
- V8 Engine: 6.4.388
- Chromium Engine 기반 하위 호환으로 포함
  - Naver Whale
  - Samsung Internet
  - Microsoft Edge (except Trident Engine Edge)

Firefox: 62.0.3

Safari 12 (607.1.40)
- iOS 12
- macOS Sierra

### Version information
- node.js / npm (14.8.3 / 6.14.15)
- Nuxt.js (^2.15.8)

### 사용한 에디터
- IntelliJ
  - Nuxt.js Plugins 설치
  - Prettier 설정: `Run for files: {**/*,*}.{js,ts,jsx,tsx,vue,css,scss}`

## 프로젝트 빌드 <hr>

```bash
# 모듈 설치
$ npm install

# 개발 포트: 8000
$ npm run dev

# 배포: 빌드 및 서버 작동
$ npm run build
$ npm run start
```

## 라이센스
- MIT License

## 배포
npm install
npm run build-prod
pm2 delete "heredium"
pm2 start npm --name "heredium" -- run start-prod

test
