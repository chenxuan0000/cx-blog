# git代码统计

## 查看git上的个人代码量：
```
git log --author="username" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -
```

修改username

``` 
result: added lines: 4760, removed lines: 335, total lines: 4425
```

## 统计每个人增删行数
```
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
```

结果式例
``` 
JiaoXin added lines: 213403, removed lines: 150857, total lines: 62546
John Smith      added lines: 4485, removed lines: 1355, total lines: 3130
Kyrie   added lines: 786, removed lines: 388, total lines: 398
Lynn Jiang      added lines: 200, removed lines: 4, total lines: 196
celia   added lines: 346776, removed lines: 406099, total lines: -59323
hanjy   added lines: 8994, removed lines: 4504, total lines: 4490
hjy     added lines: 649, removed lines: 14, total lines: 635
nali    added lines: 10921, removed lines: 10824, total lines: 97
porter  added lines: 4536, removed lines: 2469, total lines: 2067
xuan.chen       added lines: 58420, removed lines: 42157, total lines: 16263
``` 

### 查看仓库提交者排名前5
```
git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r | head -n 5
```

### 贡献值统计
```
git log --pretty='%aN' | sort -u | wc -l
```

### 提交数统计
```
git log --oneline | wc -l
```

