export function logger(...args: any[]) {
	args.forEach((arg, index) => {
		let obj =
			arg !== undefined
				? JSON.parse(
						JSON.stringify(arg, (k, v) => (v === undefined ? null : v))
				  )
				: undefined;
		console.log(index === 0 ? '\n' : '', JSON.stringify(obj, undefined, 3));
	});
}
