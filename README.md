# 千屹文件列表

## 项目简介
千屹文件列表是一个基于 Node.js 和 Express 的简单文件列表服务。它可以递归读取指定目录下的文件树，并通过 API 提供文件树的 JSON 数据。

## 功能
- 提供静态文件服务。
- 递归读取指定目录下的文件树。
- 提供文件树的 RESTful API。

## 使用方法

### 1. 安装依赖
确保已安装 [Node.js](https://nodejs.org/)，然后在项目目录下运行以下命令安装依赖：
```bash
npm install
```

### 2. 启动服务
运行以下命令启动服务：
```bash
node server.js
```
服务将运行在 `http://localhost:80`。

### 3. 文件树 API
访问以下 API 获取文件树的 JSON 数据：
```
GET /api/files
```

### 4. 静态文件服务
将文件放置在项目目录下的 `files` 文件夹中，服务会自动提供这些文件的静态访问。

## 项目结构
```
qyFileList/
├── files/          # 存放静态文件的目录
├── server.js       # 主服务文件
├── README.md       # 项目说明文件
```

## 注意事项
- 确保 `files` 文件夹存在，否则文件树 API 将无法正常工作。
- 默认服务端口为 80，可以根据需要修改 `server.js` 中的 `PORT` 变量。

## 许可证
本项目使用 MIT 许可证。
