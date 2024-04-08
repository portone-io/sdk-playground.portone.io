import { sdkVersionSignal } from "../../state/app";
import { checkoutServerSignal, coreServerSignal } from "../../state/v1";

export const ForQa = () => {
	const version = sdkVersionSignal.value;
	return (
		<div className="flex flex-col gap-2">
			<label>
				<div>Core API URL</div>
				<input
					type="text"
					className="border w-full"
					value={coreServerSignal.value}
					onChange={(e) => {
						coreServerSignal.value = e.currentTarget.value;
					}}
				/>
				<p className="text-xs text-red-700">
					⚠️ 올바르지 않은 주소를 입력하고 실행할 시 조용하게 실패합니다. 이 때는
					페이지를 새로고침 해주세요.
				</p>
			</label>
			{version === "1.3.0" && (
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
			)}
		</div>
	);
};
