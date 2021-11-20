var axios = require('axios').default;
var fs = require('fs')
const path = require('path')
var parseUrl  = require('url');
const prompt = require('prompt');


var config = {
  method: 'get',
  url: 'https://f247.com/latest.json?page=0',
  headers: { 
    'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"', 
    'Discourse-Present': 'true', 
    'X-CSRF-Token': 'undefined', 
    'sec-ch-ua-mobile': '?0', 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', 
    'Accept': 'application/json, text/javascript, */*; q=0.01', 
    'Referer': 'https://f247.com/', 
    'X-Requested-With': 'XMLHttpRequest', 
    'sec-ch-ua-platform': '"macOS"'
  }
};

const fileName = 'links.txt'

const axiosFetchThreads = axios.create(
    {
        baseUrl: 'https://f247.com/',
        headers: { 
            'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"', 
            'Discourse-Present': 'true', 
            'X-CSRF-Token': 'undefined', 
            'sec-ch-ua-mobile': '?0', 
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', 
            'Accept': 'application/json, text/javascript, */*; q=0.01', 
            'Referer': 'https://f247.com/', 
            'X-Requested-With': 'XMLHttpRequest', 
            'sec-ch-ua-platform': '"macOS"'
          }
    }
);
var  _headers = { 
    'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"', 
    'Discourse-Present': 'true', 
    'X-CSRF-Token': 'undefined', 
    'sec-ch-ua-mobile': '?0', 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36', 
    'Accept': 'application/json, text/javascript, */*; q=0.01', 
    'Referer': 'https://f247.com/', 
    'X-Requested-With': 'XMLHttpRequest', 
    'sec-ch-ua-platform': '"macOS"'
  };

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // console.log('config ' + JSON.stringify(config));
    
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });




let page = 0;
let total_page = 1;
// let threadId = [];
let arrComments = []
  
function getThread(page) {
    const _params = new URLSearchParams();
    _params.append('page', page)
    return axios({
            url: 'https://f247.com/latest.json',
            method: 'get',
            headers: _headers,
            params: _params
        
        })
       .then(res => res.data)
       .catch (err => console.error(err))
    }
 
function getComments(id, csrf, cookie) {
    return axios({
        url: 'https://f247.com/t/' +id,
        method: 'get',
        headers: { 
            'Discourse-Present': 'true', 
            'X-CSRF-Token': csrf, 
            'sec-ch-ua-mobile': '?0', 
            'Discourse-Logged-In': 'true', 
            'Accept': 'application/json, text/javascript, */*; q=0.01', 
            'Referer': 'https://f247.com/t/talkshow-f247-a7-co-phieu-bds-cach-thuc-tim-kim-cuong-trong-cat-20h00-ngay-14-11-2021/56553', 
            'X-Requested-With': 'XMLHttpRequest', 
            'Postman-Token': '5dab93c7-72b5-42d1-9e1a-3f059a88cf1d', 
            'Host': 'f247.com', 
            'Cookie': cookie
          }
    })
    .then(res => res.data)
    .catch (err => console.error(err))
}
let totalLike = 0;
function postAction(_id,csrf, cookie) {
    return axios({
        url: 'https://f247.com/post_actions',
        method: 'post',
        headers: { 
            'authority': 'f247.com', 
            'discourse-present': 'true', 
            'x-csrf-token': csrf, 
            'sec-ch-ua-mobile': '?0', 
            'discourse-logged-in': 'true', 
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
            'accept': '*/*', 
            'x-requested-with': 'XMLHttpRequest', 
            'origin': 'https://f247.com', 
            'sec-fetch-site': 'same-origin', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-dest': 'empty', 
            'accept-language': 'en-GB,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,en-US;q=0.6', 
            'cookie': cookie
          },
        data : 'id='+_id + '&post_action_type_id=2' + '&flag_topic=false'
    })
    .then(res => res.data)
    .catch (err => {
        if(err.response.status === 403) {
            console.log('post da liked');
        } 
        if(err.response.status === 429) {
            console.log('vuot qua so liked');
        } 
        return err
    })
} 

function getCsrf() {
    return axios({
        url: 'https://f247.com/session/csrf',
        method: 'get',
        headers:{
            'Host': 'f247.com', 
            'discourse-present': 'true', 
            'x-csrf-token': 'undefined', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.53', 
            'accept': 'application/json, text/javascript, */*; q=0.01', 
            'x-requested-with': 'XMLHttpRequest', 
            'referer': 'https://f247.com/', 
            'accept-language': 'en-US,en;q=0.9'
        }
    }).then(res =>res)
    .catch(err =>{
        console.error(err)
    })
}

function getSession(csrf, username,password, cookie) {
    return axios({
        url: 'https://f247.com/session',
        method: 'post',
        headers: { 
            'Host': 'f247.com', 
            'sec-ch-ua': '"Microsoft Edge";v="95", "Chromium";v="95", ";Not A Brand";v="99"', 
            'discourse-present': 'true', 
            'x-csrf-token': csrf, 
            'sec-ch-ua-mobile': '?0', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.53', 
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
            'accept': '*/*', 
            'x-requested-with': 'XMLHttpRequest', 
            'origin': 'https://f247.com', 
            'sec-fetch-site': 'same-origin', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-dest': 'empty', 
            'referer': 'https://f247.com/', 
            'accept-language': 'en-US,en;q=0.9',
            'Cookie': cookie
          },
          data : 'login='+username + '&password=' + password
    }).then(res => 
        res
    )
    .catch(err =>{
        console.error(err)
    })
}

