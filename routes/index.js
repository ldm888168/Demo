var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require("fs");
var Papa = require('papaparse');
var AWS = require('aws-sdk');
var table = require('./model');
AWS.config.loadFromPath('./config.json');
var SNS = new AWS.SNS({apiVersion: '2010-03-31'});
var TopicArn = null;

//创建Topic
SNS.createTopic({Name: "TOPIC_NAME"}).promise().then(data=>{
  TopicArn = data.TopicArn;
  //console.log("Topic创建成功:",data.TopicArn);
}).catch(err =>{
  //console.log("Topic创建失败:",err);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//上传
router.put('/upload',function (req, res, next) {
  let rspContent={
    code:201,
    message:'上传成功'
  };
  let form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      rspContent.code = 1;
      rspContent.message = err;
    }

    Object.values(files).forEach(async(file) => {
      if(file.type == "text/csv"){//文件格式正确，入库
        let data = fs.readFileSync(file.path,'utf-8');
        let records = Papa.parse(data.trim(), {
          header: true
        });
        await table.create();
        table.insert(records);
      }else{//文件类型有误，将错误传递给SNS Topic
        rspContent.code = 1;
        rspContent.message = "文件类型有误";
        if(TopicArn){
          let params = {
            Message: '文件类型有误',
            TopicArn: TopicArn
          };
          SNS.publish(params).promise().then(data =>{
            console.log("消息发送成功:",data);
          }).catch(err => {
            console.log("消息发送失败:",err);
          });
        }
      }
    });
    res.send(rspContent);
  });
})

module.exports = router;
