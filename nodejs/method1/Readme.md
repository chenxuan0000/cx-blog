# 文件扫描批量增加替换内容

## 用到的几个api
- 1.[**`fs.readdirSync(path[, options])`**](http://nodejs.cn/api/fs.html#fs_fs_readdirsync_path_options)
- 2.[**`fs.fstatSync(fd)`**](http://nodejs.cn/api/fs.html#fs_fs_fstatsync_fd)
- 3.[**`fs.Stats 类`**](http://nodejs.cn/api/fs.html#fs_class_fs_stats)
- 4.[**`fs.readFile(path[, options], callback)`**](http://nodejs.cn/api/fs.html#fs_fs_readfile_path_options_callback)
- 5.[**`fs.writeFile(file, data[, options], callback)`**](http://nodejs.cn/api/fs.html#fs_fs_writefile_file_data_options_callback)

```javascript
const fs = require('fs')
const findSrc = './test/' // 最后末尾斜杠一定要加上(查询更换主目录)
const findReg  = /<\/head>/gi // 替换查找正则匹配
const testReg  = /#parse\("\/include\/header.html"\)/gi // 过滤文件的正则匹配
const toString = '<link rel="stylesheet" type="text/css" href="${staticCtx}/${ver}/css/pc_common/topheader.css">\n\t</head>' // 替换查找成的字段

function readFileList (path) {
  let files = fs.readdirSync(path);
  files.forEach(function (filename, index) {
    let stat = fs.statSync(path + filename);
    if (stat.isDirectory()) {
      //递归读取文件
      readFileList(path + filename + '/')
    } else {
      const file = `${path}${filename}`
      readFile(file)
    }
  })
}

// 异步读取
function readFile (src) {
  fs.readFile(src, {
    // 需要指定编码方式，否则返回原生buffer
    encoding: 'utf8'
  }, function (err, data) {
    // test匹配有bug（遗漏部分） 用match
    if(!!testReg && data.match(testReg) === null) {
      return
    }
    var dataReplace = data.replace(findReg, toString);
    fs.writeFile(src, dataReplace, {
      encoding: 'utf8'
    },(err) => {
      if(err) console.log(`${src}文件替换错误,${err}`)
      console.log(`${src}文件替换成功`)
    })
  });
}

readFileList(findSrc)
```