import React from 'react';
import { Bodies } from 'matter-js'; // Matter.js의 Bodies 모듈을 가져옵니다.

const Board = ({BOARD_HEIGHT, BOARD_WIDTH }) => {
    const defaultWall = {
        isStatic: true,
        render: { fillStyle: "#E6B143" }
    };

    const sesnsorWall = {
        name: "topLine",
        isStatic: true,
        isSensor: true,
        render: { fillStyle: "#E6B143" }
    }

    const leftWall = Bodies.rectangle(15, BOARD_HEIGHT / 2, 30, BOARD_HEIGHT, defaultWall);
    const rightWall = Bodies.rectangle(BOARD_WIDTH - 15, BOARD_HEIGHT / 2, 30, BOARD_HEIGHT, defaultWall);
    const ground = Bodies.rectangle(BOARD_WIDTH / 2, BOARD_HEIGHT - 25, BOARD_WIDTH, 50, defaultWall);
    const topLine = Bodies.rectangle(BOARD_WIDTH / 2, 150, BOARD_WIDTH, 2, sesnsorWall);

    return [leftWall, rightWall, ground, topLine];
}

export default Board;
