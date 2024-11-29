const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const OPENVIDU_URL = 'http://localhost:4443'; // OpenVidu 서버 주소
const OPENVIDU_SECRET = 'YOUR_SECRET'; // OpenVidu 서버 비밀번호

router.get('/stream-thumbnails', async (req, res) => {
    try {
        // OpenVidu 세션 정보 가져오기
        const response = await axios.get(`${OPENVIDU_URL}/openvidu/api/sessions`, {
            auth: {
                username: 'OPENVIDUAPP',
                password: OPENVIDU_SECRET,
            },
        });

        const sessions = response.data.content || [];
        const thumbnails = sessions.map(session => {
            // 세션에 연결된 첫 번째 스트림의 썸네일 경로를 반환
            const streamId = session.connections.content[0]?.streamId;
            if (streamId) {
                return `${OPENVIDU_URL}/openvidu/api/sessions/${session.id}/connections/${streamId}/snapshot`;
            }
            return null;
        }).filter(Boolean);

        res.json(thumbnails);
    } catch (error) {
        console.error('스냅샷 가져오기 실패:', error.message);
        res.status(500).send('스냅샷 가져오기 실패');
    }
});

module.exports = router;
