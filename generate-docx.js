const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
        ExternalHyperlink, Header, Footer, PageNumber, LevelFormat } = require("docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };
const contentWidth = 9360;

function header(text, level) {
  const sizes = { 1: 32, 2: 28, 3: 24, 4: 22 };
  const spacing = { 1: { before: 360, after: 240 }, 2: { before: 280, after: 200 }, 3: { before: 240, after: 160 }, 4: { before: 200, after: 120 } };
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : level === 3 ? HeadingLevel.HEADING_3 : HeadingLevel.HEADING_4,
    spacing: spacing[level],
    children: [new TextRun({ text, bold: true, size: sizes[level], font: "Microsoft YaHei" })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, before: opts.before || 0 },
    children: [new TextRun({ text, size: 22, font: "Microsoft YaHei", ...opts })]
  });
}

function boldP(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, bold: true, size: 22, font: "Microsoft YaHei" })]
  });
}

function code(text) {
  return new Paragraph({
    spacing: { after: 100 },
    shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
    children: [new TextRun({ text, font: "Consolas", size: 20 })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 22, font: "Microsoft YaHei" })]
  });
}

function table(cols, rows) {
  const cw = Math.floor(contentWidth / cols);
  return new Table({
    width: { size: contentWidth, type: WidthType.DXA },
    columnWidths: Array(cols).fill(cw),
    rows: rows.map((row, ri) => new TableRow({
      children: row.map((cell, ci) => new TableCell({
        borders,
        width: { size: cw, type: WidthType.DXA },
        margins: cellMargins,
        shading: ri === 0 ? { fill: "D5E8F0", type: ShadingType.CLEAR } : undefined,
        children: [new Paragraph({
          children: [new TextRun({ text: cell, size: 20, font: "Microsoft YaHei", bold: ri === 0 })]
        })]
      }))
    }))
  });
}

function hr() {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 1 } },
    children: []
  });
}

function blockquote(text) {
  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: 360 },
    shading: { fill: "F0F7FF", type: ShadingType.CLEAR },
    children: [new TextRun({ text, size: 20, font: "Microsoft YaHei", italics: true, color: "2E75B6" })]
  });
}

function tip(text) {
  return new Paragraph({
    spacing: { after: 120, before: 120 },
    indent: { left: 360 },
    shading: { fill: "F5FFF0", type: ShadingType.CLEAR },
    children: [new TextRun({ text, size: 20, font: "Microsoft YaHei", color: "226622" })]
  });
}

const children = [];

// Title
children.push(new Paragraph({
  heading: HeadingLevel.TITLE,
  spacing: { after: 360 },
  children: [new TextRun({ text: "WorkBuddy 连接 QQ 邮箱的 3 个坑，和一套零明文落地方案", bold: true, size: 40, font: "Microsoft YaHei" })]
}));

// Subtitle
children.push(new Paragraph({
  spacing: { after: 480 },
  children: [new TextRun({ text: "你以为连上 MCP 连接器就万事大吉了？三个坑踩完，我们选择用 SKILL + 环境变量重建了整个邮路。", size: 24, font: "Microsoft YaHei", color: "666666" })]
}));

// Section 1
children.push(header("一、开场：不是连接不上，是连上了也不好用", 2));
children.push(p("WorkBuddy 左侧连接器面板里有个「QQ邮箱」。点一下，手机扫码，授权通过，状态变绿——qq-mail: connected。"));
children.push(p("看起来一切正常。而我想做的事情很简单：让 AI 帮我收发邮件。"));
children.push(p("发第一封，Ok。发第二封，Ok。发第三封——挂了。"));
children.push(p("不是网络问题，不是授权过期，是 MCP 连接器的两阶段发送机制在特定条件下会无征兆失败。概率？大概 50%。"));
children.push(p("如果你也是 WorkBuddy 用户，打算用 QQ 邮箱做自动化，这篇文章就是为你写的。"));

// Section 2
children.push(header("二、踩坑实录", 2));

