# 删除文件夹及文件

## 用到的几个api
- 1.[**`fs.existsSync(path)`**](http://nodejs.cn/api/fs.html#fs_fs_accesssync_path_mode)
- 2.[**`fs.lstatSync(path)`**](http://nodejs.cn/api/fs.html#fs_fs_lstatsync_path)
- 3.[**`fs.Stats 类`**](http://nodejs.cn/api/fs.html#fs_class_fs_stats)
- 4.[**`fs.unlinkSync(path)`**](http://nodejs.cn/api/fs.html#fs_fs_unlinksync_path)

```javascript
'use strict'

const fs = require('fs')
const deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

const deleteFile = curPath => {
  if (fs.existsSync(curPath)) {
    if (fs.lstatSync(curPath).isDirectory()) {
      // recurse
      try {
        deleteFolderRecursive(curPath)
      } catch (e) {
        console.warn(e)
      }
    } else {
      // delete file
      fs.unlinkSync(curPath)
    }
  } else {
    // 不存在这个文件夹
    console.log(`${curPath}目录文件不存在！`)
  }
}

module.exports = deleteFile

```