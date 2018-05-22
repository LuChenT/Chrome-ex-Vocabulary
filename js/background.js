var oauth = ShanbayOauth.initPage();

function logout(){
    oauth.clearToken();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendReponse){
    if (request.action == 'authorize'){
        oauth.authorize(sendReponse);
    }
})

function makeRequest(url,callback,word){
    console.log('request url', url);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            callback(word,xhr.responseText);
        }
    };
    xhr.open('GET', url, true);
    xhr.send(null);
}

function HandleResult(word,response){
	var wordDetail = JSON.parse(response);
	 if (wordDetail.status_code === 0) {
        var cn_definition = wordDetail.data.cn_definition.defn;
        var pron = wordDetail.data.pronunciation;
		alert(word+"  /"+pron+"/"+"\n"+cn_definition);
    }
	
}

chrome.contextMenus.create({
	title: '查询单词：%s', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function(params)
	{
		// 注意不能使用location.href，因为location是属于background的window对象
		//chrome.tabs.create({url: 'https://api.shanbay.com/bdc/search/?word=' + encodeURI(params.selectionText)});
		var base_url='https://api.shanbay.com/bdc/search/?word=' + encodeURI(params.selectionText);
		var rest=makeRequest(base_url,HandleResult,params.selectionText);
		
		
		
	}
});
