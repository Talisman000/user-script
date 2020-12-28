// ==UserScript==
// @name        momoirocode-comment-manager
// @namespace   momoirocode-comment-manager
// @version     1
// @match     http://blog.livedoor.jp/kai_tyou/archives/*
// @grant       none
// ==/UserScript==
let articleId;
window.onload = function(){
    let scriptText;
    let begin;
    let end;
    for (let i = 0; i < 30; i++) {
        scriptText = document.getElementsByTagName('script')[i].text;
        begin = scriptText.indexOf("articles");
        end = scriptText.indexOf("};");
        if(begin !== -1 || end !== -1){
            break;
        }
    }
    articleId = scriptText.substring(begin,end).match("id.+,")[0].split("'")[1];
    let cookie = document.cookie.split('; ').find(e => e.indexOf(`invisibleList-${articleId}`) !== -1);
    let invisibleList = [];
    if(cookie !== undefined){
            invisibleList = document.cookie.split('; ').find(e => e.indexOf(`invisibleList-${articleId}`) !== -1).split("=")[1].split(",");
    }
    let info = document.getElementsByClassName("comment-info");
   Array.prototype.forEach.call(info, function(item) {
       if(item.children[0].className !== 'comment-author'){
           return;
       }
       let elementAuthor = item.children[0];
       let elementDate = item.children[1];
       let elementBody = item.children[2];
       let elementId = elementAuthor.textContent.split('.')[0];
       elementAuthor.insertAdjacentHTML('beforeend', '<input class = "invisibleButton" type = "button" value= "非表示にする"/>');
       if(invisibleList.find(element => element === elementId) !== undefined){
           elementBody.textContent = "非表示にしました";
       }
    });
    let invisibleButton = document.getElementsByClassName("invisibleButton");
   Array.prototype.forEach.call(invisibleButton, function(item) {
           item.addEventListener ("click", onUnvisibleButtonClick, false);
   });

}
function onUnvisibleButtonClick(e){
    console.log(e);
    console.log(e.path[1]);
    let commentNumber = e.path[1].textContent.split('.')[0];
    console.log(commentNumber);
    updateData(commentNumber);
    let comment = e.path[2];
    comment.children[2].textContent = "非表示にしました";

 }
function updateData(number){
    let c = document.cookie;
    c = c.split('; ').find(e => e.indexOf(`invisibleList-${articleId}`) !== -1);
    console.log(c);
    let invisibleValue;
    if(c === undefined){
        document.cookie = `invisibleList-${articleId}=${number}`;
    }
    else{
        let invisibleIdList = c.split("=")[1].split(",");
        invisibleIdList.push(number.toString());
        invisibleIdList = invisibleIdList.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });
        console.log(invisibleIdList.toString());
        document.cookie = `invisibleList-${articleId}=${invisibleIdList}`;
    }
    console.log(document.cookie);
}
