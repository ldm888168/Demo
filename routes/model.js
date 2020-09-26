var dynamo = require('dynamodb');
var Joi    = require('joi');
dynamo.AWS.config.loadFromPath('./config.json');

//定义
var Address = dynamo.define('Address', {
    hashKey : 'id',
    timestamps : true,
    schema : {
        id : dynamo.types.uuid(),
        latitude : Joi.number(),
        longitude : Joi.number(),
        address : Joi.string()
    }
});

//生成
function createTable(){
    dynamo.createTables(function(err) {
        if (err) {
            //console.log('创建库表失败: ', err);
        } else {
            console.log('创建库表成功');
        }
    });
}

//删除
function deleteTable(){
    Address.deleteTable(function(err) {
        if (err) {
            console.log('Address表删除失败: ', err);
        } else {
            console.log('Address表删除成功');
        }
    });
}

//插入
function insert(data){
    Address.create(data, function (err, items) {
        if(err){
            //console.log('Address入库失败：', err);
        }
        //console.log('Address入库数据：', items);
    });
}

var addressModel = {
    create: createTable,
    insert: insert,
    delete: deleteTable
};

module.exports = addressModel;