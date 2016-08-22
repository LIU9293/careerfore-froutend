import base64 from 'base-64';
import CryptoJS from "crypto-js";
import parse from 'url-parse';

//base64
const base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
function base64decode(str){
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        }
        while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        }
        while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
function utf8to16(str){
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx 10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx10xx xxxx10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}
function safe64(base64) {
    base64 = base64.replace(/\+/g, "-");
    base64 = base64.replace(/\//g, "_");
    return base64;
};

// 通用接口
export const getDataBase64 = (route, object, callback) => {

  let BLParameter = {
    FunctionRouteName: route,
    BLRequestObject: object
  }

  let MyBLRequestContainer = {};
  MyBLRequestContainer.FunctionRouteName = BLParameter.FunctionRouteName;
  MyBLRequestContainer.RequestObjectString = JSON.stringify(BLParameter.BLRequestObject);//JSON序列化

  let PostDataString = JSON.stringify(MyBLRequestContainer);//JSON序列化

  const myRequest = new Request('http://114.55.41.78:8888/AMSService/APP',{
    method: "POST",
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8'
    },
    body: PostDataString
  });
  fetch(myRequest)
    .then((response) => response.json())
    .then((responseJson) => {
      callback(null, JSON.parse(utf8to16(base64decode(responseJson.ResponseObjectString))));
    })
    .catch(function(error){
      callback(new Error(error.message));
    });
}

export const getData = (route, object, callback) => {

  let BLParameter = {
    FunctionRouteName: route,
    BLRequestObject: object
  }

  let MyBLRequestContainer = {};
  MyBLRequestContainer.FunctionRouteName = BLParameter.FunctionRouteName;
  MyBLRequestContainer.RequestObjectString = JSON.stringify(BLParameter.BLRequestObject);//JSON序列化

  let PostDataString = JSON.stringify(MyBLRequestContainer);//JSON序列化

  const myRequest = new Request('http://114.55.41.78:8888/AMSService/APP',{
    method: "POST",
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8'
    },
    body: PostDataString
  });
  fetch(myRequest)
    .then((response) => response.json())
    .then((responseJson) => {
      callback(null, JSON.parse(responseJson.ResponseObjectString));
    })
    .catch(function(error){
      callback(new Error(error.message));
    });
}

