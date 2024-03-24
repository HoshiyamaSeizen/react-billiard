import React, { useState } from 'react';

type Params = {
	start: (count: number) => void;
	running: boolean;
	paused: boolean;
	setPaused: setFunc<boolean>;
};

const Panel = ({ start, running, paused, setPaused }: Params) => {
	const [ballsCount, setBallsCount]: State<number> = useState(10);

	return (
		<div className="panel-container">
			<div className="params">
				<h3>Options</h3>
				<div className="field">
					<label htmlFor="balls-count">Balls Count</label>
					<input
						type="range"
						id="balls-count"
						min={1}
						max={20}
						value={ballsCount}
						onChange={(e) => setBallsCount(+e.target.value)}
						disabled={running}
					/>
					<output className="output">{ballsCount}</output>
				</div>

				<button className="btn-start" onClick={() => start(ballsCount)}>
					{running ? 'Stop' : 'Start'}
				</button>
				<button className="btn-pause" onClick={() => setPaused(!paused)} disabled={!running}>
					{paused ? 'Resume' : 'Pause'}
				</button>
			</div>
			<div className="controls">
				<h3>Controls</h3>
				<p className="controls-row">
					<span className="control">Left Click & Hold</span> - Hit balls
				</p>
				<p className="controls-row">
					<span className="control">Ctrl + Left Click</span> on a ball - Open Ball menu
				</p>
			</div>
		</div>
	);
};

export default Panel;
