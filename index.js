//課題番号の抽出条件
// Revert "～" もひっかけるために " を含めない → [^ \"] の部分
// 本当は先頭だけに制限するところかもだけど、まぁ、実際いままでこれで動いていたのでこれでいく
// そういう意味では現状、行頭に限らず、最初の一つ目にあったものを backlog の課題番号として想定して動いている
const ISSUE_PATTERN = /[^ \"]+-[0-9]+/;

// TODO:もろもろエラーチェック。commitがないときとか。
function postIssueComment(request,conf,context, branchName, commit) {
    //feat: 等は除く
    context.log('メッセージ:[' + commit.message + ']');
    var issueId = commit.message.replace(/.+: /, '').match(ISSUE_PATTERN);
    if(!issueId){
        return;
    }
    context.log('issueId:[' + issueId + ']');

    //課題書き込み用のコメントを生成
    var issueComment = `${commit.committer.name} が [${branchName}] ブランチにコミット
${commit.url}
            
<<コミットコメント>>
${commit.message}`;

    //課題コメント用のリクエスト情報を生成する。
    //https://developer.nulab-inc.com/ja/docs/backlog/api/2/add-comment/
    var options = {
            headers: 'Content-Type:application/x-www-form-urlencoded ',
            method: 'POST',
            url: `https://${conf.spaceId}.backlog.jp/api/v2/issues/${issueId}/comments?apiKey=${conf.apiKey}`,
            form: {"content": issueComment},
            json :true
        };

    //context.log('url is ' + options.url);
    //バックログの課題に書き込み
    request(options, function (error, response, body) {
        context.res = {
            body:issueId + " commented."
        };
    })
}

module.exports = async function (context, req) {
    var request = require('request');

    var conf = require('./conf');

    //request bodyの書き出し（確認用）
    //context.log(req.body);

    //ブランチ名の取得
    var branchName = (req.body.ref).replace('refs/heads/','');

    for(var index in req.body.commits){
        //バックログにPOST
        postIssueComment(request,conf,context,branchName,req.body.commits[index]);
    }
    context.log("function finish");
    context.done();
};