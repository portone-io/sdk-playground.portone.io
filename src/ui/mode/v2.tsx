import { checkoutServerSignal } from "../../state/v2";

export const ForQa = () => (
	<div className="flex flex-col gap-2">
		<label>
			<div>Checkout API URL</div>
			<input
				type="text"
				className="border w-full"
				value={checkoutServerSignal.value}
				onChange={(e) => {
					checkoutServerSignal.value = e.currentTarget.value;
				}}
			/>
		</label>
	</div>
);
