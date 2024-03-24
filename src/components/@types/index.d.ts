declare global {
	type Ball = {
		id: number;
		x: number;
		y: number;
		r: number;
		vx: number;
		vy: number;
		color: string;
	};

	type BallMenu = {
		ballId: number;
		clientX: number;
		clientY: number;
	} | null;

	type setFunc<Type> = React.Dispatch<React.SetStateAction<Type>>;
	type State<Type> = [Type, setFunc<Type>];
}

export {};
