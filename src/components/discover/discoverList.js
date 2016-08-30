import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDiscoverList } from '../../vendor/connection';
import ArticleList from '../common/articleList';
import { millseconds2DateDiff } from '../../vendor/helper/timeTransfer';

class DiscoverList extends Component{

  constructor(props){
    super(props);
    this.state = {
      page: 2,
      haveMore: true,
    }
    this.loadMore = this.loadMore.bind(this);
    this.loadData = this.loadData.bind(this);
    this.sticker = function(){
      var sidebar = document.getElementById('side');
      if ( document.body.scrollTop > 470) {
        sidebar.style.position = 'fixed';
        sidebar.style.top = '30px';
      } else {
        sidebar.style.position = 'absolute';
        sidebar.style.top = null;
      }
    }
  }

  loadMore(){
    this.loadData(this.state.page);
    this.setState({
      page: this.state.page + 1,
    })
  }

  loadData(index){
    getDiscoverList(this.props.user.userid || '', index, this.props.NumPerPage, (err,data) => {
      if(err){
        console.log(err);
      } else {
        let discoverListData = data.PostsList.map((item,ii)=>{
          return {
            avatar: item.HeadUrl,
            category: item.ZctName,
            description: item.Content.length > 72 ? item.Content.substring(0,72)+'...' : item.Content,
            nickName: item.NickName == '管理员' ? '职前小仙女' : item.NickName,
            cover: item.PictureUrl,
            title: item.Title,
            time: millseconds2DateDiff(item.CreatDate),
            viewNum: 0,
            likeNum: item.LikeNum,
            essence: item.IsEssence,
            top: item.IsTop,
            recommand: item.IsRecommend,
            id: item.PostsID,
          }
        });
        if(data.PostsList.length < this.props.NumPerPage){
          this.setState({haveMore: false})
        }
        this.props.updateDiscoverListData(this.props.discoverListData.concat(discoverListData));
        this.props.stopLoading();
      };
    })
  }

  componentWillMount(){
    this.props.startLoading();
  }
  componentDidMount(){
    this.loadData(1);
    window.addEventListener('scroll', this.sticker)
  }

  componentWillUnmount(){
    this.props.updateDiscoverListData([]);
    window.removeEventListener('scroll', this.sticker)
  }
  render(){
    return(
      <div>
        <ArticleList />
        <button type="ghost" onClick={this.loadMore} disabled={!this.state.haveMore}>
          {this.state.haveMore ? '点击加载更多...' : '没有更多了...'}
        </button>
      </div>
    )
  }
}

//读数据
function mapStateToProps(store){
  return{
    discoverListData: store.discoverListData.data,
    user: store.user,
  }
}
//写数据
function mapDispatchToProps(dispatch){
  return{
    updateDiscoverListData: (data) => {dispatch({type:'UPDATE_DISCOVER_LIST_DATA',data: data })},
    startLoading: () => {dispatch({type:'START_LOADING'})},
    stopLoading: () => {dispatch({type:'STOP_LOADING'})},
  }
}

module.exports = connect(mapStateToProps,mapDispatchToProps)(DiscoverList)
