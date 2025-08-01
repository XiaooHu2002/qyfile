const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 80;

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 递归读取文件树
function getFileTree(dir) {
    const files = fs.readdirSync(dir);
    return files.map(file => {
        const fullPath = path.join(dir, file);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        return {
            filename: file,
            path: fullPath.replace(__dirname + path.sep, '').replace(/\\/g, '/'),
            filelist: isDirectory ? getFileTree(fullPath) : null
        };
    });
}

// 文件树 API
app.get('/api/files', (req, res) => {
    const fileTree = getFileTree(path.join(__dirname, 'files'));
    res.json(fileTree);
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
