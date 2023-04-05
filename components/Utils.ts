export function logger(...args: any[]) {
	args.forEach((arg, index) => {
		let obj = JSON.parse(JSON.stringify(arg));
		console.log(
			index === 0 ? '\n' : undefined,
			JSON.stringify(obj, undefined, 3)
		);
	});
}
