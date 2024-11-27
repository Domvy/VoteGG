import React, { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Bodies, World, MouseConstraint, Mouse, Events } from 'matter-js';

const MatterCanvas = ({ roomNumber }) => {
  const canvasRef = useRef(null);
  const draggedEgg = useRef(null); // 드래그 중인 계란을 추적

  useEffect(() => {
    // Matter.js 엔진 설정
    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
      element: canvasRef.current, // 캔버스를 ref로 연결
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'rgba(0, 0, 0, 0)', // 배경 투명 처리
      },
    });
    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const positionX = 1430; // 전체 X 좌표 위치
    const positionY = 120;
    // 바닥 생성
    const ground = Bodies.rectangle(positionX + 400, positionY + 700, 810, 30, { 
      isStatic: true,
      render: {
        fillStyle: 'rgba(0, 0, 0, 0)', // 투명한 검정색
      },
    });
    World.add(world, ground);

    // 양옆 벽 생성
    const leftWall = Bodies.rectangle(positionX + 0, positionY + 400, 30, 800, { isStatic: true, render: { fillStyle: 'rgba(0,0,0,1)' } });
    const rightWall = Bodies.rectangle(positionX + 460, positionY + 400, 30, 800, { isStatic: true, render: { fillStyle: 'rgba(0,0,0,1)' } });
    const roopWall = Bodies.rectangle(positionX + 235, positionY + 0, 500, 100, { isStatic: true, render: { fillStyle: 'rgba(0,0,0,1)' } });

    const removeBoxT = Bodies.rectangle(window.innerWidth / 2 , 0, window.innerWidth, 30, { isStatic: true, render: { fillStyle: 'rgba(255, 0, 0, 0.5)', } });
    const removeBoxB = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 30, { isStatic: true, render: { fillStyle: 'rgba(255, 0, 0, 0.5)', } });
    const removeBoxL = Bodies.rectangle(0 - 30, window.innerHeight / 2, 30, window.innerHeight, { isStatic: true, render: { fillStyle: 'rgba(255, 0, 0, 0.5)', } });
    const removeBoxR = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 30, window.innerHeight, { isStatic: true, render: { fillStyle: 'rgba(255, 0, 0, 0.5)', } });

    World.add(world, [leftWall, rightWall, roopWall]); // 채팅창
    World.add(world, [removeBoxT, removeBoxB, removeBoxL, removeBoxR]) // 화면 밖

    // 외부에서 마우스 이벤트 처리
    const mouse = Mouse.create(document.body); // 캔버스가 아닌 전체 문서에서 마우스 이벤트 처리
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        maxForce: 0.01, // 마우스로 이동할 때 최대 힘을 제한 (속도 제한)
        render: { visible: false },
      },
    });
    World.add(world, mouseConstraint);

    // 문서 전체에서 마우스 좌표 업데이트
    document.addEventListener("mousemove", (event) => {
      const rect = render.canvas.getBoundingClientRect(); // 캔버스 위치 기준으로 좌표 계산
      mouse.position.x = event.clientX - rect.left;
      mouse.position.y = event.clientY - rect.top;
    });

    document.addEventListener("mousedown", () => {
      mouse.button = 0; // 마우스 버튼 눌림 상태
    });

    document.addEventListener("mouseup", () => {
      mouse.button = -1; // 마우스 버튼 해제 상태
      // 드래그가 끝난 후 계란의 크기를 원래대로 되돌리기
      if (draggedEgg.current) {
        draggedEgg.current.render.sprite.xScale = 0.3;
        draggedEgg.current.render.sprite.yScale = 0.3;
        draggedEgg.current = null; // 더 이상 드래그 중이 아님
      }
    });

    // 계란을 생성하는 함수
    const addEgg = () => {
      const randomX = positionX + (Math.random() * 400);
      const randomY = positionY + 100;
      const img = new Image();
      img.src = "/resources/images/egg.png"; // 올바른 이미지 URL

      img.onload = () => {
        const egg = Bodies.circle(randomX, randomY, 10, {
          restitution: 0.3,
          friction: 0.4,
          render: {
            sprite: {
              texture: img.src,
              xScale: 0.3,
              yScale: 0.3,
              zIndex: 1,
            },
          },
        });

        // 드래그 중인 계란 추적
        Events.on(engine, 'beforeUpdate', () => {
          if (mouseConstraint.body === egg) {
            egg.render.sprite.xScale = 1;
            egg.render.sprite.yScale = 1;
            draggedEgg.current = egg; // 드래그 중인 계란을 추적
          }
        });

        World.add(world, egg);
      };

      img.onerror = (e) => {
        console.error("이미지 로드 실패", e);
      };
    };

    // 계란을 주기적으로 추가 (3초마다)
    const interval = setInterval(addEgg, 3000);

    // 충돌 감지 및 물체 제거
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        // 충돌한 물체가 removeBox와 충돌한 경우
        if (bodyA === removeBoxT || bodyB === removeBoxT ||
            bodyA === removeBoxB || bodyB === removeBoxB ||
            bodyA === removeBoxL || bodyB === removeBoxL ||
            bodyA === removeBoxR || bodyB === removeBoxR) {

          // removeBox와 충돌한 물체(계란)를 찾음
          const egg = bodyA === removeBoxT || bodyA === removeBoxB || bodyA === removeBoxL || bodyA === removeBoxR
            ? (bodyB === removeBoxT || bodyB === removeBoxB || bodyB === removeBoxL || bodyB === removeBoxR ? bodyA : bodyB)
            : (bodyA === removeBoxT || bodyA === removeBoxB || bodyA === removeBoxL || bodyA === removeBoxR ? bodyB : bodyA);

          // 계란 제거
          World.remove(world, egg);
          console.log("Destroy egg!");

          // 새로운 계란 추가
          addEgg();
        }
      });
    });

    // Cleanup: 컴포넌트가 unmount 될 때 Matter.js 설정을 정리
    return () => {
      clearInterval(interval);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, [roomNumber]);

  return (
    <div
      ref={canvasRef}
      style={{
        position: "fixed", // 화면 전체를 덮도록 고정
        top: 0,
        left: 0,
        width: "100%", // 화면 전체 너비
        height: "100%", // 화면 전체 높이
        zIndex: 0,
        pointerEvents: "none", // 클릭 이벤트가 UI로 전달되도록 설정
      }}
    ></div>
  );
};

export default MatterCanvas;