/*
****--@file     rules
****--@date     2018/1/23 下午4:07
****--@author   jhd
****--@describe   我的题库 表单验证
*/

import baseRules from '../../../formRules/base'; // 公共规则

let outofQuestion = {
    remark: [baseRules.requiredNoEvent, baseRules.inputLen(1, 500)],
}
let evaluate = {
    score: [baseRules.requiredNoEvent],//评分
    comment: [baseRules.inputLen(0, 500)]
}
export {
    outofQuestion,
    evaluate
}