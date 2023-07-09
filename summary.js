//console.log("\n %c 博客文章摘要AI生成工具 %c https://blog.yus.bio \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;")
let isRunning = false;

function insertAIDiv(selector) {
  // 首先移除现有的 "post-XiaoyuGPT" 类元素（如果有的话）
  removeExistingAIDiv();
  
  // 获取目标元素
  const targetElement = document.querySelector(selector);

  // 如果没有找到目标元素，不执行任何操作
  if (!targetElement) {
    return;
  }

  // 创建要插入的HTML元素
  const aiDiv = document.createElement('div');
  aiDiv.className = 'Xiaoyu-content';

  const aiTitleDiv = document.createElement('div');
  aiTitleDiv.className = 'Xiaoyu-title';
  aiDiv.appendChild(aiTitleDiv);

  const aiIcon = document.createElement('i');
  aiIcon.className = 'Xiaoyu-title-icon';
  aiTitleDiv.appendChild(aiIcon);

  // 插入 SVG 图标
  aiIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256" style="fill:#000000;">
  <g fill="none" fill-rule="nonzero" stroke="none" stroke-width="none" stroke-linecap="none" stroke-linejoin="none" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="translate(-3.2,9.6) scale(5.33333,5.33333)"><path d="M34,40h-12c-6.6,0 -12,-5.4 -12,-12v0c0,-6.6 5.4,-12 12,-12h12c6.6,0 12,5.4 12,12v0c0,6.6 -5.4,12 -12,12z" fill="#ffffff" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"></path><path d="M24,11.6v-6" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M41.6,28.6c1.1,-0.4 1.9,-1.5 1.9,-2.7v-3.8c0,-1.3 -0.8,-2.4 -2,-2.7" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.5,28.7c-1.2,-0.4 -2.1,-1.5 -2.1,-2.8v-3.8c0,-1.3 0.8,-2.3 1.9,-2.7" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M25.4,36.4h-7.4c-6.8,0 -12.4,-5.6 -12.4,-12.4v0c0,-5 2.9,-9.3 7.1,-11.2" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.9,11.6h11.1c6.8,0 12.4,5.6 12.4,12.4v0c0,6.8 -5.6,12.4 -12.4,12.4" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M34.2,19c1.4,1.2 2.4,3 2.4,5v0c0,3.6 -2.9,6.5 -6.5,6.5h-12.2c-3.6,0 -6.5,-2.9 -6.5,-6.5v0c0,-3.6 2.9,-6.5 6.5,-6.5h12.1" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.9,23.1v1.7" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28.9,23.1v1.7" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></g></g>
</svg>`

  const aiTitleTextDiv = document.createElement('div');
  aiTitleTextDiv.className = 'Xiaoyu-title-text';
  aiTitleTextDiv.textContent = '摘要';
  aiTitleDiv.appendChild(aiTitleTextDiv);

  // const aiTagDiv = document.createElement('div');
  // aiTagDiv.className = 'XiaoyuGPT-tag';
  // aiTagDiv.id = 'XiaoyuGPT-tag';
  // aiTagDiv.textContent = 'XiaoyuGPT';
  // aiTitleDiv.appendChild(aiTagDiv);

  const aiExplanationDiv = document.createElement('div');
  aiExplanationDiv.className = 'summary-content';
  aiExplanationDiv.innerHTML = '让我想想...' + '<span class="blinking-cursor"></span>';
  aiDiv.appendChild(aiExplanationDiv); // 将 XiaoyuGPT-explanation 插入到 aiDiv，而不是 aiTitleDiv

  // 将创建的元素插入到目标元素的顶部
  targetElement.insertBefore(aiDiv, targetElement.firstChild);
}

function removeExistingAIDiv() {
  // 查找具有 "post-XiaoyuGPT" 类的元素
  const existingAIDiv = document.querySelector(".Xiaoyu-content");

  // 如果找到了这个元素，就从其父元素中删除它
  if (existingAIDiv) {
    existingAIDiv.parentElement.removeChild(existingAIDiv);
  }
}

var XiaoyuGPT = {
  //读取文章中的所有文本
  getTitleAndContent: function() {
    try {
      const title = document.title;
      const container = document.querySelector(Xiaoyu_postSelector);
      if (!container) {
        console.warn('没有获取到文章内容');
        return '';
      }
      const paragraphs = container.getElementsByTagName('p');
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5');
      let content = '';
  
      for (let h of headings) {
        content += h.innerText + ' ';
      }
  
      for (let p of paragraphs) {
        // 移除包含'http'的链接
        const filteredText = p.innerText.replace(/https?:\/\/[^\s]+/g, '');
        content += filteredText;
      }
  
      const combinedText = title + ' ' + content;
      let wordLimit = 1000;
      if (typeof XiaoyuGPT_wordLimit !== "undefined") {
        wordLimit = XiaoyuGPT_wordLimit;
      }
      const truncatedText = combinedText.slice(0, wordLimit);
      return truncatedText;
    } catch (e) {
      console.error('内容读取失败', e);
      return '';
    }
  },
  
  fetchXiaoyuGPT: async function(content) {
    if (!key_secret) {
      return "没有检测到密钥";
    }

    if (key_secret === "5Q5mpqRK5DkwT1X9Gi5e") {
      return "请购买密钥后使用";
    }

    const apiUrl = `http://20.66.11.207:3000/api/summary?content=${encodeURIComponent(content)}&key_secret=${encodeURIComponent(key_secret)}`;
    const timeout = 20000; // 设置超时时间（毫秒）
  
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (response.ok) {
            const data = await response.json();
            return data.summary;
        } else {
            if (response.status === 402) {
                document.querySelectorAll('.Xiaoyu-content').forEach(el => {
                    el.style.display = 'none';
                });
            }
            throw new Error('密钥没有绑定或者可用字数不足');
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            if (window.location.hostname === 'localhost') {
                console.warn('无法在localhost获取摘要');
                return '无法在localhost获取摘要';
            } else {
                console.error('请求超时');
                return '获取摘要超时。第一次获取可能由于网络问题或者内容过长导致，请刷新页面重试。';
            }
        } else {
            console.error('请求失败：', error);
            return '获取摘要失败，请刷新页面重试。';
        }
    }
  },

  aiShowAnimation: function (text) {
    const element = document.querySelector(".summay-content");
    if (!element) {
      return;
    }

    if (isRunning) {
      return;
    }
    isRunning = true;
    const typingDelay = 25;
    const waitingTime = 1000;
    const punctuationDelayMultiplier = 6;

    element.style.display = "block";
    element.innerHTML = "让我想想..." + '<span class="blinking-cursor"></span>';

    let animationRunning = false;
    let currentIndex = 0;
    let initialAnimation = true;

    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    let lastUpdateTime = performance.now();

    function type() {
      if (currentIndex < text.length && animationRunning) {
        const currentTime = performance.now();
        const timeDiff = currentTime - lastUpdateTime;

        const letter = text.slice(currentIndex, currentIndex + 1);
        const isPunctuation = /[，。！、？,.!?]/.test(letter);
        const delay = isPunctuation ? typingDelay * punctuationDelayMultiplier : typingDelay;

        if (timeDiff >= delay) {
          element.innerText = text.slice(0, currentIndex + 1);
          lastUpdateTime = currentTime;
          currentIndex++;

          if (currentIndex < text.length) {
            element.innerHTML =
              text.slice(0, currentIndex) +
              '<span class="blinking-cursor"></span>';
          } else {
            element.innerHTML = text;
            element.style.display = "block";
            isRunning = false;
          }
        }
        requestAnimationFrame(type);
      }
    }

    function checkVisibility() {
      if (isInViewport(element)) {
        if (!animationRunning) {
          animationRunning = true;
          if (initialAnimation) {
            setTimeout(() => {
              type();
              initialAnimation = false;
            }, waitingTime);
          } else {
            type();
          }
        }
      } else {
        animationRunning = false;
      }
    }

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);

    function checkVisibility() {
      if (isInViewport(element)) {
        if (!animationRunning) {
          animationRunning = true;
          if (initialAnimation) {
            setTimeout(() => {
              type();
              initialAnimation = false;
            }, waitingTime);
          } else {
            type();
          }
        }
      } else {
        animationRunning = false;
      }
    }
  
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
  
    // 使用 setInterval 添加定时器，周期性检查元素可见性
    const visibilityCheckInterval = setInterval(checkVisibility, 500);
  
    // 当动画完成后，清除定时器
    if (!isRunning) {
      clearInterval(visibilityCheckInterval);
    }
  
    // Trigger initial visibility check
    checkVisibility();
  },
}

function runXiaoyuGPT() {
  insertAIDiv(Xiaoyu_postSelector);
  const content = XiaoyuGPT.getTitleAndContent();
  if (content) {
    //console.log('XiaoyuGPT本次提交的内容为：' + content);
  }
  XiaoyuGPT.fetchXiaoyuGPT(content).then(summary => {
    XiaoyuGPT.aiShowAnimation(summary);
  })
}

function checkURLAndRun() {
  if (typeof XiaoyuGPT_postURL === "undefined") {
    runXiaoyuGPT(); // 如果没有设置自定义 URL，则直接执行 runXiaoyuGPT() 函数
    return;
  }

  try {
    const wildcardToRegExp = (s) => {
      return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$');
    };

    const regExpEscape = (s) => {
      return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    };

    const urlPattern = wildcardToRegExp(XiaoyuGPT_postURL);
    const currentURL = window.location.href;

    if (urlPattern.test(currentURL)) {
      runXiaoyuGPT(); // 如果当前 URL 符合用户设置的 URL，则执行 runXiaoyuGPT() 函数
    } else {
      console.log("绑定错误");
    }
  } catch (error) {
    console.error("绑定错误", error);
  }
}

checkURLAndRun();