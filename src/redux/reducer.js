/*
 * this is the file that contains whole reducers for app
 */
import { combineReducers } from 'redux';

var initUserState = {login: false, userid: null, userdata:null}

//user Reducer存放了用户的登录信息，已登录的用户可以获取到昵称、电话、头像
function user(state = initUserState, action){
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        login: true,
        userid: action.userid,
        userdata: action.userdata,
      }
    case 'LOG_OUT':
      return {
        ...state,
        login: false,
        userid: null,
        userdata: null,
      }
    default:
      return state
  }
}

//点赞Reducer存放了在APP生命周期中的点赞内容
function dianzan(state = {}, action) {
  switch (action.type) {
    case 'LIKE_TOGGLE':
      if(state[action.commentID] == true){
        delete state[action.commentID];
        return {...state}
      } else {
        return{
          ...state,
          [action.commentID]:true
        }
      }
    default:
      return state
  }
}

function editorOperate(state = {},action) {
  switch (action.type) {
    case 'UPDATE_EDITOR':
      return{
        ...state,
        [action.userid]:action.editorcomment
      }
    default:
      return state
  }
}

function commentOperate(state = {},action) {
    switch (action.type) {
      case 'UPDATE_COMMENT':
        return{
          ...state,
          [action.postID]: action.commentData
        }
      case 'INSERT_TOP_LEVEL_COMMENT':
        state[action.postID].push(action.commentData);
        return {...state}
      case 'INSERT_SECOND_LEVEL_COMMENT':
        let newState = state[action.postID].map((item,ii)=>{
          if(item.ID == action.ID){
            item.ChildList.push(action.commentData)
          };
          return item
        })
        return {
          ...state,
          [action.postID]: newState
        }
      default:
        return state
    }
}

//这个Reducer会在APP刚开始的时候或者用户登录的时候更新，获取到用户所有已经报名的活动列表
function yibaoming( state = {}, action ){
  switch (action.type) {
    case 'JOIN_ACTIVITY':
      return {
        ...state,
        [action.id]: '已报名',
      }
    case 'CANCEL_ACTIVITY':
      if(state[action.id]){
        delete state[action.id];
      }
      return {...state}
    default:
      return state
  }
}

//这个Reducer会在APP一开始的时候更新，获取所有已结束的活动列表
function yijieshu( state = {}, action ){
  switch (action.type) {
    case 'ADD_CLOSED':
      return {
        ...state,
        [action.id]: '已结束',
      }
    default:
      return state
  }
}

//这个Reducer会存放搜索的关键字和数据
function search( state = {key: '', page: 0, haveMore: false }, action ){
  switch (action.type) {
    case 'UPDATE_SEARCH_KEY':
      console.log(action)
      return {
        ...state,
        key: action.key
      }
    case 'UPDATE_SEARCH_PAGE':
      return {
        ...state,
        page: action.page,
        haveMore: action.haveMore,
      }
    default:
      return state
  }
}

//这个Reducer存放所有发现页列表，任何需要展示发现文章列表地方可以直接用
// discoverListData.data =
// {
//   avatar: 头像链接,
//   category: 频道字符串,
//   description: 描述，最大72长度,
//   nickName: 昵称,
//   cover: 封面，没有的话写‘’！！！
//   title: 标题,
//   time: 时间，（2小时前。。。）
//   viewNum: Int, 查看量
//   likeNum: Int, 赞数量
//   essence: Int, 是否精华，1精华，0不精华
//   top: Int, 是否置顶，同上
//   recommand: Int, 是否推荐，同上
//   id: 帖子ID
// }

function discoverListData( state = {data: []}, action ){
    switch (action.type) {
      case 'UPDATE_DISCOVER_LIST_DATA':
        return{
          ...state,
          data: action.data
        }
      default:
        return state
    }
}

function loading ( state = false, action){
  switch (action.type) {
    case 'START_LOADING':
      return true
    case 'STOP_LOADING':
      return false
    default:
      return state
  }
}

export default combineReducers({
  user,
  dianzan,
  yibaoming,
  yijieshu,
  search,
  discoverListData,
  commentOperate,
  editorOperate,
  loading,
})
