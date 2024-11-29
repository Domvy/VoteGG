const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENVIDU_URL = 'http://localhost:8443'; // OpenVidu 서버 주소
const OPENVIDU_SECRET = 'YOUR_SECRET'; // OpenVidu 서버 비밀번호

router.get('/stream-thumbnails/:roomNumber', async (req, res) => {
  const { roomNumber } = req.params; // URL 매개변수에서 roomNumber 가져오기

  try {
    // OpenVidu 세션 정보 가져오기
    const response = await axios.get(`${OPENVIDU_URL}/openvidu/api/sessions`, {
      auth: {
        username: 'OPENVIDUAPP',
        password: OPENVIDU_SECRET,
      },
    });

    // 특정 roomNumber와 일치하는 세션 찾기
    const session = response.data.content.find(session => session.id === roomNumber);

    if (!session) {
      return res.status(404).json({ error: `Session with roomNumber ${roomNumber} not found.` });
    }

    // 세션의 첫 번째 스트림의 스냅샷 경로 반환
    const streamId = session.connections.content[0]?.streamId;
    if (streamId) {
      const thumbnailUrl = `${OPENVIDU_URL}/openvidu/api/sessions/${roomNumber}/connections/${streamId}/snapshot`;
      return res.json({ thumbnailUrl });
    }

    return res.status(404).json({ error: `No streams found for session ${roomNumber}.` });
  } catch (error) {
    console.error('스냅샷 가져오기 실패:', error.message);
    res.status(500).send('스냅샷 가져오기 실패');
  }
});

module.exports = router;
