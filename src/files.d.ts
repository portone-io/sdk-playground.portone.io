declare module "*/trial.yaml" {
	type TrialYaml = {
		label: string;
		icon: string;
		[
			_:
				| "v1-cert"
				| "v1-pay"
				| "v1-load-ui"
				| "v2-cert"
				| "v2-pay"
				| "v2-load-ui"
		]: {
			account: Record<string, unknown>;
			field: Record<string, unknown>;
			case: Record<string, Record<string, unknown>>;
		};
	}[];

	const value: TrialYaml;
	export default value;
}
