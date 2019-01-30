import baseRules from '../../../formRules/base'; // 公共规则

let makequestion = {
	grade:[baseRules.requiredNoEvent],
	subject:[baseRules.requiredNoEvent],
	title:[baseRules.required,baseRules.inputLen(5,30)],
	content:[baseRules.required],
    rewardIntegral: [baseRules.requiredNoEvent],
    reason: [baseRules.inputLen(0, 500)],
}
export {
    makequestion
}
