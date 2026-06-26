const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
        ExternalHyperlink, HeadingLevel, BorderStyle, WidthType, ShadingType, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const PROJECT = 'C:/Users/one/WorkBuddy/2026-06-10-02-23-42';

function loadImage(filename) {
  const p = path.join(PROJECT, 'docs/工程文章/images-html', filename);
  if (fs.existsSync(p)) return fs.readFileSync(p);
  return null;
}

const img01 = loadImage('01-mcp-pipeline.png');
const img02 = loadImage('02-three-solutions.png');
const img03 = loadImage('03-self-test.png');

const border = { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };
const A4_WIDTH = 9026;
const BODY = 24;
const SMALL = 22;
const CAPTION = 18;
const H2_SIZE = 28;
const H3_SIZE = 24;
const FONT = 'Microsoft YaHei';

function p(text, opts = {}) {
  return new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun({ text, font: FONT, size: BODY, ...opts })] });
}
function pSmall(text, opts = {}) {
  return new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun({ text, font: FONT, size: SMALL, ...opts })] });
}
function pCap(text) {
  return new Paragraph({ spacing: { before: 40, after: 40 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text, font: FONT, size: CAPTION, color: '999999' })] });
}
function h2(text) {
  return new Paragraph({ spacing: { before: 360, after: 120 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, font: FONT, size: H2_SIZE, bold: true, color: '1A1A1A' })] });
}
function h3(text) {
  return new Paragraph({ spacing: { before: 240, after: 100 }, heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, font: FONT, size: H3_SIZE, bold: true, color: '1A1A1A' })] });
}
function boldP(text) {
  return new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun({ text, font: FONT, size: BODY, bold: true })] });
}

function coloredBox(content, bgColor, borderColor) {
  const cb = { top: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
               bottom: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
               left: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
               right: { style: BorderStyle.SINGLE, size: 1, color: borderColor } };
  return new Table({
    width: { size: A4_WIDTH, type: WidthType.DXA },
    columnWidths: [A4_WIDTH],
    rows: [new TableRow({
      children: [new TableCell({
        borders: cb, shading: { fill: bgColor, type: ShadingType.CLEAR },
        width: { size: A4_WIDTH, type: WidthType.DXA },
        margins: { top: 200, bottom: 200, left: 240, right: 240 },
        children: Array.isArray(content) ? content : [content],
      })]
    })]
  });
}

// ====== BUILD DOCUMENT ======
const ch = [];

// ---- Title ----
ch.push(new Paragraph({
  spacing: { before: 200, after: 100 },
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text: 'WorkBuddy的QQ邮箱发件失败？我和WorkBuddy合作用零成本的方法解决了。', font: FONT, size: 32, bold: true, color: '1A1A1A' })],
}));
ch.push(new Paragraph({ spacing: { before: 0, after: 320 }, children: [new TextRun({ text: '马斯克 · 2026-06-18', font: FONT, size: 20, color: '999999' })] }));

// ---- Dark intro ----
ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: 'TL;DR', font: FONT, size: SMALL, bold: true, color: '60A5FA' })], }),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '某天我发现WorkBuddy的QQ邮箱连接器出现了"显示已发送但对方没收到"的诡异现象。我没有等官方修复，而是拉着WorkBuddy一起从工程层面拆解了MCP连接器的底层机制，找到了三个零成本解决方案——全程没写一行代码，成功率从"碰运气"提升到"基本可靠"。', font: FONT, size: SMALL, color: 'CBD5E1' })], }),
], '1A1A2E', '1A1A2E'));

// ===== Section 1: 发现问题 =====
ch.push(h2('一、发现问题：明明发送成功，对方却说没收到'));

ch.push(p('故事是这样的。'));
ch.push(p('我在WorkBuddy上接入了QQ邮箱连接器——扫码、授权、状态变绿，整个过程不到30秒。日常发几封邮件、查一下收件箱，体验很顺畅。'));
ch.push(p('但用了几天后，出现了一个诡异的现象：'));
ch.push(boldP('我让WorkBuddy帮我发一封邮件，连接器显示"发送成功"。过了半天，对方回复说"没收到"。'));

ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: '问题特征', font: FONT, size: H3_SIZE, bold: true, color: '475569' })], }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '① 不是每次都失败——大概10封里有2-3封对方收不到', font: FONT, size: SMALL, color: '475569' })] }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '② 我自己去QQ邮箱网页版查"已发送"，邮件确实发出去了', font: FONT, size: SMALL, color: '475569' })] }),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '③ 对方的垃圾箱和收件箱都没有——邮件像是凭空消失了', font: FONT, size: SMALL, color: '475569' })] }),
], 'F8FAFC', 'E2E8F0'));