function login(csrf, username,password, cookie) {
    return axios({
        url: 'https://f247.com/login',
        method: 'post',
        headers: { 
            'Host': 'f247.com', 
            'sec-ch-ua': '"Microsoft Edge";v="95", "Chromium";v="95", ";Not A Brand";v="99"', 
            'discourse-present': 'true', 
            'x-csrf-token': csrf, 
            'sec-ch-ua-mobile': '?0', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.53', 
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
            'accept': '*/*', 
            'x-requested-with': 'XMLHttpRequest', 
            'origin': 'https://f247.com', 
            'sec-fetch-site': 'same-origin', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-dest': 'empty', 
            'referer': 'https://f247.com/', 
            'accept-language': 'en-US,en;q=0.9',
            'Cookie': cookie
          },
          data : 'username='+username + '&password=' + password +"&redirect=https%3A%2F%2Ff247.com%2F"
    }).then(res => 
        res
    )
    .catch(err =>{
        console.error(err)
    })
}
prompt.start();
prompt.get(['username', 'password', 'delay'], function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received:');
    console.log('  Username: ' + result.username);
    console.log('  Password: ' + result.password);
    console.log('  Delay: ' + result.delay);

    likedAction(result.username, result.password, result.delay)
});
function onErr(err) {
    console.log(err);
    return 1;
}
async function likedAction(username, password, delay) {
    try {
        // const res = await getThread(0)
        // let arrTopics = []
        // const total_page = res.topic_list.per_page
        // arrTopics = res.topic_list.topics
        // for(let [index, topic] of arrTopics.entries()) {
        //     threadId.push(topic.id)
        // }
        // for(let i=1; i < total_page; i++) {
        //     try {
        //         let _res = await getThread(i);
        //         await sleep(1000) 
        //         let _arrTopics = _res.topic_list.topics
        //         for(let [index, topic] of _arrTopics.entries()) {
        //             threadId.push(topic.id)
        //         }
        //     } catch (error) {
        //         console.log('getThread ' + error);
        //         continue
        //     }
        // }

        //login
        let csrfRes = await getCsrf()
        let csrf = csrfRes.data.csrf
        let cookie1 = csrfRes.headers["set-cookie"]
        // console.log('cookie ' + cookie1);
        // console.log('csrf ' + csrf);
        
        let sessionRes = await getSession(csrf, username,password,cookie1)
        // console.log('sessionRes ' + JSON.stringify(sessionRes));
        let cookie = sessionRes.headers["set-cookie"]
        let zxc = await login(csrf, username,password,cookie)
        
        let threadIds = getThreadIds()
        //
        for(let [index, postId] of threadIds.entries()) {
            // let postId = 10634
            const resPost = await getComments(postId, csrf, cookie)
            if(resPost.post_stream === undefined) continue
            console.log('resPost ' + JSON.stringify(resPost));
            let arrComment = {}
            arrComment.id = postId
            arrComment.stream = resPost.post_stream.stream
            if(arrComment.stream == undefined) {
                console.log('arrComment.stream ');
                continue
            }
            let totalLikedByThread = 0;
            //check liked
            for(let [index, streamId] of arrComment.stream.entries()) {
                if(streamId!=null) {
                    try {
                        const resPostAction = await postAction(streamId, csrf, cookie)
                        await sleep(parseInt(delay)) 
                        // if(resPostAction === 'err') {
                        //     console.log('resPostAction.response.status 403');
                        //     continue
                        // }
                        // console.log('resPostAction.id ' + resPostAction.id);
                    
        
                        if(resPostAction.id !== undefined) {
                            totalLike++
                            totalLikedByThread++
                            console.log('streamId'  + streamId + ' successs');                       
                        }
                    } catch (error) {
                        console.log('post error ' + error);
                        continue
                    }
                }
            }
            console.log('threadId-- ' + postId + '--liked ' + totalLikedByThread + ' successs');                       

    
            // arrComments.push(arrComment)
                // console.log('arrComments ' + JSON.stringify(arrComments));
        }
        console.log('total Liked == '+ totalLike);                       
    } catch(err) {
        console.log('error tong ' + err);  
    }
 };

 function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getThreadIds() {
    let urls = getUrls()
    console.log('urls ' + JSON.stringify(urls));
    
    let threadIds = []
    if(urls!=null) {
        for(let [index, url] of urls.entries()) {
            let threadId = parseUrl.parse(url).pathname.split('/').pop()
            console.log('threadId ' + threadId);
            threadIds.push(threadId)
        }
    }
    return threadIds
}

function getUrls() {
    try {
        const filePath = path.resolve(__dirname, fileName)
        var urls = fs.readFileSync(filePath,'utf8').split(/\r?\n/)
        return urls
    } catch (error) {
        return null
    }

}