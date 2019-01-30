import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index'
import { utils } from '../libs/util'

Vue.use(Router)

// 登录 注册
import login from './login'
// 自选测评
import adaptiveEvaluation from './adaptiveEvaluation'
//自适应测评结果页面
import autoAssessmentResult from './autoAssessmentResult'
// 自适应测评   试题
import choiceEvaluation from './choiceEvaluation'
// 自适应测评首页
import evaluationByself from './evaluationByself'
// 题库
import questionBank from './questionBank'
// 题库详情
import questionBankDetail from './questionBankDetail'
// 个人中心
import selfCenter from './selfCenter'
// 题库购物车
// import shoppingCart from './shoppingCart'
// 自选测评-开始做题
import startProplem from './startProplem'
// 学科助手首页
import subjectAssistantCenter from './subjectAssistantCenter'
import brushQuestion from './subjectAssistantCenter/brushQuestion'
// 疑难问题
import troubleShooting from './Troubleshooting'
// 疑难问题搜寻结果
import TroubleshootingResult from './TroubleshootingResult'
//疑难问题搜寻结果详情展示
import searchDetail from './searchDetail'
//我的题库 开始答题
import toDoQuestions from './toDoQuestions'
// 我的作业 开始做题
import { questions } from './questions'

Vue.use(Router)

let routePath = [
  //系统打的默认首页
  {path: utils.pathPrefix + '.html', redirect: utils.pathPrefix},
  {path: '/', name: 'index', component: index},
  login, autoAssessmentResult, adaptiveEvaluation, choiceEvaluation, evaluationByself,
  questionBank, questionBankDetail, selfCenter, toDoQuestions,
  startProplem, subjectAssistantCenter, brushQuestion, troubleShooting, TroubleshootingResult, searchDetail, questions,
  {path: '*', redirect: '/'} // 所有不存在的页面都跳到首页
]

let routes = new Router({
  base: '/sasstudent/',
  mode: 'history',
  routes: routePath
})

routes.beforeEach((to, from, next) => {
  // 必须登录才能访问
  // console.log(to)
  if (to.meta.requireAuth && !utils.isLogin()) {
    next({name: 'login'})
  } else {
    next()
  }
})

export default routes
