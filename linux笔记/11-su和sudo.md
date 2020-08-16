## `su` 和 `sudo`

> 临时切换用户执行命令

- `su` 切换到某个用户
- `sudo` 以自己的身份使用其他用户执行

### 操作 demo

```bash
# root用户执行30分钟后关机
shutdown -h 30

# 普通关闭定时关机（普通用户没有权限）
shutdown -c

# 使用`visudo`修改用户可以执行命令, ALL所有ip都可以执行
<用户名> ALL=/sbin/shutdown -c

# 查看命令位置
which <命令位置>
```