//获取轮播图
export const getCarousel = (callback) => {
  getData('ZQ.APP.Found.HomeFig', {}, (err,data)=>{
    if(err){callback(err)} else {
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//发现首页获取帖子列表
export const getDiscoverList = (userID, pageNumber, perPageNumber, callback) => {
  let queryObj = {
    userID: userID,
    PageNumber: pageNumber,
    PerPageNumber: perPageNumber,
  }
  getDataBase64('ZQ.APP.Found.GetPostsList', queryObj, (err, data)=>{
    if (err) {
      callback(err);
    }  else {
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//获取发现帖子详情
export const getDiscoverPost = (postID, userID, callback) => {
  let queryObj = {
    PostsId: postID,
    UserID: userID
  }
  getDataBase64('ZQ.APP.Found.PostsInfo', queryObj, (err, data) => {
    if(err){
      callback(err);
    } else {
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//发布发现帖子
export const postDiscoverArticle = (userid, title, cover, category, HTMLcontent, type, coverSRC, postid, callback) => {
  let queryObj = {
    UserId: userid,
    PostsTitle: title,
    PostsFrontCover: cover,
    PostsChannel: category,
    PostsContent: HTMLcontent,
    PostType: type,
    PostFrontCoverSrc: coverSRC,
    PostsId: postid,
  }
  console.log(queryObj);
  getData('ZQ.APP.Found.Posts', queryObj, (err, data) => {
    if(err){
      callback(err);
    } else {
      console.log(data);
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//获取发现帖子评论
export const getDiscoverPostComment = (userid,postsId,pageNum,callback) => {
  let queryObj = {
    UserID: userid,
    PostsId: postsId,
    PageNum: pageNum
  };
  getDataBase64('ZQ.APP.Found.CommentInfo', queryObj, (err, data) => {
    if(err){
      callback(err);
    } else {
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//获得发现筛选列表
export const getDiscoverFilterList = (callback) => {
  let queryObj = {};
  getData('ZQ.APP.Found.GetChannelList', queryObj, (err, data) => {
    if (err){callback(err)} else {
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      };
    }
  })
}

//获得用户筛选列表
export const getMyDiscoverFilterList = (userid, callback) => {
  let queryObj = {
    UserID: userid
  };
  getData('ZQ.APP.Found.MyChannel', queryObj, (err, data) => {
    if (err){callback(err)} else {
      if (data.ResultCode === 1){
        callback(null, data);
      } else{
        callback(data.ResultMessage);
      };
    }
  })
}

//更新用户筛选列表
export const updateMyDiscoverFilterList = (userid, channels, callback) => {
  let queryObj = {
    UserID: userid,
    Channels: channels
  };
  getData('ZQ.APP.Found.UpdateChannel', queryObj, (err, data) => {
    if (err){callback(err)} else {
      console.log(data)
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      };
    }
  })
}

//获取活动首页列表
export const getPlaygroundList = (AreaID, pageCurrent, pageSize, callback) => {
  let queryObj = {
    areaID: AreaID,
    PageCurrent: pageCurrent,
    PageSize: pageSize
  }
  getDataBase64('ZQ.APP.ActivityManage.GetActivityList', queryObj, (err, data)=>{
    if(err){
      callback(err)
    } else {
      if (data.ResultCode === 1){
        callback(null, data.ActivityList);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}
//获取活动首页轮播图
export const getHomeFigList = (AreaID, callback) => {
  let queryObj = {
    areaID: AreaID,
  }
  getDataBase64('ZQ.APP.ActivityManage.HomeFig', queryObj, (err, data)=>{
    if(err){
      callback(err)
    } else {
      if (data.ResultCode === 1){
        callback(null, data.HomeFigList);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//获取活动详情
export const getPlaygroundPost = (id, userid, callback) => {
  let queryObj = {
    ActivityID: id,
    UserID: userid
  };
  getDataBase64('ZQ.APP.ActivityManage.GetActivityByID', queryObj, (err, data)=>{
    if(err){
      callback(err)
    } else {
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}
//获取活动评论
export const GetCommentList = (id, userid,pageNum, callback) => {
  let queryObj = {
    EventID: id,
    UserID: userid,
    PageNum: pageNum
  };
  getData('ZQ.APP.ActivityManage.GetCommentList', queryObj, (err, data)=>{
    if(err){
      callback(err)
    } else {
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//用户发短信 type = 注册，忘记密码，绑定手机
export const sendSMS = (phone, type, callback) => {
  let queryObj = {
    PhoneNumber: phone,
    Type: type
  };
  getData('ZQ.APP.Account.SendSMS', queryObj, (err,data) => {
    if(err){callback(err)} else {
      if (data.ResultCode === 1){
        console.log('发送短信成功，返回的数据是：');
        console.log(data);
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//用户注册
export const userRegister = (phone, code, password, c_id, ios_token, callback) => {
  let queryObj = {
    PhoneNumber: phone,
    Codes: code,
    PassWord: password,
    C_ID: c_id,
    IOS_Token: ios_token
  };
  getData('ZQ.APP.Account.Registered', queryObj, (err,data) => {
    if(err){callback(err)} else {
      if (data.ResultCode === 1){
        console.log('用户注册成功，返回的数据是：');
        console.log(data);
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//用户登陆
export const userLogin = (phone, password, c_id, ios_token, callback) => {
  let queryObj = {
    PhoneNumber: phone,
    PassWord: password,
    C_ID: c_id,
    IOS_Token: ios_token
  };
  getData('ZQ.APP.Account.Login', queryObj, (err,data) => {
    if(err){callback(err)} else {
      if (data.ResultCode === 1){
        console.log('用户登陆成功，返回的数据是：');
        console.log(data);
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//图片上传
export const postImage = (base64, callback) => {
  let queryObj = {
    ImgBase64: base64,
  };
  console.log(queryObj)
  getData('ZQ.APP.Found.ImgUplad', queryObj, (err, data) => {
    if(err){callback(err)} else {
      if (data.ResultCode === 1){
        console.log('图片上传成功，返回的数据是：');
        console.log(data);
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//用户基本信息
export const getUserInfo = (userid, callback) => {
  let queryObj = {
    UserId: userid,
  };
  console.log(queryObj)
  getData('ZQ.APP.Mime.UserBaseInfo', queryObj, (err, data) => {
    if(err){callback(err)} else {
      if (data.ResultCode === 1){
        callback(null, data);
      } else {
        callback(data.ResultMessage);
      }
    }
  })
}

//输入是base64的图片，不包含data:image...的前缀，callback是图片链接
export const uploadImageToQiniu = (imageBase64,callback) => {

    Scope = `react`;
    Deadline = Math.floor(Date.now() / 1000) + 3600;

    //STEP 1
    var putPolicy = {
      scope: Scope,
      deadline: Deadline,
    };

    //SETP 2
    var put_policy = JSON.stringify(putPolicy);
    console && console.log("put_policy = ", put_policy);

    //SETP 3
    var encoded = base64encode(utf16to8(put_policy));
    console && console.log("encoded = ", encoded);

    //SETP 4
    var hash = CryptoJS.HmacSHA1(encoded, 'p_ZKt8Xoxf2ncVz3LLLMl2mRH7C18k7KnNMEM-BW');
    var encoded_signed = hash.toString(CryptoJS.enc.Base64);
    console && console.log("encoded_signed=", encoded_signed)

    //SETP 5
    var upload_token = 'hGpjdPl3hxO8QyR26yIu_UimOvBHavF1zai-rkDH' + ":" + safe64(encoded_signed) + ":" + encoded;
    console && console.log("upload_token=", upload_token);

    const myRequest = new Request(`http://up.qiniu.com/putb64/-1/`,{
      method: "POST",
      headers: {
        'Content-Type': 'application/octet-stream',
        'Authorization': `UpToken ${upload_token}`,
      },
      body:imageBase64
    });

    fetch(myRequest)
      .then((response) => response.json())
      .then((responseJson) => {
        let imageURL = responseJson.key;
        let prefix = 'http://img.careerfore.com/';
        callback(null, prefix + imageURL );
      })
      .catch((error) => {callback(error)});

}
