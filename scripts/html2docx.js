const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
        ExternalHyperlink, HeadingLevel, BorderStyle, WidthType, ShadingType, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const PROJECT = 'C:/Users/one/WorkBuddy/2026-06-10-02-23-42';

// Load images
function loadImage(filename) {
  const p = path.join(PROJECT, 'docs/工程文章/images-html', filename);
  if (fs.existsSync(p)) return fs.readFileSync(p);
  return null;
}

const img01 = loadImage('01-mcp-pipeline.png');
const img02 = loadImage('02-three-solutions.png');
const img03 = loadImage('03-self-test.png');

// ====== Shared styles ======
const border = { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };
const A4_WIDTH = 9026; // A4 content width with 1" margins

function bodyPara(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, ...opts, font: 'Microsoft YaHei', size: 24 })],
  });
}

function boldPara(text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, font: 'Microsoft YaHei', size: 24, bold: true })],
  });
}

// Table-based colored box
function coloredBox(content, bgColor, borderColor, textColor) {
  const cellBorders = { top: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
                        left: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
                        right: { style: BorderStyle.SINGLE, size: 1, color: borderColor } };
  return new Table({
    width: { size: A4_WIDTH, type: WidthType.DXA },
    columnWidths: [A4_WIDTH],
    rows: [new TableRow({
      children: [new TableCell({
        borders: cellBorders,
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        width: { size: A4_WIDTH, type: WidthType.DXA },
        margins: { top: 200, bottom: 200, left: 240, right: 240 },
        children: Array.isArray(content) ? content : [content],
      })]
    })]
  });
}

// ====== Document Content ======
const children = [];

// Title
children.push(new Paragraph({
  spacing: { before: 0, after: 100 },
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text: 'QQ邮箱在WorkBuddy上发不出去？3 个零成本方案，成功率提升 80%', font: 'Microsoft YaHei', size: 32, bold: true, color: '1A1A1A' })],
}));

// Author
children.push(new Paragraph({
  spacing: { before: 0, after: 280 },
  children: [new TextRun({ text: '马斯克 · 2026-06-16', font: 'Microsoft YaHei', size: 20, color: '999999' })],
}));

// Dark intro box
children.push(coloredBox([
  new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [
      new TextRun({ text: 'TL;DR', bold: true, color: '60A5FA', font: 'Microsoft YaHei', size: 22 }),
      new TextRun({ text: '  偶尔"显示已发送但对方没收到"？不是你的问题。三个零配置方案，从改习惯到改说法，把成功率提上来。', font: 'Microsoft YaHei', size: 22, color: 'CBD5E1' }),
    ],
  }),
], '1A1A2E', '1A1A2E', 'CBD5E1'));

// Spacer
children.push(new Paragraph({ spacing: { before: 120, after: 120 }, children: [] }));

// ==== Section 1 ====
children.push(new Paragraph({
  spacing: { before: 320, after: 120 },
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text: '一、这不是你的操作问题', font: 'Microsoft YaHei', size: 28, bold: true, color: '1A1A1A' })],
}));

children.push(bodyPara('QQ 邮箱是腾讯的国民级邮箱产品，WorkBuddy 是腾讯旗下的 AI 智能体平台，两者搭配能释放很大的效率潜力。但目前连接器还在早期阶段，实际使用中会碰到一些体验问题。这篇文章就来说说最常见的"发不出去"问题，以及怎么解决。'));
children.push(bodyPara('WorkBuddy 左侧面板有 QQ 邮箱连接器，扫码即用，状态变绿——日常手动发几封邮件完全没问题。'));
children.push(bodyPara('但如果你偶尔发现"明明点了发送，对方却说没收到"——你并不孤单。这背后是 MCP 连接器的底层机制：'));
children.push(bodyPara('MCP 连接器是为"短链路同步调用"设计的（请求→响应→结束）。但邮件发送是"长链路异步操作"——组装邮件→等待你确认→再次调用来投递。在你确认和投递之间，连接器进程可能已经被平台回收了。'));
children.push(boldPara('这是 MCP 的机制特性——工具没配对上场景。理解了这一点，你就知道什么时候直接用、什么时候要做额外处理。'));
children.push(new Paragraph({
  spacing: { before: 120, after: 60 },
  children: [new TextRun({ text: '下面这张图解释了整个过程：', font: 'Microsoft YaHei', size: 24, color: '475569' })],
}));

