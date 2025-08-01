const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 80;
// 静态文件服务
app.use(express.static('public')); // 确保 public 目录优先
app.use('/files', express.static(path.join(__dirname, 'public/files'), {
  setHeaders: (res, filePath) => {
    if (/\.(mp4|webm|ogg)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-cache'); // 禁用缓存
    }
  }
})); // 映射 public/files 到 /files

// 添加文件存在检查逻辑
app.get('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'public/files', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('文件未找到');
  }
});

// 根路径路由
app.get('/', (req, res) => {
  res.send('欢迎使用千屹文件列表服务！');
});

// 文件树 API
app.get('/api/files', (req, res) => {
  const relativePath = decodeURIComponent(req.query.path || ''); // 解码路径参数
  const directoryPath = path.join(__dirname, 'public/files', relativePath);

  const getFileTree = (dir, relativePath = '') => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    return items.map((item) => {
      const fullPath = path.join(dir, item.name);
      const itemRelativePath = path.join(relativePath, item.name).replace(/\\/g, '/'); // 修复路径分隔符
      const isVideo = /\.(mp4|webm|ogg)$/i.test(item.name); // 检测视频文件扩展名
      if (item.isDirectory()) {
        return {
          filename: item.name,
          filelist: getFileTree(fullPath, itemRelativePath), // 递归获取子文件夹内容
          path: encodeURIComponent(itemRelativePath), // 对路径进行编码
        };
      } else {
        return { filename: item.name, path: encodeURIComponent(itemRelativePath), isVideo }; // 添加 isVideo 标记并编码路径
      }
    });
  };

  try {
    const fileTree = getFileTree(directoryPath);
    res.json(fileTree);
  } catch (error) {
    res.status(500).json({ error: '无法加载文件树' });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
