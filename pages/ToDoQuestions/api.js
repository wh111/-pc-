const file = '/papers';//当前模块api前缀
const teacher = '/questionsLibrary';
const api = {
  /*****************专题库*********************/
  getNextQuestions: {//在试卷中获取下一道题（开始练习、继续练习、下一道题）
    path: file + '/getNextQuestions',
    method: 'get'
  },
  submitAnswer: {//提交答题（提交答案，获取正确情况）
    path: file + '/submitAnswer',
    method: 'post'
  },
  getQuestionsById: {//根据试题id获取试题详情
    path: file + '/getQuestionsById',
    method: 'get'
  },
  getQuestionsSeq: { // 获取试题序号
    path: file + '/queryQuestionList',
    method: 'get'
  },
  /*******************老师发布*******************/
  getTeacherQuestionsSeq: { // 开始答题(获取所有题目编号)
    path: teacher + '/getQuestionsSeq',
    method: 'get'
  },
  submitTeacherAnswer: { // 回答试题
    path: teacher + '/submitAnswer',
    method: 'post'
  },
  submitTeacherPapers: { // 提交
    path: teacher + '/submitPapers',
    method: 'post'
  },
  getTeacherNextQuestions: { // 获取下一个未答题
    path: teacher + '/getNextQuestions',
    method: 'get'
  },
  getTeacherQuestionsById: { // 获取试题
    path: teacher + '/getQuestions',
    method: 'get'
  }
};
export default api;