// Pit 1
children.push(header("坑 1：MCP SendMessage 两阶段确认，第二阶段静默失败", 3));
children.push(table(2, [
  ["维度", "说明"],
  ["现象", "SendMessage 第一阶段（组装邮件）成功，返回 confirmation_token。用户确认后再调用，第二阶段无报错但邮件没发出去"],
  ["频率", "约 50% 失败率。不是每次，而是随机"],
  ["根因", "疑似 MCP 连接器在两阶段之间连接状态丢失（可能是进程回收或心跳超时），第二阶段 token 调用时连接已 unavailable"]
]));
children.push(p('最坑的是——它不报错。没有 500，没有超时提示，悄无声息地吞掉了你的邮件。你发完继续干活，三天后收件人来问\u201C那封邮件呢？\u201D'));

// Pit 2
children.push(header("坑 2：附件下载能力缺失", 3));
children.push(p("GetMessage 能拿到邮件正文，但 ListAttachments 之后没有对应的下载 API。附件只能看到文件名和大小，取不出来。"));
children.push(p("这个问题在 100 张发票端到端测试时致命——脚本能搜到发票邮件，能列出附件，就是没法下载 PDF 来提取数据。"));

// Pit 3
children.push(header("坑 3：连接器频繁 unavailable", 3));
children.push(table(2, [
  ["症状", "表现"],
  ["GetMe 返回 unavailable after recovery", "连接器显示绿色但功能不可用"],
  ["需重新授权", "关闭对话窗口 → 删除 .credentials.json → 重新扫码"]
]));
children.push(p("这不是偶发。从 6 月 10 日到 12 日之间，我们至少经历了 4 次连接器不可用，每次都中断了邮件工作流。"));

// Section 3
children.push(header("三、解决方案：放弃 MCP 连接器，上 SKILL", 2));

children.push(header('3.1 为什么不是\u201C修好 MCP\u201D', 3));
children.push(p("MCP 连接器的两阶段设计本身没问题，但它是平台侧的问题，我们改不了。等 WorkBuddy 团队修复？可以提 bug report，但不能等。"));
children.push(boldP("结论：绕过 MCP，直接走 IMAP/SMTP。"));

children.push(header("3.2 qq-email SKILL 的架构", 3));
children.push(p("用户自然语言 → AI 助手 → qq-email SKILL"));
children.push(code("  ├── scripts/send.js           (SMTP 发信)"));
children.push(code("  ├── scripts/receive.js         (IMAP 收信)"));
children.push(code("  ├── scripts/get-body.js        (获取邮件正文)"));
children.push(code("  └── scripts/get-attachments.js (下载附件)"));

children.push(table(4, [
  ["对比", "MCP 连接器", "qq-email SKILL", "差异"],
  ["底层协议", "平台托管", "Node.js + nodemailer/imap/mailparser", "脚本独立"],
  ["发送方式", "两阶段确认", "一次性 SMTP 直连", "无状态丢失"],
  ["失败率", "~50%", "目前测试零失败", "执行链路单一"],
  ["附件下载", "不支持", "get-attachments.js 直接下载到本地", "核心功能补齐"],
  ["稳定性", "依赖平台进程", "独立进程，不受连接器生命周期影响", "松耦合"]
]));

children.push(boldP("核心差异：SKILL 是独立脚本，不依赖平台连接器的生命周期。每次调用都是一个干净的 Node.js 进程，没有中间状态，没有 token 过期，没有静默失败。"));

// Section 4
children.push(header("四、安全加固：明文授权码的隐患", 2));

children.push(header("4.1 问题：授权码写在哪", 3));
children.push(p("SKILL 跑通了，但脚本每次执行前要 export 环境变量，授权码出现在命令行里，会被写入终端历史。"));
children.push(p("更需要注意的用法是——如果把凭证写进 MEMORY.md 或 SKILL.md 等会被 AI 读取的配置文件，这个文件在每次会话时作为上下文注入到 AI 模型中，意味着授权码经过了大模型 API 链路。"));
children.push(blockquote("⚠️ 注意：这不是 WorkBuddy 特有的问题。任何 AI 助手平台，只要把敏感信息写入会被模型读取的上下文文件，都会经过模型 API 链路。关键是要有正确的安全意识和做法。"));

