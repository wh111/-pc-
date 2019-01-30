const file = ''//当前模块api前缀
const api = {
    myNotesList: {//我的笔记
        path: '/questionsNotes/myNotesList',
        method: 'get',
    },
    questionsNotesAdd: {//添加笔记
        path: '/questionsNotes/add',
        method: 'post'
    },
    myWrongList: {//我的错题本
        path: '/questionsWrong/myWrongList',
        method: 'get',
    },
    questionsWrongRemove: {//删除错题
        path: '/questionsWrong/remove',
        method: 'delete'
    },
    myFavoriteList: {//我的收藏夹
        path: '/questionsFavorite/myFavoriteList',
        method: 'get'
    },
  questionsNotesModify: {//修改笔记
    path: '/questionsNotes/modify',
    method: 'put'
    },
    questionsNotesRemove: {//删除笔记
        path: '/questionsNotes/remove',
        method: 'delete'
    },
    questionsFavoriteAdd: {//加入收藏
        path: '/questionsFavorite/add',
        method: 'post'
    },
    questionsFavoriteRemove: {//删除收藏
        path: '/questionsFavorite/remove',
        method: 'delete'
    },
    myProductList: {//我购买的商品
        path: '/product/myProductList',
        method: 'get'
    },
  teacherProductList: {//教师发布专题库
    path: '/questionsLibrary/list',
    method: 'get'
  },
    commentAdd: {//商品评论
        path: '/comment/add',
        method: 'post'
    },
    getProductDetail: {
        path: '/product/get?id=',
        method: 'get'
    },
    queryPaperList: {
        path: '/product/queryPaperList?productId=',
        method: 'get'
    },
    outofQuestion: {
        path: '/outofQuestion/add',
        method: 'post'
    }
}
export default api
