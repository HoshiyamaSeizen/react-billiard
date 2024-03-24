import React, { MouseEventHandler, useEffect, useRef } from 'react';

type Params = {
	balls: Ball[];
	setBalls: setFunc<Ball[]>;
	running: boolean;
	paused: boolean;
	setBallMenu: setFunc<BallMenu>;
};

const Board = ({ balls, setBalls, running, paused, setBallMenu }: Params) => {
	const canvasRef = useRef(null);
	const drawing = useRef(false);
	const pausedRef = useRef(paused);
	const restitution = 0.8;
	const friction = 0.01;
	const cursorRadius = 5;
	const mouseRef = useRef({
		in: false,
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
		leftClick: false,
	});

	const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball, color: string) => {
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.closePath();
	};

	const updateBall = (ball: Ball, canvas: HTMLCanvasElement) => {
		// Обновление позиции шара
		ball.x += ball.vx;
		ball.y += ball.vy;

		ball.vx = Math.abs(ball.vx) < 0.01 ? 0 : ball.vx - Math.sign(ball.vx) * friction;
		ball.vy = Math.abs(ball.vy) < 0.01 ? 0 : ball.vy - Math.sign(ball.vy) * friction;

		// Проверка столкновения с границами Canvas
		if (ball.x + ball.r > canvas.width) {
			ball.vx = -ball.vx * restitution;
			ball.x = canvas.width - ball.r;
		} else if (ball.x - ball.r < 0) {
			ball.vx = -ball.vx * restitution;
			ball.x = ball.r;
		}

		if (ball.y + ball.r > canvas.height) {
			ball.vy = -ball.vy * restitution;
			ball.y = canvas.height - ball.r;
		} else if (ball.y - ball.r < 0) {
			ball.vy = -ball.vy * restitution;
			ball.y = ball.r;
		}
	};

	const checkCollision = (ballA: Ball, ballB: Ball) => {
		// Вычисление расстояния между шарами
		const distance = Math.sqrt((ballA.x - ballB.x) ** 2 + (ballA.y - ballB.y) ** 2);

		// Проверка столкновения
		if (distance < ballA.r + ballB.r) {
			// Изменение скоростей шаров при упругом соударении
			const dx = ballB.x - ballA.x;
			const dy = ballB.y - ballA.y;
			const normalX = dx / distance;
			const normalY = dy / distance;
			const tangentX = -normalY;
			const tangentY = normalX;

			// Расстояние, на которое нужно отодвинуть шары, чтобы они не застревали
			const overlap = ballA.r + ballB.r - distance;
			const displacementX = normalX * overlap * 0.5;
			const displacementY = normalY * overlap * 0.5;

			// Корректировка позиций шаров
			ballA.x -= displacementX;
			ballA.y -= displacementY;
			ballB.x += displacementX;
			ballB.y += displacementY;

			const dpTan1 = ballA.vx * tangentX + ballA.vy * tangentY;
			const dpNorm1 = ballA.vx * normalX + ballA.vy * normalY;
			const dpTan2 = ballB.vx * tangentX + ballB.vy * tangentY;
			const dpNorm2 = ballB.vx * normalX + ballB.vy * normalY;

			const m1 = (dpNorm1 * (ballA.r - ballB.r) + 2 * ballB.r * dpNorm2) / (ballA.r + ballB.r);
			const m2 = (dpNorm2 * (ballB.r - ballA.r) + 2 * ballA.r * dpNorm1) / (ballA.r + ballB.r);

			ballA.vx = tangentX * dpTan1 + normalX * m1;
			ballA.vy = tangentY * dpTan1 + normalY * m1;
			ballB.vx = tangentX * dpTan2 + normalX * m2;
			ballB.vy = tangentY * dpTan2 + normalY * m2;
		}
	};

	const draw = () => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current as HTMLCanvasElement;
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		const mouse = mouseRef.current;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (!pausedRef.current) {
			// Обработка курсора
			let cursor: Ball | null = null;
			if (mouse.in && mouse.leftClick) {
				const rect = canvas.getBoundingClientRect();
				const relX = mouse.x - rect.left;
				const relY = mouse.y - rect.top;
				if (
					relX > cursorRadius &&
					relX < canvas.width - cursorRadius &&
					relY > cursorRadius &&
					relY < canvas.height - cursorRadius
				) {
					cursor = {
						id: -1,
						x: relX,
						y: relY,
						r: cursorRadius,
						vx: mouse.dx,
						vy: mouse.dy,
						color: 'red',
					};

					drawBall(ctx, cursor, 'red');
				}
			}

			// Проверка столкновения с курсором
			if (cursor) {
				balls.forEach((ball) => {
					checkCollision(ball, cursor as Ball);
				});
			}

			// Проверка столкновений
			for (let i = 0; i < balls.length; i++) {
				for (let j = i + 1; j < balls.length; j++) {
					const ballA = balls[i];
					const ballB = balls[j];
					checkCollision(ballA, ballB);
				}
			}

			// Обновление положения мячей
			balls.forEach((ball) => {
				updateBall(ball, canvas);
				drawBall(ctx, ball, ball.color);
			});

			setBalls(balls);
		}
		if (pausedRef.current) {
			balls.forEach((ball) => {
				drawBall(ctx, ball, ball.color);
			});
		}
		if (drawing.current) window.requestAnimationFrame(draw);
	};

	const onMouseMove: MouseEventHandler = (e) => {
		const mouse = mouseRef.current;
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		mouse.dx = e.movementX;
		mouse.dy = e.movementY;
		mouse.leftClick = e.buttons === 1 && !e.ctrlKey;
	};

	const onMouseDown: MouseEventHandler = (e) => {
		if (e.buttons === 1 && e.ctrlKey && canvasRef.current) {
			const canvas = canvasRef.current as HTMLCanvasElement;
			const rect = canvas.getBoundingClientRect();
			const relX = mouseRef.current.x - rect.left;
			const relY = mouseRef.current.y - rect.top;

			const ball = balls.find(
				(ball) => Math.sqrt((ball.x - relX) ** 2 + (ball.y - relY) ** 2) < ball.r
			);

			if (!ball) return;
			setBallMenu({ ballId: ball.id, clientX: e.clientX, clientY: e.clientY });
		}
	};

	const mouseIn = (val: boolean) => {
		mouseRef.current.in = val;
	};

	useEffect(() => {
		drawing.current = running;
		if (running) {
			window.requestAnimationFrame(draw);
		}
	}, [running]);

	useEffect(() => {
		pausedRef.current = paused;
	}, [paused]);

	return (
		<canvas
			ref={canvasRef}
			id="canvas"
			className="canvas"
			width={800}
			height={500}
			onMouseMove={onMouseMove}
			onMouseEnter={() => mouseIn(true)}
			onMouseLeave={() => mouseIn(false)}
			onMouseDown={onMouseDown}
		></canvas>
	);
};

export default Board;