children.push(table(2, [
  ["存储方式", "风险"],
  ["命令行 export", "终端历史明文记录"],
  ["写进 MEMORY.md 等配置文件", "作为上下文发送至模型 API 链路"],
  ["提交到代码仓库", "任何人拿到目录即可登录邮箱"]
]));

children.push(header("4.2 解决方案：系统环境变量", 3));
children.push(code("Win+R → sysdm.cpl → 高级 → 环境变量 → 用户变量 → 新建"));
children.push(code("  变量名: QQ_EMAIL_AUTH_CODE"));
children.push(code("  变量值: [你的授权码]"));

children.push(table(3, [
  ["维度", "之前", "之后"],
  ["存储位置", "文件明文", "系统环境变量"],
  ["对 AI 可见性", "可能注入上下文", "不可见"],
  ["跨会话", "需重新 export", "永久生效"],
  ["泄漏面", "文件 + 终端历史", "仅本机"]
]));

children.push(p("qq-email SKILL 的脚本本身就从 process.env 读取，环境变量配好后，调用方式从："));
children.push(code("export QQ_EMAIL_ACCOUNT=... && export QQ_EMAIL_AUTH_CODE=... && node send.js ..."));
children.push(p("变成："));
children.push(code("node send.js \"to@email.com\" \"主题\" \"正文\""));
children.push(boldP("零明文，零 extra step。"));

children.push(tip("💡 如何验证配置成功？配完后在终端跑一行：node -e \"console.log(process.env.QQ_EMAIL_ACCOUNT || '未配置')\"。输出你的邮箱地址就说明成功了。"));
children.push(tip("💡 备选方案：如果有多套邮箱环境（如测试/正式），可以用项目根目录的 .env 文件（配合 dotenv 包），方便切换。注意：.env 务必加入 .gitignore。"));
children.push(tip("💡 关于授权码本身：QQ邮箱的授权码本身就是最小权限设计——只能用于邮件客户端收发，不能登录网页端、不能改密码。即使授权码意外泄露，风险也是可控的。"));

// Section 5
children.push(header("五、工程总结：三层问题，三层解法", 2));

children.push(table(4, [
  ["层", "问题", "解法", "工程原则"],
  ["传输层", "MCP 连接器不稳定", "IMAP/SMTP 独立脚本", "不依赖不可控的中间件"],
  ["功能层", "附件无法下载", "mailparser 本地解析", "核心能力自己做，不交给平台"],
  ["安全层", "凭证明文泄露", "系统环境变量", "凭证不与代码/文档共存"]
]));

children.push(boldP("这个方案给 WorkBuddy 用户的价值："));
children.push(p("这篇不只是讲踩坑。如果你也需要在 WorkBuddy 上稳定收发 QQ 邮箱，可以直接用这套方案："));
children.push(bullet("安装 qq-email SKILL"));
children.push(bullet("配好两个系统环境变量"));
children.push(bullet("之后永远不需要为邮路操心"));

children.push(boldP('工程上最值钱的不是\u201C修好了\u201D，而是\u201C修完以后再也不会坏\u201D。'));

// Sources
children.push(hr());
children.push(boldP("用了什么外部资料："));
children.push(table(2, [
  ["资料", "链接"],
  ["qq-email SKILL（WorkBuddy 技能市场）", "本地路径 ~/.workbuddy/skills/qq-email/"],
  ["QQ邮箱 IMAP/SMTP 服务", "https://service.mail.qq.com/"]
]));

children.push(boldP("用了什么 SKILL："));
children.push(table(2, [
  ["SKILL", "作用"],
  ["wuhao-writer-吴昊风格工程文章", "提供工程文章写作框架（结构/金句/坑点指南/风格校准）"],
  ["qq-email", "本文的核心技术方案——IMAP/SMTP 收发邮件，附件下载，环境变量凭证管理"]
]));

// Build document
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Microsoft YaHei", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 280, after: 200 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:/Users/one/WorkBuddy/2026-06-10-02-23-42/WorkBuddy连接QQ邮箱的3个坑-工程文章.docx", buffer);
  console.log("DOCX created successfully");
});
