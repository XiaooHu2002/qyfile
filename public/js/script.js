document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('file-list');
    const header = document.querySelector('.header');
    let currentPath = [];
    let fileTree = null;
    let currentView = 'list'; // 默认视图为列表视图

    function toggleView() {
        currentView = currentView === 'list' ? 'grid' : 'list';
        fileList.className = `file-list ${currentView}-view`;
        const toggleButton = document.getElementById('toggle-view');
        toggleButton.innerHTML = currentView === 'list' 
            ? '<span style="font-size: 1.2em;">🪟</span> 切换到网格视图' 
            : '<span style="font-size: 1.2em;">📋</span> 切换到列表视图'; // 替换网格视图图标为 🪟
        renderFileList();
    }

    function updatePathNavigation() {
        const navigation = currentPath.map((part, index) => {
            const path = currentPath.slice(0, index + 1).join('/');
            return `<a href="#" data-path="${path}">${part}</a>`;
        }).join(' / ');

        const rootNavigation = `<a href="#" data-path="">首页</a>`;
        const navigationHTML = `<span class="home-icon">🏠</span> ${rootNavigation} ${navigation}`;
        header.querySelector('.navigation').innerHTML = navigationHTML;

        // 添加视图切换按钮
        let toggleButton = document.getElementById('toggle-view');
        if (!toggleButton) {
            toggleButton = document.createElement('button');
            toggleButton.id = 'toggle-view';
            toggleButton.innerHTML = currentView === 'list' 
                ? '<span style="font-size: 1.2em;">🪟</span> 切换到网格视图' 
                : '<span style="font-size: 1.2em;">📋</span> 切换到列表视图'; // 使用更美观的图标
            toggleButton.addEventListener('click', toggleView);
            header.appendChild(toggleButton); // 将按钮添加到导航栏的最右边
        }

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
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            if (item.isVideo) {
                fileItem.innerHTML = `
                    <a href="/video.html?path=${encodeURIComponent(item.path)}" class="file-link">
                        <span class="file-icon">🎥</span>
                        <span>${item.filename}</span>
                    </a>
                `;
            } else {
                fileItem.innerHTML = `
                    <a href="${item.filelist ? '#' : `/files/${item.path}`}" class="file-link" ${!item.filelist ? 'download' : ''}>
                        <span class="${item.filelist ? 'folder-icon' : 'file-icon'}">${item.filelist ? '📁' : '📄'}</span>
                        <span>${item.filename}</span>
                    </a>
                `;
                if (item.filelist) {
                    fileItem.querySelector('a').addEventListener('click', (e) => {
                        e.preventDefault();
                        currentPath.push(item.filename);
                        renderFileList();
                    });
                }
            }

            fileList.appendChild(fileItem);
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
