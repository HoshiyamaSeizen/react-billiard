import React, { useState } from 'react';
import Panel from './components/Panel.tsx';
import Board from './components/Board.tsx';
import BallProps from './components/BallProps.tsx';
import './App.sass';

const MIN_RADIUS = 15;
const MAX_RADIUS = 30;
const MAX_SPEED = 10;
const DEFAULT_COLOR = '#ff0000';

const App = () => {
	const [balls, setBalls]: State<Ball[]> = useState([] as Ball[]);
	const [running, setRunning]: State<boolean> = useState(false);
	const [paused, setPaused]: State<boolean> = useState(false);
	const [ballMenu, setBallMenu]: State<BallMenu> = useState(null as BallMenu);

	const rand = (min: number, max: number) =>
		Math.floor(Math.random() * (Math.floor(max + 1) - Math.ceil(min)) + Math.ceil(min));

	const start = (count: number) => {
		if (!running) {
			const initBalls: Ball[] = [];
			for (let i = 0; i < count; i++) {
				initBalls.push({
					id: i,
					x: (i + 1) * (MAX_RADIUS + 5),
					y: MAX_RADIUS + 5,
					r: rand(MIN_RADIUS, MAX_RADIUS),
					vx: rand(-MAX_SPEED, MAX_SPEED),
					vy: rand(-MAX_SPEED, MAX_SPEED),
					color: DEFAULT_COLOR,
				});
			}
			setBalls(initBalls);
			setRunning(true);
		} else {
			setRunning(false);
			setPaused(false);
		}
	};

	return (
		<div className="App" tabIndex={0}>
			<div className="app-container">
				<Panel start={start} running={running} paused={paused} setPaused={setPaused} />
				<Board
					balls={balls}
					setBalls={setBalls}
					running={running}
					paused={paused}
					setBallMenu={setBallMenu}
				/>
			</div>
			<BallProps
				balls={balls}
				setBalls={setBalls}
				ballMenu={ballMenu}
				setBallMenu={setBallMenu}
			/>
		</div>
	);
};

export default App;
