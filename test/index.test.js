const request = require('supertest')
const app = require('../app.js');

//验证test开始
describe('开始 Test', () => {
    it('should test that true === true', () => {
        expect(true).toBe(true)
    })
})

//测试接口
describe('测试Put Event', () => {
    it('index接口', async () => {
        const res = await request(app)
            .get('/')
        expect(res.statusCode).toEqual(200)
    })
    it('upload接口', async () => {
        const res = await request(app)
            .put('/upload')
            .attach('file', 'test/测试数据.CSV')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({"code": 201, "message": "上传成功"})
    })
})
