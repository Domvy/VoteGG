const express = require('express');
const router = express.Router();

// 필요에 따라 채팅 관련 API 엔드포인트 추가
router.get('/', (req, res) => {
  res.send('채팅 서버가 실행 중입니다.');
});

module.exports = router;
