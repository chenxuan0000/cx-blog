# 📌Git常用命令合集

## Nav-List
- [**`配置用户名和邮箱`**](#配置用户名和邮箱)
- [**`配置常用的别名`**](#配置常用的别名)
- [**`查看配置信息`**](#查看配置信息)
- [**`帮助`**](#帮助)
- [**`初始化仓库`**](#初始化仓库)
- [**`克隆仓库`**](#克隆仓库)
- [**`跟踪新文件`**](#跟踪新文件)
- [**`暂存已修改文件`**](#暂存已修改文件)
- [**`标记冲突文件为已解决状态`**](#标记冲突文件为已解决状态)
- [**`提交更新`**](#提交更新)
- [**`移除文件`**](#移除文件)
- [**`重命名文件`**](#重命名文件)
- [**`取消文件暂存`**](#取消文件暂存)
- [**`返回历史版本`**](#返回历史版本)
- [**`取消文件修改`**](#取消文件修改)
- [**`查看远程仓库信息`**](#查看远程仓库信息)
- [**`添加远程仓库`**](#添加远程仓库)
- [**`从远程仓库拉取信息`**](#从远程仓库拉取信息)
- [**`推送分支到远程仓库`**](#推送分支到远程仓库)
- [**`修改远程仓库引用名`**](#修改远程仓库引用名)
- [**`移除远程仓库`**](#移除远程仓库)
- [**`创建新分支`**](#创建新分支)
- [**`切换分支`**](#切换分支)
- [**`合并分支`**](#合并分支)
- [**`删除分支`**](#删除分支)
- [**`查看分支信息`**](#查看分支信息)
- [**`查看远程分支信息`**](#查看远程分支信息)
- [**`设置本地分支跟踪远程分支`**](#设置本地分支跟踪远程分支)
- [**`变基`**](#变基)
- [**`解决config`**](#解决config)

### 配置用户名和邮箱

```javascript
git config --global user.name "username"
git config --global user.email "username@example.com"
```

### 配置常用的别名

```javascript
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

### 查看配置信息

```javascript
git config user.name
git config --list
```

### 帮助
```javascript
git help branch
git branch --help
```

### 初始化仓库
```javascript
git init
```

### 克隆仓库
```javascript
git clone git@github.com:mastercoder225/linux-command.git
git clone git@github.com:mastercoder225/linux-command.git linux-command-copy
```

### 跟踪新文件
```javascript
git add new.txt
```

### 暂存已修改文件
```javascript
git add modified.txt
```

### 标记冲突文件为已解决状态
```javascript
git add conflict.txt
```

### 提交更新
```javascript
git commit
git commit -m "fix"
git commit -a -m "fix" //合并操作 add commit
```

### 移除文件
```javascript
git rm remove.txt
git rm remove.txt -f
git rm remove.txt --cached
```

### 移动文件
```javascript
git mv file.txt directory
```

### 重命名文件
```javascript
git mv old.txt new.txt
```

### 取消文件暂存
```javascript
git reset HEAD -- staged.txt
```

### 返回历史版本
```javascript
//使用git log命令查看所有的历史版本
git reset --hard 139dcfaa558e3276b30b6b2e5cbbb9c00bbdca96 //返回特定版本
```

### 取消文件修改
```javascript
git checkout -- modified.txt
```

### 查看远程仓库信息
```javascript
git remote
git remote -v
git remote show origin
```

### 添加远程仓库
```javascript
git remote add origin git@github.com:mastercoder225/linux-command.git
```

### 从远程仓库拉取信息
```javascript
git fetch origin
```

### 推送分支到远程仓库
```javascript
git push origin master
```

### 修改远程仓库引用名
```javascript
git remote rename origin repo
```

### 移除远程仓库
```javascript
git remote rm origin
```

### 创建新分支
```javascript
git branch test
git checkout -b test
git checkout -b test origin/test
git checkout --track origin/test
```

### 切换分支
```javascript
git checkout master
```

### 合并分支
```javascript
git merge test
```

### 删除分支
```javascript
git branch -D mystudygit1.0 //强制本地删除
git push --delete origin xxxx //删除远程分支
```

### 查看分支信息
```javascript
git branch
git branch -v
git branch --merged
git branch --no-merged
```

### 查看远程分支信息
```javascript
git ls-remote
git ls-remote origin
```

### 设置本地分支跟踪远程分支
```javascript
git branch -u origin/test
```

### 变基
```javascript
git rebase test
```

### 解决config
```javascript
git rebase --abort // 放弃rebase
//解决config 手动合并
git rebase --continue //继续rebase
git push
```