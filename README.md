# 概要
githubのwebhookを起点にbacklogの課題にコメントする

# 事前準備
## nodeのrequestモジュールのインストール
nodeのrequestモジュールのインストールが必要です。
(参考)azure の場合
https://qiita.com/567000/items/582da1c0f0b45eb25bfd

## バックログの設定情報を記載
conf.jsにバックログのAPIキーとスペースIDを設定してください。

# その他
azure functionを使って動作確認済。
aws のlamdaでも使えると思う。