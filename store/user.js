/*
****--@file     user
****--@date     2018/1/3 上午10:22
****--@author   jhd
****--@describe   当前登录人信息
*/

let state = {
  info: null, // 用户基本信息
  textbookVersionList: [], // 教材版本信息集合
  isFirstAssessment: true, // 首次自适应测评
  signList: [], // 签到记录
  userIntegral: null,
  userMsgNumber: true,//信息数量
}
let mutations = {
  updateInfo: (state, info = null) => {
    state.info = info
    if (info instanceof Object) {
      state.userIntegral = info.integral
    } else {
      state.userIntegral = 0
    }
  },
  updateTextbookVersionList: (state, textbookVersionList) => state.textbookVersionList = textbookVersionList,
  updateIsFirstAssessment: (state, b) => state.isFirstAssessment = b,
  updatesignList: (state, signList) => state.signList = signList,
  updateuserIntegral: (state, userIntegral) => {
    state.userIntegral = userIntegral
    if (state.info instanceof Object) {
      state.info.integral = userIntegral
    }
  },
  destroy: state => {
    state.info = null
    state.textbookVersionList = []
    state.signList = []
  }
}
let actions = {}
let getters = {
  info: (state, getters) => key => {
    // 如果传key，不存在则返回null，不传key则返回info对象
    return key ? (state.info instanceof Object && state.info[key]) : state.info
  },
  textbookVersionList: state => state.textbookVersionList,
  signList: state => state.signList,
  textbookVBySubject: (state, getters) => subject => {
    let textbookVersionList = state.info.textbookVersionList
    let len = textbookVersionList.length
    let res = {}
    if (subject && len) {
      for (let i = 0; i < len; i++) {
        if (textbookVersionList[i].subject == subject) {
          res = textbookVersionList[i]
          break
        }
      }
    }
    return res
  },
  userIntegral: state => {
    if (state.userIntegral) {
      return state.userIntegral
    } else {
      if (state.info instanceof Object) {
        return state.info.integral
      } else {
        return 0
      }
    }
  }
}

export { state, mutations, getters, actions }
