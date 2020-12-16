const axios = require('axios');
const https = require('https');
let __COOKIE__ = "";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let sendXml = ``;
let viewServer = "172.16.1.73"


let RequestUrl = (reqUrl, method, sendXml) => {
    axios[method](reqUrl, sendXml, {
        withCredentials: true,
        headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Cookie': __COOKIE__,
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
    })
    .then((response) => {
        let headers = response.headers['set-cookie'];
        let _cookie = (headers || []).join(";");

        console.log(reqUrl); //response.data);

        if(_cookie) {
            console.log("_cookie: ", _cookie);
            __COOKIE__ = _cookie;
        }
        

        if(JSON.stringify(response.headers).indexOf("CID") !== -1) {
            console.log(response.headers);
        }

        if(JSON.stringify(response.data).indexOf("CID") !== -1) {
            console.log(response.data);
        }
    });
};


RequestUrl (`https://${viewServer}/portal/webclient/index.html`, 'get', ``);

setTimeout(() => RequestUrl (`https://${viewServer}/portal/locale/ko.json?_=${(new Date()).valueOf()}`, 'get', ''), 2000);

setTimeout(() => RequestUrl (`https://${viewServer}/portal/info.jsp?_=${(new Date()).valueOf()}`, 'get', ''), 4000);

setTimeout(() => RequestUrl (`https://${viewServer}/portal/locale/ko.json?_=${(new Date()).valueOf()}`, 'get', ''), 6000);
