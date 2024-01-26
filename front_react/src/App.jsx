/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'

import { Bodies, Engine, World, Render, Runner, Body, Events } from "matter-js"
import Fruits from './Fruits'
import Board from './component/Board'

const BOARD_WIDTH = 620 //DEFAULT 620
const BOARD_HEIGHT = 800 //DEFAULT 850
const KEY_SENSITIVITY = 1
const DROP_WAIT_TIME = 700

const App = () => {
    const [score, setScore] = useState(0)

    useEffect(() => {
        const engine = Engine.create()
        const render = Render.create({
            engine,
            element: document.body,
            options: {
                width: BOARD_WIDTH,
                height: BOARD_HEIGHT,
                background: "#F7F4C8",
                wireframes: false
            }
        })

        const world = engine.world

        const addFruit = () => {
            const fruits = Fruits.BASE
            const index = Math.floor(Math.random() * 4) //DEFAULT 5
            const fruit = fruits[index]

            const body = Bodies.circle(BOARD_WIDTH/2, 50, fruit.radius, {
                index: index,
                isSleeping: true,
                render: {
                    sprite: { texture: `${fruit.name}.png` }
                },
                restitution: 0.2,
            })

            currentBody = body;
            currentFruit = fruit;

            console.log(fruit.name)
            World.add(world, body)
        }

        World.add(world, Board({ BOARD_HEIGHT, BOARD_WIDTH }))

        Render.run(render)
        Runner.run(engine)
        let currentBody = null
        let currentFruit = null
        let disableAction = false
        let interval = null

        //KEY function
        window.onkeydown = (event) => {
            if (disableAction) {
                return
            }

            switch (event.code) {
                case "ArrowLeft":
                    if (interval)
                        return

                    interval = setInterval(() => {
                        if (currentBody.position.x - currentFruit.radius > 30)
                            Body.setPosition(currentBody, {
                                x: currentBody.position.x - 1,
                                y: currentBody.position.y,
                            })
                    }, KEY_SENSITIVITY)
                    break

                case "ArrowRight":
                    if (interval)
                        return

                    interval = setInterval(() => {
                        if (currentBody.position.x + currentFruit.radius < BOARD_WIDTH - 30)
                            Body.setPosition(currentBody, {
                                x: currentBody.position.x + 1,
                                y: currentBody.position.y,
                            })
                    }, KEY_SENSITIVITY)
                    break
                case "ArrowDown":
                    currentBody.isSleeping = false
                    disableAction = true

                    setTimeout(() => {
                        addFruit()
                        setScore((prevScore) => prevScore + 100);
                        disableAction = false
                    }, DROP_WAIT_TIME)
                    break
            }
        }

        //Key 전환 버벅임방지
        window.onkeyup = (event) => {
            switch (event.code) {
                case "ArrowLeft":
                case "ArrowRight":
                    clearInterval(interval)
                    interval = null
            }
        }


        //Collision Checking
        Events.on(engine, "collisionStart", (event) => {
            event.pairs.forEach((collision) => {
                if (collision.bodyA.index === collision.bodyB.index) {
                    const index = collision.bodyA.index

                    if (index === Fruits.BASE.length - 1) {
                        return
                    }

                    World.remove(world, [collision.bodyA, collision.bodyB])

                    const newFruit = Fruits.BASE[index + 1]

                    const newBody = Bodies.circle(
                        collision.collision.supports[0].x,
                        collision.collision.supports[0].y,
                        newFruit.radius,
                        {
                            render: {
                                sprite: { texture: `${newFruit.name}.png` }
                            },
                            index: index + 1, 
                        }
                    )
                     
                    setScore((prevScore) => prevScore + (index + 1 ) * (index + 1) * 100);
                    World.add(world, newBody)
                    if (index + 1 === Fruits.BASE.length - 1)
                    {
                        alert("Game Win")
                    }   
                    console.log(index)
                    console.log(Fruits.BASE.length)
                }

                if (
                    !disableAction &&
                    (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {
                    alert("Game over")
                }  
            })
        })

        addFruit()
    }, [])


    return (
        <>
            점수 : {score}
        </>
    )
}

export default App
