export function toJs(object: object, indent = "  ", level = 0): string {
	const i = Array(level).fill(indent).join("");
	const ii = Array(level + 1)
		.fill(indent)
		.join("");
	const entries = Object.entries(object);
	if (entries.length < 1) return "{}";
	return `{\n${entries
		.filter(([_, value]) => value !== undefined)
		.map(([key, value]) => {
			const k = /^[_$a-z][_$a-z0-9]*$/i.test(key) ? key : JSON.stringify(key);
			if (value != null && typeof value === "object" && !Array.isArray(value)) {
				return `${ii}${k}: ${toJs(value, indent, level + 1)},\n`;
			}
			return `${ii}${k}: ${JSON.stringify(value, null, 2)
				.split("\n")
				.map((line, index) => {
					return index === 0 ? line : `${ii}${line}`;
				})
				.join("\n")},\n`;
		})
		.join("")}${i}}`;
}