// Image 1
if (img01) {
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({ type: 'png', data: img01, transformation: { width: 540, height: 320 }, altText: { title: 'MCP两阶段调用', description: 'MCP SendMessage 两阶段调用链路图', name: '01-mcp-pipeline' } })],
  }));
}
children.push(new Paragraph({
  spacing: { before: 40, after: 280 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '▲ 图1：MCP 连接器 SendMessage 四个阶段的底层机制', font: 'Microsoft YaHei', size: 18, color: '999999' })],
}));

// ==== Section 2 ====
children.push(new Paragraph({
  spacing: { before: 320, after: 120 },
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text: '二、三个方案，从最容易的开始', font: 'Microsoft YaHei', size: 28, bold: true, color: '1A1A1A' })],
}));

children.push(new Paragraph({
  spacing: { before: 120, after: 160 },
  children: [new TextRun({ text: '不需要安装任何东西——三个方案，难度依次递进，选一个最适合你的：', font: 'Microsoft YaHei', size: 24, color: '475569' })],
}));

// Solution 1
children.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '方案1：发完立即确认，别让连接器"闲着"', font: 'Microsoft YaHei', size: 24, bold: true })], }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '适合：每天手动发几封邮件的场景', font: 'Microsoft YaHei', size: 22, color: '555555' })], }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '做法：', font: 'Microsoft YaHei', size: 22, bold: true }), new TextRun({ text: '让 AI 帮你组装好邮件内容后，立即点击确认发送——不要去看一眼微信、切换一个窗口。', font: 'Microsoft YaHei', size: 22 })], }),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '原理：', font: 'Microsoft YaHei', size: 22, bold: true }), new TextRun({ text: '连接器的进程回收通常在空闲时触发。两次操作越紧凑，越不容易被打断。', font: 'Microsoft YaHei', size: 22 })], }),
], 'F8FAFC', 'E2E8F0'));

children.push(new Paragraph({
  spacing: { before: 40, after: 160 },
  children: [new TextRun({ text: '难度：⭐（零配置）', font: 'Microsoft YaHei', size: 22, bold: true, color: '059669' })],
}));

// Solution 2
children.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '方案2：发重要邮件前，"热身"一下', font: 'Microsoft YaHei', size: 24, bold: true })], }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '适合：重要邮件、定时任务前', font: 'Microsoft YaHei', size: 22, color: '555555' })], }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '做法：', font: 'Microsoft YaHei', size: 22, bold: true }), new TextRun({ text: '对 WorkBuddy 说"发一封测试邮件给我自己，主题 test"→ 去 QQ 邮箱确认收到了 → 立即发正式邮件。', font: 'Microsoft YaHei', size: 22 })], }),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '原理：', font: 'Microsoft YaHei', size: 22, bold: true }), new TextRun({ text: '热身过程重新建立了连接器与平台的活跃会话。', font: 'Microsoft YaHei', size: 22 })], }),
], 'F8FAFC', 'E2E8F0'));

children.push(new Paragraph({
  spacing: { before: 40, after: 160 },
  children: [
    new TextRun({ text: '难度：⭐⭐（加一步确认）', font: 'Microsoft YaHei', size: 22, bold: true, color: 'B45309' }),
    new TextRun({ text: ' · 热身完尽快发，别隔了十几分钟——那就白热身了', font: 'Microsoft YaHei', size: 22, color: '555555' }),
  ],
}));

// Solution 3
children.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '方案3：用一次性指令，跳过"中间等待"', font: 'Microsoft YaHei', size: 24, bold: true })], }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '适合：常规通知类邮件', font: 'Microsoft YaHei', size: 22, color: '555555' })], }),
  new Paragraph({ spacing: { before: 0, after: 60 }, children: [new TextRun({ text: '传统流程是"组装→你确认→投递"。如果跳过确认步骤，组装和投递之间的空档就消失了。', font: 'Microsoft YaHei', size: 22 })], }),
  new Paragraph({ spacing: { before: 0, after: 40 }, children: [new TextRun({ text: '做法（可直接复制到 WorkBuddy）：', font: 'Microsoft YaHei', size: 22, bold: true })], }),
  new Paragraph({ spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: '发邮件给 zhang@example.com，主题"项目进展同步"，正文如下：\n张总好，本周项目进展如下：1. ... 2. ... 3. ...\n请直接发送，不需要我确认。', font: 'Consolas', size: 20 })],
  }),
], 'F8FAFC', 'E2E8F0'));

