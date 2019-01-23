// TODO:もろもろエラーチェック。commitがないときとか。
module.exports = async function (context, req) {
    var request = require('request');

    var conf = require('./conf');

    //request bodyの書き出し（確認用）
    context.log(req.body);

    //コミットコメントから課題番号を抽出
    //FIXME:１コミットに複数の課題IDが含まれている場合は未考慮
    var issuePattern = /.+-[0-9]+/;
    var commit = req.body.commits[0];
    context.log(commit.message);
    var issueId = commit.message.match(issuePattern);
    context.log(issueId);
    if(!issueId){
        context.res = {
            body:"Issue ID was not included."
        };
        context.done();
    }

    var branchName = (req.body.ref).replace('refs/heads/','');

    //課題書き込み用のコメントを生成
    var issueComment = `[${commit.committer.name} が [${branchName}] ブランチにコミット
${commit.url}
            
<<コミットコメント>>
${commit.message}`;

    //課題コメント用のリクエスト情報を生成する。
    //https://developer.nulab-inc.com/ja/docs/backlog/api/2/add-comment/
    var options = {
            headers: 'Content-Type:application/x-www-form-urlencoded',
            method: 'POST',
            url: `https://${conf.spaceId}.backlog.jp/api/v2/issues/${issueId}/comments?apiKey=${conf.apiKey}`,
            form: {"content": issueComment},
            json :true
        };

    //バックログの課題に書き込み
    request(options, function (error, response, body) {
        context.res = {
            body:issueId + " commented."
        };
    })
    context.log("function finish");
    context.done();
};