ch.push(p('这个问题最烦人的地方在于：它不是每次都失败。你没法复现，也没法排查——等你真想去抓日志的时候，它又正常了。'));

// ===== Section 2: 研究问题 =====
ch.push(h2('二、研究问题：我和WorkBuddy一起拆解了MCP的底层机制'));

ch.push(p('我没有等官方修复，也没有去论坛发帖求助。我做了另一件事：'));

ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 0, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '我让WorkBuddy帮我一起研究它自己的底层机制。', font: FONT, size: SMALL, bold: true, color: '1D4ED8' })] }),
], 'EFF6FF', '93C5FD'));

ch.push(p('听起来像套娃，但这是AI时代最被低估的能力——让工具解释工具本身。'));

ch.push(h3('2.1 MCP连接器是怎么工作的？'));

ch.push(p('WorkBuddy的QQ邮箱连接器底层用的是MCP协议（Model Context Protocol）。简单说，MCP的设计逻辑是：'));
ch.push(p('你发一条指令 → 连接器处理 → 返回结果 → 连接器等待下一条指令'));

ch.push(p('这是一个典型的"短链路同步调用"模型。对于查天气、搜资料、读文件这类操作，这个模型非常高效——请求进来，响应出去，结束。'));

ch.push(h3('2.2 邮件发送为什么是"长链路"？'));

ch.push(p('但邮件发送不一样。它不是"一锤子买卖"：'));
ch.push(p('收到指令"发邮件" → 组装邮件内容 → 暂停，等你确认 → 你确认后 → 再次调用来投递'));

ch.push(boldP('在你"确认"和"投递"之间的空档里，连接器进程可能已经被平台回收了。'));

ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '核心结论', font: FONT, size: H3_SIZE, bold: true, color: '059669' })], }),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '这不是Bug，是MCP的"短链路设计"和邮件"长链路场景"之间的天然不匹配。工具没配对上场景。', font: FONT, size: SMALL })], }),
], 'F0FDF4', '10B981'));

ch.push(p('理解了这一点，解决思路就清晰了：不是去改连接器，而是让我们的操作方式去适配MCP的运行规律。'));

ch.push(pSmall('下面这张图是WorkBuddy帮我画出来的完整调用链路：', { color: '475569' }));

if (img01) {
  ch.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: img01, transformation: { width: 540, height: 320 }, altText: { title: 'MCP调用链路', description: 'MCP SendMessage 两阶段调用链路图', name: '01-mcp-pipeline' } })] }));
}
ch.push(pCap('▲ 图1：MCP连接器SendMessage的四个阶段——第二阶段和第三阶段之间是"危险空窗期"'));

// ===== Section 3: 解决问题 =====
ch.push(h2('三、解决问题：三个零成本方案，从最容易的开始'));

ch.push(p('我和WorkBuddy一起找到了三个方案，全程没写一行代码、没装任何东西。按难度递进——大部分读者用方案1就够了。'));

// Solution 1
ch.push(h3('方案1：确认即发送，别让连接器"闲着"'));
ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '适合：每天手动发几封邮件的场景', font: FONT, size: SMALL, color: '555555' })] }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '做法：', font: FONT, size: SMALL, bold: true }), new TextRun({ text: 'AI组装好邮件内容后，立即点击确认发送——别切窗口、别看微信。', font: FONT, size: SMALL })] }),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '原理：', font: FONT, size: SMALL, bold: true }), new TextRun({ text: '连接器的进程回收发生在空闲时。确认和投递之间的空档越短，越不容易被中断。', font: FONT, size: SMALL })] }),
], 'F8FAFC', 'E2E8F0'));

ch.push(new Paragraph({ spacing: { before: 40, after: 160 }, children: [new TextRun({ text: '难度：⭐（零配置，改一下操作习惯就行）', font: FONT, size: SMALL, bold: true, color: '059669' })] }));

// Solution 2
ch.push(h3('方案2：发重要邮件前，先"热身"'));
ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '适合：重要邮件、定时任务前', font: FONT, size: SMALL, color: '555555' })] }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '做法：', font: FONT, size: SMALL, bold: true }), new TextRun({ text: '对WorkBuddy说"发一封测试邮件给我自己，主题test"→ 去QQ邮箱确认收到 → 立即发正式邮件。', font: FONT, size: SMALL })] }),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '原理：', font: FONT, size: SMALL, bold: true }), new TextRun({ text: '测试邮件的"组装→确认→投递"过程重新建立了连接器与平台之间的活跃会话。', font: FONT, size: SMALL })] }),
], 'F8FAFC', 'E2E8F0'));

