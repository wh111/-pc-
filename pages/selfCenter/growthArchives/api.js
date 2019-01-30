const file = '/';//当前模块api前缀
const api = {
    queryQuestionsNumList: {//获取近期答题数
        path: '/studentTermArchives/queryQuestionsNumList',
        method: 'get'
    },
    querySubjectLevelList: {//获取科目掌握度
        path: '/studentTermArchives/querySubjectLevelList',
        method: 'get'
    },
    queryAssessmentList: {//已完成作业
        path: '/studentTermArchives/queryAssessmentList',
        method: 'get'
    },
    myQuestionDetailList: {//测评分析
        path: '/studentTermArchives/queryAssessmentList',
        method: 'get'
    },
    queryWorkScoreList: {//历次作业成绩
        path: '/studentTermArchives/queryWorkScoreList',
        method: 'get'
        
    },
    queryChapterLevelList: {//知识点掌握度
        path: '/studentTermArchives/queryChapterLevelList',//章节掌握度/studentTermArchives/querySubjectLevelList
        method: 'get'
    },
    modify: {//
        path: file + '/modify',
        method: 'put'
    },
    delete: {//
        path: file + '/remove?ids=',
        method: 'delete'
    }
}
export default api 
