/*
****--@file     selfCenter
****--@date     2017/12/25 下午5:15
****--@author   jhd
****--@describe   个人中心
*/
import { utils } from '../../libs/util'

const selfCenter = {
  path: '/selfCenter',
  name: 'selfCenter',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('../../components/common/selfMenu.vue'))
    }, 'selfCenter')
  },
  redirect: to => {
    return utils.pathPrefix + '/selfCenter/selfCenterdetail'
  },
  meta: {
    requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {//我的题库
      path: 'personalQuestion',
      name: 'personalQuestion',
      meta: {
        name: '我的题库'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/personalQuestion/personalQuestion.vue'))
        }, 'selfCenter')
      }
    },
    {//继续练习
      path: 'personalQuestion_goon',
      name: 'personalQuestion_goon',
      meta: {
        name: '我的题库'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/personalQuestion/personalQuestion_goon.vue'))
        }, 'selfCenter')
      }
    },
    {//添加笔记
      path: 'myNoteAdd',
      name: 'myNoteAdd',
      meta: {
        name: '我的题库'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/personalQuestion/myNote/myNote_add.vue'))
        }, 'selfCenter')
      }
    },
    {//查看笔记
      path: 'myNoteShow',
      name: 'myNoteShow',
      meta: {
        name: '我的题库'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/personalQuestion/myNote/myNote_show.vue'))
        }, 'selfCenter')
      }
    },
    {//我的测评
      path: 'selfTest',
      name: 'selfTest',
      meta: {
        name: '我的测评'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfTest/myTest_list.vue'))
        }, 'selfCenter')
      }
    },
    {//测评结果
      path: 'selfTestResult/:testType/:id',
      name: 'selfTestResult',
      meta: {
        name: '我的测评'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfTest/myTest_result.vue'))
        }, 'selfCenter')
      }
    },
    {//个人中心
      path: 'selfCenterdetail',
      name: 'selfCenterdetail',
      meta: {
        name: '个人中心'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfCenterdetail/selfCenterdetail.vue'))
        }, 'selfCenter')
      }
    },
    {//我的群组
      path: 'selfGroups',
      name: 'selfGroups',
      meta: {
        name: '我的群组'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfGroups/selfGroups.vue'))
        }, 'selfCenter')
      }
    },
    {//我的作业
      path: 'selfHomework',
      name: 'selfHomework',
      meta: {
        name: '我的作业'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfHomework/selfHomework.vue'))
        }, 'selfCenter')
      }

    },
    {//我的已完成作业作业详情
      path: 'homeworkRes/:type/:id',
      name: 'homeworkRes',
      meta: {
        name: '我的作业'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfHomework/homeworkAlreadydid.vue'))
        }, 'selfCenter')
      }
    },
    {//个人账户
      path: 'selfAccount',
      name: 'selfAccount',
      meta: {
        name: '我的账户'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfAccount/selfAccount.vue'))
        }, 'selfCenter')
      }
    },
    {//成长档案
      path: 'growthArchives',
      name: 'growthArchives',
      meta: {
        name: '成长档案'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/growthArchives/growthArchives.vue'))
        }, 'selfCenter')
      }
    },
    {//成长档案查看历史
      path: 'seeHistory',
      name: 'seeHistory',
      meta: {
        name: '成长档案'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/seeHistory/seeHistory.vue'))
        }, 'selfCenter')
      }
    },
    {//学科助手
      path: 'subjectAssistant',
      name: 'subjectAssistant',
      meta: {
        name: '学科助手'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/sbujectAssistant/subjectAssistant.vue'))
        }, 'selfCenter')
      }
    },
    {//个人资料
      path: 'selfData',
      name: 'selfData',
      meta: {
        name: '个人资料'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfData/selfData.vue'))
        }, 'selfCenter')
      }
    },
    {//我的答疑
      path: 'selfAnsweringQuestion',
      name: 'selfAnsweringQuestion',
      meta: {
        name: '我的答疑'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfAnsweringQuestion/selfAnsweringQuestion.vue'))
        }, 'selfCenter')
      }
    },
    {//我的答疑-查看
      path: 'selfAnsweringQuestionShow',
      name: 'selfAnsweringQuestionShow',
      meta: {
        name: '我的答疑'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfAnsweringQuestion/selfAnsweringQuestion_show.vue'))
        }, 'selfCenter')
      }
    },
    {//新建提问
      path: 'makeQuestion',
      name: 'makeQuestion',
      meta: {
        name: '我的答疑'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfAnsweringQuestion/components/makeQuestion.vue'))
        }, 'selfCenter')
      }
    },
    {//我来解答
      path: 'makeAnswer',
      name: 'makeAnswer',
      meta: {
        name: '我的答疑'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfAnsweringQuestion/components/makeAnswer.vue'))
        }, 'selfCenter')
      }
    },
    {//系统消息
      path: 'systemMessage',
      name: 'systemMessage',
      meta: {
        name: '个人中心'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/systemMessage/systemMessage.vue'))
        }, 'selfCenter')
      }
    },
    {//个人订单
      path: 'selfShopcar',
      name: 'selfShopcar',
      meta: {
        name: '我的订单'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfShopcar/selfShopcar.vue'))
        }, 'selfCenter')
      }
    },
    {//我的购物车结算页
      path: 'shopcar',
      name: 'shopcar',
      meta: {
        name: '我的订单'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfShopcar/shopcar.vue'))
        }, 'selfCenter')
      }
    },
    {//竞赛中心
      path: 'competionCenter',
      name: 'competionCenter',
      meta: {
        name: '学科助手'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/sbujectAssistant/competionCenter.vue'))
        }, 'selfCenter')
      }
    },
    {//error
      path: 'error',
      name: 'error',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../..//pages/selfCenter/error/error.vue'))
        }, 'selfCenter')
      }
    },
    {//意见反馈
      path: 'suggestion',
      name: 'suggestion',
      meta: {
        name: '个人资料'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/suggestion/suggestion.vue'))
        }, 'selfCenter')
      }
    },
    // {//首次测评结果
    //     path: 'resultOfFirst',
    //     name: 'resultOfFirst',
    //     component: resolve => {
    //         require.ensure([], () => {
    //             resolve(require('../../pages/selfCenter/selfCenterdetail/resultOfFirst.vue'));
    //         }, 'selfCenter');
    //     }
    // },
    {//个人中心   购物车结算页
      path: 'selfShoppingCart',
      name: 'selfShoppingCart',
      meta: {
        name: '我的订单'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/selfShoppingCart/selfShoppingCart.vue'))
        }, 'selfCenter')
      }
    },
    {//个人中心   学科助手-刷题结果
      path: 'brushQuestionResult/:gamesAnswerId',
      name: 'brushQuestionResult',
      meta: {
        name: '学科助手'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/sbujectAssistant/brushQuestionResult.vue'))
        }, 'selfCenter')
      }
    },
    {//我的积分详情
      path: 'integralList',
      name: 'integralList',
      meta: {
        name: '个人中心'  // 表示菜单显示
      },
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../pages/selfCenter/integralList/integralList.vue'))
        }, 'selfCenter')
      }
    },
  ]
}
export default selfCenter
