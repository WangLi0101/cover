# Ubuntu 定时任务指南

## 概述

Ubuntu 系统中，定时任务主要通过 crontab 工具来实现。crontab（cron table）是一个用于设置周期性执行指定命令或脚本的工具，非常适合用于系统维护、自动备份等需要定期执行的任务。

## crontab 基础命令

### 查看当前用户的定时任务

```bash
crontab -l
```

### 编辑当前用户的定时任务

```bash
crontab -e
```

首次运行此命令时，系统会提示选择一个编辑器（如 nano、vim 等）。

### 删除当前用户的所有定时任务

```bash
crontab -r
```

### 查看或编辑其他用户的定时任务（需要 root 权限）

```bash
crontab -u username -l  # 查看指定用户的定时任务
crontab -u username -e  # 编辑指定用户的定时任务
```

## crontab 语法

crontab 的配置语法如下：

```
分钟 小时 日期 月份 星期 命令
```

每个字段的取值范围：

- 分钟：0-59
- 小时：0-23
- 日期：1-31
- 月份：1-12（或使用英文缩写：Jan, Feb, ...）
- 星期：0-7（0 和 7 都表示星期日，或使用英文缩写：Sun, Mon, ...）

### 特殊字符

- `*`：表示所有可能的值
- `,`：用于分隔多个值
- `-`：表示一个范围
- `/`：指定间隔频率

## 常用示例

### 每天凌晨 2 点执行备份脚本

```bash
0 2 * * * /path/to/backup.sh
```

### 每周日凌晨 3 点执行系统更新

```bash
0 3 * * 0 apt update && apt upgrade -y
```

### 每隔 5 分钟执行一次某脚本

```bash
*/5 * * * * /path/to/script.sh
```

### 工作日（周一至周五）每小时执行一次

```bash
0 * * * 1-5 /path/to/workday_script.sh
```

### 每月 1 日和 15 日执行任务

```bash
0 0 1,15 * * /path/to/monthly_task.sh
```

## 环境变量问题

在 crontab 中执行的命令可能会遇到环境变量不同于登录 shell 的情况。为了避免这类问题，可以：

1. 在 crontab 中设置必要的环境变量：

```bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOME=/home/username

# 然后是你的定时任务
0 2 * * * /path/to/script.sh
```

2. 在脚本开头设置环境变量：

```bash
#!/bin/bash
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# 脚本其余部分
```

3. 使用绝对路径：

```bash
0 2 * * * /usr/bin/python3 /path/to/script.py
```

## 日志和错误处理

默认情况下，cron 任务的输出会通过邮件发送给用户。如果你想将输出重定向到文件：

```bash
0 2 * * * /path/to/script.sh > /path/to/logfile.log 2>&1
```

这会将标准输出和错误输出都重定向到指定的日志文件。

## 系统级定时任务

除了用户级的 crontab，Ubuntu 还有系统级的定时任务目录：

- `/etc/crontab`：系统级 crontab 文件
- `/etc/cron.d/`：包含系统级 crontab 任务的目录
- `/etc/cron.hourly/`：每小时执行一次的脚本目录
- `/etc/cron.daily/`：每天执行一次的脚本目录
- `/etc/cron.weekly/`：每周执行一次的脚本目录
- `/etc/cron.monthly/`：每月执行一次的脚本目录

将脚本放入这些目录（确保有执行权限）即可按相应的周期执行。

## 使用 systemd timer 作为替代

在较新的 Ubuntu 版本中，systemd timer 提供了 crontab 的替代方案，具有更好的日志记录和依赖管理功能。

### 创建一个简单的 systemd timer

1. 创建服务单元文件 `/etc/systemd/system/mybackup.service`：

```ini
[Unit]
Description=My Backup Script

[Service]
Type=oneshot
ExecStart=/path/to/backup.sh
User=username

[Install]
WantedBy=multi-user.target
```

2. 创建定时器单元文件 `/etc/systemd/system/mybackup.timer`：

```ini
[Unit]
Description=Run My Backup Script Daily

[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

3. 启用并启动定时器：

```bash
sudo systemctl enable mybackup.timer
sudo systemctl start mybackup.timer
```

4. 查看定时器状态：

```bash
sudo systemctl list-timers
```

## 常见问题排查

1. **任务没有执行**
   - 检查 cron 服务是否运行：`systemctl status cron`
   - 检查任务语法是否正确
   - 检查脚本是否有执行权限：`chmod +x /path/to/script.sh`
   - 查看系统日志：`grep CRON /var/log/syslog`

2. **环境变量问题**
   - 使用绝对路径
   - 在脚本中明确设置环境变量
   - 在 crontab 中添加必要的环境变量

3. **权限问题**
   - 确保脚本和目标文件/目录有正确的权限
   - 如果需要 root 权限，将任务添加到 root 的 crontab 中

## 总结

Ubuntu 的定时任务系统提供了灵活且强大的方式来自动化重复性任务。通过掌握 crontab 的语法和使用技巧，可以有效地管理系统维护、数据备份等定期任务，提高系统管理效率。
