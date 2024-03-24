import React, { ChangeEventHandler, useEffect, useState } from 'react';

type Params = {
	balls: Ball[];
	setBalls: setFunc<Ball[]>;
	ballMenu: BallMenu;
	setBallMenu: setFunc<BallMenu>;
};

const BallProps = ({ balls, setBalls, ballMenu, setBallMenu }: Params) => {
	const [color, setColor]: State<string> = useState('#000000');

	useEffect(() => {
		if (ballMenu) {
			setColor(balls[ballMenu.ballId].color);
		}
	}, [ballMenu]);

	const closeMenu = () => {
		setBallMenu(null);
	};

	const onChange: ChangeEventHandler = (e) => {
		const newColor = (e.target as HTMLInputElement).value;
		setColor(newColor);
		setBalls(
			balls.map((ball) => {
				if (ball.id === ballMenu?.ballId) ball.color = newColor;
				return ball;
			})
		);
	};

	return (
		<div
			className="ball-menu"
			style={{ top: (ballMenu?.clientY || 0) + 'px', left: (ballMenu?.clientX || 0) + 'px' }}
			hidden={ballMenu === null}
		>
			<p className="title">Ball Settings</p>
			<input className="input-color" id="color" type="color" value={color} onChange={onChange} />
			<label className="label" htmlFor="color">
				Color
			</label>
			<button className="btn-close" onClick={closeMenu}>
				&times;
			</button>
		</div>
	);
};

export default BallProps;