children.push(new Paragraph({
  spacing: { before: 40, after: 240 },
  children: [
    new TextRun({ text: '难度：⭐⭐⭐（改一下说法就行）', font: 'Microsoft YaHei', size: 22, bold: true, color: '059669' }),
    new TextRun({ text: ' · 重要邮件建议保留确认步骤，但确认后立即点击', font: 'Microsoft YaHei', size: 22, color: '555555' }),
  ],
}));

children.push(new Paragraph({
  spacing: { before: 120, after: 60 },
  children: [new TextRun({ text: '三张图帮你快速对比：', font: 'Microsoft YaHei', size: 24, color: '475569' })],
}));

// Image 2
if (img02) {
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({ type: 'png', data: img02, transformation: { width: 540, height: 320 }, altText: { title: '三个方案速览', description: '三个方案难度递进卡', name: '02-three-solutions' } })],
  }));
}
children.push(new Paragraph({
  spacing: { before: 40, after: 280 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '▲ 图2：三个方案速览 — 从最容易的开始，无需安装任何东西', font: 'Microsoft YaHei', size: 18, color: '999999' })],
}));

// ==== Section 3 ====
children.push(new Paragraph({
  spacing: { before: 320, after: 120 },
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text: '三、5 秒自测：你需要升级吗？', font: 'Microsoft YaHei', size: 28, bold: true, color: '1A1A1A' })],
}));

children.push(new Paragraph({
  spacing: { before: 120, after: 160 },
  children: [new TextRun({ text: '对照下面这张决策树，看看你属于哪种场景：', font: 'Microsoft YaHei', size: 24, color: '475569' })],
}));

// Self-test table
const selfTestRows = [
  ['✅', '每天只发几封手动邮件 → 不用改，MCP 够用'],
  ['✅', '偶尔看看邮件正文 → 不用改'],
  ['⚠️', '有定时发邮件的需求 → 可以用上面三个技巧'],
  ['❌', '需要下载附件做自动化 → 必须升级'],
  ['❌', '批量发通知 / 高可靠场景 → 必须升级'],
];

children.push(new Table({
  width: { size: A4_WIDTH, type: WidthType.DXA },
  columnWidths: [600, 8426],
  rows: selfTestRows.map(([icon, text]) => new TableRow({
    children: [
      new TableCell({ borders, width: { size: 600, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: icon, font: 'Microsoft YaHei', size: 24 })] })] }),
      new TableCell({ borders, width: { size: 8426, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text, font: 'Microsoft YaHei', size: 22 })] })] }),
    ],
  })),
}));

// Image 3
if (img03) {
  children.push(new Paragraph({
    spacing: { before: 200, after: 60 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({ type: 'png', data: img03, transformation: { width: 540, height: 320 }, altText: { title: '5秒自测决策树', description: '5秒自测决策树', name: '03-self-test' } })],
  }));
}
children.push(new Paragraph({
  spacing: { before: 40, after: 280 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '▲ 图3：5秒自测决策树 — 找到最适合你的方案', font: 'Microsoft YaHei', size: 18, color: '999999' })],
}));

children.push(bodyPara('三个方案能让你在现有 MCP 连接器下大幅降低出问题的概率。但说到底，MCP 连接器的价值是"快速接入、零代码上手"——对于轻度场景，它是最佳选择。'));
children.push(boldPara('记住一个原则：短链路直接用，长链路加防护，核心场景升级。'));

// Summary box
children.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 120 }, children: [new TextRun({ text: '📌 三句话总结', font: 'Microsoft YaHei', size: 24, bold: true, color: '1A1A1A' })], }),
  new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: '① MCP 是为短链路设计的，邮件是长链路——不匹配是机制特性，不是 Bug', font: 'Microsoft YaHei', size: 22, color: '475569' })], }),
  new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: '② 三个零成本方案就能大幅提升成功率：立即确认 → 热身自测 → 一次性指令', font: 'Microsoft YaHei', size: 22, color: '475569' })], }),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '③ 轻度场景 MCP 够用，核心场景需要升级——下周解锁 100% 可靠方案', font: 'Microsoft YaHei', size: 22, color: '475569' })], }),
], 'F8FAFC', 'E2E8F0'));

children.push(new Paragraph({ spacing: { before: 0, after: 0 }, children: [] }));

