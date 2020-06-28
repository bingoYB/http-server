'use strict'
var path = require('path')
var glob = require('glob')
var json404 = { code: 404, message: 'loacl data not found。' }
var json200 = { code: 200, message: 'opearte successfull。' }

module.exports = function (option) {
  var mockPath = option.root
  return function jsonres(req, res) {
    if (req.url.indexOf('.json') > 0) {
      var basePath = path.join(path.resolve(mockPath), '/');
      // 排除参数
      var l = req.url.indexOf('?')
      var reqUrl = l === -1 ? req.url : req.url.substring(0, l)
      var jsonFile = glob.sync(basePath + reqUrl)
      if (jsonFile.length) {
        // 删除文件
        delete require.cache[jsonFile[0].replace(/\//g, '\\')]
        // 加载数据文件
        var resJson = require(jsonFile[0])
        if (resJson) {
          res.end(JSON.stringify(resJson))
          return
        }
      }

      if (reqUrl.match(/add|save|del|delete|update/)) {
        res.json(json200)
      }
      else {
        res.json(json404)
      }
    }
    else {
      res.emit('next')
    }
  }
};