ch.push(new Paragraph({ spacing: { before: 40, after: 160 }, children: [
  new TextRun({ text: '难度：⭐⭐（加一步确认）', font: FONT, size: SMALL, bold: true, color: 'B45309' }),
  new TextRun({ text: ' · 热身完尽快发，隔了十几分钟就白热身了', font: FONT, size: SMALL, color: '555555' }),
]}));

// Solution 3
ch.push(h3('方案3：一次性指令，跳过"中间等待"'));
ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '适合：常规通知类邮件，不需要逐字确认内容', font: FONT, size: SMALL, color: '555555' })] }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '核心思路：', font: FONT, size: SMALL, bold: true }), new TextRun({ text: '传统流程是"组装→你确认→投递"。如果跳过确认，组装和投递之间的空档就消失了。', font: FONT, size: SMALL })] }),
  new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: '做法（可直接复制到WorkBuddy）：', font: FONT, size: SMALL, bold: true })], }),
  new Paragraph({ spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: '发邮件给 zhang@example.com，主题"项目进展同步"，正文如下：\n张总好，本周项目进展如下：1. ... 2. ... 3. ...\n请直接发送，不需要我确认。', font: 'Consolas', size: 20 })],
  }),
], 'F8FAFC', 'E2E8F0'));

ch.push(new Paragraph({ spacing: { before: 40, after: 240 }, children: [
  new TextRun({ text: '难度：⭐⭐⭐（改一下说法就行）', font: FONT, size: SMALL, bold: true, color: '059669' }),
  new TextRun({ text: ' · 重要邮件建议保留确认步骤，确认后立即点击', font: FONT, size: SMALL, color: '555555' }),
]}));

ch.push(pSmall('三张图帮你快速对比：', { color: '475569' }));
if (img02) {
  ch.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: img02, transformation: { width: 540, height: 320 }, altText: { title: '三个方案速览', description: '三个方案难度递进卡', name: '02-three-solutions' } })] }));
}
ch.push(pCap('▲ 图2：三个方案速览——全程零代码，从改习惯到改说法'));

// ===== Section 4: 自测 =====
ch.push(h2('四、5秒自测：你需要升级吗？'));

ch.push(pSmall('对照下面的决策树，看看你属于哪种场景：', { color: '475569' }));

const selfTest = [
  ['✅', '每天只发几封手动邮件 → 不用改，MCP 够用'],
  ['✅', '偶尔看看邮件正文 → 不用改'],
  ['⚠️', '有定时发邮件的需求 → 用上面三个技巧'],
  ['❌', '需要下载附件做自动化 → 必须升级到Node.js脚本方案'],
  ['❌', '批量发通知 / 高可靠场景 → 必须升级'],
];
ch.push(new Table({
  width: { size: A4_WIDTH, type: WidthType.DXA }, columnWidths: [600, 8426],
  rows: selfTest.map(([icon, text]) => new TableRow({ children: [
    new TableCell({ borders, width: { size: 600, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: icon, font: FONT, size: BODY })] })] }),
    new TableCell({ borders, width: { size: 8426, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text, font: FONT, size: SMALL })] })] }),
  ]})),
}));

if (img03) {
  ch.push(new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: img03, transformation: { width: 540, height: 320 }, altText: { title: '5秒自测', description: '决策树', name: '03-self-test' } })] }));
}
ch.push(pCap('▲ 图3：5秒自测决策树——找到最适合你的方案'));

// ===== Section 5: 思考 =====
ch.push(h2('五、这次经历的一个思考'));

ch.push(p('整个过程最让我印象深刻的是：'));

ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '我没有把WorkBuddy当成一个"出问题的工具"，而是把它当成了"一起研究问题的伙伴"。', font: FONT, size: SMALL, bold: true, color: '475569' })] }),
], 'F8FAFC', 'E2E8F0'));

ch.push(p('我们一起拆解了MCP协议的执行链路，一起画了调用时序图，一起从"短链路同步调用vs长链路异步操作"这个核心矛盾出发，推导出了三个不用改代码、不用等官方的解法。'));

ch.push(p('三个方案能让你在现有MCP连接器下大幅降低出问题的概率。但说到底，MCP连接器的价值是"快速接入、零代码上手"——对于轻度场景，它是最佳选择。'));
ch.push(boldP('记住一个原则：短链路直接用，长链路加防护，核心场景升级。'));

