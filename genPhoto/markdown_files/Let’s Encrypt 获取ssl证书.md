### Let’s Encrypt 获取ssl证书

Let’s Encrypt 是一个免费、自动化和开放的证书颁发机构 (CA)，用于为网站启用 HTTPS。以下是使用 Let’s Encrypt 获取和管理 SSL/TLS 证书的基本教程。

#### 一、准备工作

1. 服务器环境：

 • 服务器可以通过公网访问。

 • 常见操作系统：Linux（Ubuntu、Debian、CentOS等）。
2. 域名：

 • 确保你有一个有效的域名，并已将其 DNS 指向你的服务器。
3. 软件安装权限：

 • 需要有 root 或 sudo 权限。

#### 二、使用 Certbot 获取证书

Certbot 是 Let’s Encrypt 推荐的客户端工具。

1. 安装 Certbot

根据你的操作系统，选择相应的安装方式：

• Debian/Ubuntu：

 ```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
 ```

• CentOS/RHEL：

```bash
sudo yum install epel-release
sudo yum install certbot python3-certbot-nginx
```

2. 获取证书

 • Nginx 环境：

Certbot 可以自动配置 Nginx。

```bash
sudo certbot --nginx
```

 • Apache 环境：

如果使用 Apache：

```bash
sudo certbot --apache
```

 • 仅生成证书：
如果不想自动配置 Web 服务器：

```bash
sudo certbot certonly --standalone
```

#### 三、自动续期

Let’s Encrypt 证书的有效期为 90 天，但可以通过 Certbot 自动续期。

 • 手动测试续期：

 ```bash
 sudo certbot renew --dry-run
 ```

 • 添加定期任务（通常已自动添加）：

Certbot 通常会在 /etc/cron.d 或 systemd 中配置自动续期。如果需要，可以检查是否存在以下任务：

```bash
sudo systemctl list-timers | grep certbot
```

#### 四、其他问题

1. 默认情况下，证书存储在 /etc/letsencrypt/live/<your-domain>/ 中。
