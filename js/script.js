document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('file-list');
    const header = document.querySelector('.header');
    let currentPath = [];
    let fileTree = null;

    function updatePathNavigation() {
        const navigation = currentPath.map((part, index) => {
            const path = currentPath.slice(0, index + 1).join('/');
            return `<a href="#" data-path="${path}">${part}</a>`;
        }).join(' / ');

        const rootNavigation = `<a href="#" data-path="">首页</a>`;
        const navigationHTML = `<span class="home-icon">🏠</span> ${rootNavigation} ${navigation}`;
        header.querySelector('.navigation').innerHTML = navigationHTML;

        // 重新绑定路径导航点击事件
        document.querySelectorAll('.header .navigation a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.dataset.path ? link.dataset.path.split('/') : [];
                currentPath = path;
                renderFileList();
            });
        });
    }

    function findCurrentFolder(tree, path) {
        let folder = { filelist: tree };
        for (const part of path) {
            folder = folder.filelist.find(item => item.filename === part);
            if (!folder) break;
        }
        return folder;
    }

    function renderFileList() {
        const currentFolder = currentPath.length === 0 ? fileTree : findCurrentFolder(fileTree, currentPath).filelist;
        if (!currentFolder) {
            fileList.innerHTML = `<div class="file-item">无法加载文件夹内容</div>`;
            return;
        }

        updatePathNavigation();
        fileList.innerHTML = ''; // 清空当前列表
        currentFolder.forEach(item => {
            const fileItem = document.createElement('a');
            fileItem.className = 'file-item';
            fileItem.href = item.filelist ? '#' : item.path;
            if (!item.filelist) fileItem.setAttribute('download', '');

            const icon = `<span class="${item.filelist ? 'folder-icon' : 'file-icon'}">${item.filelist ? '📁' : '📄'}</span>`;
            fileItem.innerHTML = `
                ${icon}
                <span>${item.filename}</span>
            `;
            fileList.appendChild(fileItem);

            // 绑定文件夹点击事件
            if (item.filelist) {
                fileItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPath.push(item.filename);
                    renderFileList();
                });
            }
        });
    }

    // 加载文件树
    fetch('/api/files')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载文件树');
            }
            return response.json();
        })
        .then(data => {
            fileTree = data;
            currentPath = [];
            renderFileList();
        })
        .catch(error => {
            console.error('加载文件树失败:', error);
            fileList.innerHTML = `<div class="file-item">无法加载文件树</div>`;
        });
});