// CTA
children.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 80, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '今天就可以做的一件事', font: 'Microsoft YaHei', size: 24, bold: true, color: '1D4ED8' })], }),
  new Paragraph({ spacing: { before: 0, after: 0, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '打开 WorkBuddy，用上面"方案三"的一次性指令给自己发封测试邮件，亲测一下成功率。', font: 'Microsoft YaHei', size: 22, color: '475569' })], }),
], 'EFF6FF', '93C5FD'));

children.push(new Paragraph({ spacing: { before: 0, after: 0 }, children: [] }));

// Next article preview
children.push(coloredBox([
  new Paragraph({ spacing: { before: 0, after: 80, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '下周二解锁：100% 可靠的终极方案', font: 'Microsoft YaHei', size: 24, bold: true, color: '60A5FA' })], }),
  new Paragraph({ spacing: { before: 0, after: 60, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '不用 MCP、不用连接器、没有静默失败。', font: 'Microsoft YaHei', size: 22, color: '94A3B8' })], }),
  new Paragraph({ spacing: { before: 0, after: 60, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: 'Node.js 脚本 + SMTP 直连 + 系统环境变量安全加固', font: 'Microsoft YaHei', size: 22, bold: true, color: 'CBD5E1' })], }),
  new Paragraph({ spacing: { before: 0, after: 60, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '从"能用"到"可靠"，一次性解决所有问题。', font: 'Microsoft YaHei', size: 22, color: '94A3B8' })], }),
  new Paragraph({ spacing: { before: 0, after: 0, alignment: AlignmentType.CENTER }, children: [new TextRun({ text: '点上方关注，第一时间收到推送。', font: 'Microsoft YaHei', size: 20, color: '64748B' })], }),
], '0F172A', '334155'));

// Footer
children.push(new Paragraph({
  spacing: { before: 400, after: 80 },
  border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB', space: 8 } },
  children: [new TextRun({ text: '参考资料', font: 'Microsoft YaHei', size: 20, bold: true, color: '666666' })],
}));

// Ref table
const refRows = [
  ['QQ邮箱 IMAP/SMTP 服务说明', 'https://service.mail.qq.com/'],
  ['MCP 协议官方文档', 'https://modelcontextprotocol.io/'],
];
children.push(new Table({
  width: { size: A4_WIDTH, type: WidthType.DXA },
  columnWidths: [4513, 4513],
  rows: refRows.map(([name, url]) => new TableRow({
    children: [
      new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: name, font: 'Microsoft YaHei', size: 18 })] })] }),
      new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new ExternalHyperlink({ children: [new TextRun({ text: url, font: 'Microsoft YaHei', size: 18, color: '3B82F6', underline: { type: 'single' } })], link: url })] })] }),
    ],
  })),
}));

children.push(new Paragraph({
  spacing: { before: 200, after: 80 },
  children: [new TextRun({ text: '创作 SKILL', font: 'Microsoft YaHei', size: 20, bold: true, color: '666666' })],
}));

const skillRows = [
  ['wuhao-writer 吴昊风格工程文章 V2.0', '"从易到难递进"结构 · 反Slop语气控制'],
  ['article-illustration-pro V1.0', 'HTML+CSS工程化配图 · 三层配图技术栈'],
  ['封面制作全流程方法论 V1.0', 'AI生图三层策略 · 六维评估'],
  ['三阶段协作模式 V1.0', '共创大纲 → 竞合接力 → 双盲质检'],
];
children.push(new Table({
  width: { size: A4_WIDTH, type: WidthType.DXA },
  columnWidths: [4513, 4513],
  rows: skillRows.map(([name, desc]) => new TableRow({
    children: [
      new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: name, font: 'Microsoft YaHei', size: 18 })] })] }),
      new TableCell({ borders, width: { size: 4513, type: WidthType.DXA }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: desc, font: 'Microsoft YaHei', size: 18 })] })] }),
    ],
  })),
}));

children.push(new Paragraph({
  spacing: { before: 160, after: 0 },
  children: [new TextRun({ text: '插图技术方案：HTML+CSS（1200×675px 固定画布）→ Playwright 截图 PNG，统一语义配色（蓝=信息 / 绿=正确 / 红=风险 / 橙=警告）', font: 'Microsoft YaHei', size: 18, color: '666666' })],
}));

// Build document
const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Microsoft YaHei', size: 24 } } },
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
    },
    children,
  }],
});

const outPath = path.join(PROJECT, 'docs/工程文章/QQ邮箱上篇_可编辑版.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('DOCX created:', outPath);
  console.log('Size:', (buf.length / 1024).toFixed(1), 'KB');
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
