# 练了吗

> 今天练什么，30 秒给你一套。

一个给自己用的训练小网站：选「练哪里 / 练多久 / 手边有什么」，生成今天这套动作、组数、休息时间；练的时候有组间倒计时；练完自动记录容量和部位，攒出连续天数。

- 零依赖：没有 React、没有构建步骤、没有数据库
- 数据存在你自己的浏览器里（localStorage），不上传任何服务器
- 手机浏览器打开可以直接「添加到主屏幕」，用起来像 App

## 目录

```
lianlema-web/
├── server.js          # 零依赖静态服务器（也负责 /healthz 健康检查）
├── render.yaml        # Render 一键部署配置
├── public/
│   ├── index.html     # 6 个视图：今日 / 计划 / 训练中 / 完成 / 记录 / 我的
│   ├── styles.css     # 深色单主题
│   └── app.js         # 动作库 32 个、计划生成、计时、记录、导入导出
└── package.json
```

## 本地跑起来

```bash
cd lianlema-web
node server.js          # 默认 3000 端口
# 打开 http://localhost:3000
```

3000 被占用（比如 Docker 占着）就换一个端口：

```bash
PORT=4321 node server.js
```

看「有数据时长什么样」可以用演示数据（只在本地存储为空时注入，不会覆盖你自己的记录）：

- `http://localhost:4321/?demo=1` 六次历史训练 + 六条体重
- `?demo=workout` 直接进训练中页面
- `?demo=rest` 直接看组间休息的圆环倒计时

## 部署到 GitHub + Render

### 1. 推到 GitHub

在 GitHub 新建一个空仓库（不要勾选 README / .gitignore），然后：

```bash
cd lianlema-web
git init -b main
git add .
git commit -m "练了吗 v1"
git remote add origin git@github.com:<你的用户名>/lianlema.git
git push -u origin main
```

### 2. Render 上建服务

**方式 A：Blueprint（推荐，读 render.yaml 自动配好）**

1. 打开 https://dashboard.render.com/blueprints
2. **New Blueprint Instance** → 选刚才那个仓库
3. Render 会读到 `render.yaml`，直接 **Apply**，等一两分钟
4. 拿到形如 `https://lianlema-xxxx.onrender.com` 的地址

**方式 B：手动建 Web Service**

1. https://dashboard.render.com → **New** → **Web Service** → 连仓库
2. 填写：
   - **Runtime**：Node
   - **Build Command**：留空（没有依赖要装，留空比 `npm install` 更快）
   - **Start Command**：`node server.js`
   - **Instance Type**：Free
   - **Health Check Path**：`/healthz`
3. 环境变量里加 `NODE_VERSION = 20`
4. **Create Web Service**

### 3. 手机上用

用手机浏览器打开 Render 给你的地址：

- iOS Safari：分享 → **添加到主屏幕**
- Android Chrome：菜单 → **添加到主屏幕**

之后从桌面图标进来就是全屏，没有地址栏。

## 数据怎么存的

- 全部在 `localStorage` 的 `lianlema.v1` 里：档案、训练记录、体重、当前没做完的那次训练
- Render 免费实例的磁盘是临时的，重启会清空文件系统，所以**没有**接数据库——这也意味着换设备/换浏览器看不到旧数据
- 换设备：**我的 → 导出数据**（存成 JSON）→ 新设备 **导入数据**

## 几个已知的取舍

| 取舍 | 为什么 |
| --- | --- |
| 不接数据库 | 单人自用；免费层磁盘会丢，接数据库要额外付钱 |
| 计划是规则生成，不是 AI | 生成要秒回、要能离线、要每次结果稳定可解释；32 个动作 + 五段式编排已经够用 |
| 重量/容量都是估算值 | 自重动作按体重 65% 折算，只为跟自己比，不做跨人比较 |
| 3000 端口默认 | 本机若是被 Docker 占用，用 `PORT=4321` |

## 健康检查

```bash
curl -s http://localhost:4321/healthz
# {"ok":true,"uptime":12.3}
```

## 免责

训练容量、热量与体重变化均为估算值，仅用于个人记录，不构成医疗或营养建议。有伤病或慢性病请先问医生。