// Summary
ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: '📌 三句话总结', font: FONT, size: H3_SIZE, bold: true, color: '1A1A1A' })] }),
  new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: '① MCP是为短链路设计的，邮件是长链路——不匹配是机制特性，不是Bug', font: FONT, size: SMALL, color: '475569' })] }),
  new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: '② 三个零成本方案：立即确认 → 热身自测 → 一次性指令', font: FONT, size: SMALL, color: '475569' })] }),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '③ 轻度场景MCP够用，核心场景需要升级——下周解锁100%可靠方案', font: FONT, size: SMALL, color: '475569' })] }),
], 'F8FAFC', 'E2E8F0'));

// CTA
ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 80, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '今天就可以做的一件事', font: FONT, size: H3_SIZE, bold: true, color: '1D4ED8' })] }),
  new Paragraph({ spacing: { before: 0, after: 0, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '打开WorkBuddy，用"方案三"的一次性指令给自己发封测试邮件，亲测成功率。', font: FONT, size: SMALL, color: '475569' })] }),
], 'EFF6FF', '93C5FD'));

// Next
ch.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 80, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '下篇预告：100%可靠的终极方案', font: FONT, size: H3_SIZE, bold: true, color: '60A5FA' })] }),
  new Paragraph({ spacing: { before: 0, after: 60, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '不用MCP、不用连接器、没有静默失败。', font: FONT, size: SMALL, color: '94A3B8' })] }),
  new Paragraph({ spacing: { before: 0, after: 60, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: 'Node.js脚本 + SMTP直连 + 系统环境变量安全加固', font: FONT, size: SMALL, bold: true, color: 'CBD5E1' })] }),
  new Paragraph({ spacing: { before: 0, after: 0, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '从"能用"到"可靠"，一次性解决。', font: FONT, size: SMALL, color: '94A3B8' })] }),
], '0F172A', '334155'));

// Footer
ch.push(new Paragraph({ spacing: { before: 400, after: 80 }, border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB', space: 8 } }, children: [new TextRun({ text: '参考资料', font: FONT, size: 20, bold: true, color: '666666' })] }));

const refs = [['QQ邮箱 IMAP/SMTP 服务说明', 'https://service.mail.qq.com/'], ['MCP 协议官方文档', 'https://modelcontextprotocol.io/']];
ch.push(new Table({
  width: { size: A4_WIDTH, type: WidthType.DXA }, columnWidths: [4513, 4513],
  rows: refs.map(([n, u]) => new TableRow({ children: [
    new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: n, font: FONT, size: CAPTION })] })] }),
    new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new ExternalHyperlink({ children: [new TextRun({ text: u, font: FONT, size: CAPTION, color: '3B82F6', underline: { type: 'single' } })], link: u })] })] }),
  ]})),
}));

ch.push(new Paragraph({ spacing: { before: 200, after: 80 }, children: [new TextRun({ text: '创作SKILL', font: FONT, size: 20, bold: true, color: '666666' })] }));

const skills = [
  ['wuhao-writer 吴昊风格工程文章 V2.0', '第一人称叙事 · 反Slop语气控制 · 三道验证门控'],
  ['article-illustration-pro V1.0', 'HTML+CSS工程化配图 · 三层配图技术栈'],
  ['封面制作全流程方法论 V1.0', 'AI生图三层策略 · 六维评估'],
];
ch.push(new Table({
  width: { size: A4_WIDTH, type: WidthType.DXA }, columnWidths: [4513, 4513],
  rows: skills.map(([n, d]) => new TableRow({ children: [
    new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: n, font: FONT, size: CAPTION })] })] }),
    new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: d, font: FONT, size: CAPTION })] })] }),
  ]})),
}));

ch.push(new Paragraph({ spacing: { before: 160, after: 0 }, children: [new TextRun({ text: '插图技术方案：HTML+CSS（1200×675px）→ Playwright截图PNG，语义配色（蓝=信息/绿=正确/红=风险/橙=警告）', font: FONT, size: CAPTION, color: '666666' })] }));

// Pack
const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: BODY } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children: ch }],
});

const outPath = path.join(PROJECT, 'docs/工程文章/QQ邮箱上篇_工程风格v2_可编辑版.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('DOCX created:', outPath);
  console.log('Size:', (buf.length / 1024).toFixed(1), 'KB');
}).catch(err => { console.error('Error:', err.message); process.exit(1); });
