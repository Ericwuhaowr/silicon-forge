# SKILL元数据Schema V0.1（初稿）

> 适用平台：扣子 + WorkBuddy 双平台
> 设计原则：最少够用、易于扩展、跨平台兼容
> 状态：初稿，待评审

---

## 一、设计目标

1. **统一描述语言**：双平台描述SKILL用同一套字段，降低沟通成本
2. **支撑健康检查**：health-check脚本直接基于Schema字段做静态检查
3. **支撑能力矩阵**：自动生成SKILL清单和能力地图
4. **支撑搜索发现**：通过标签和分类快速定位SKILL
5. **便于版本管理**：清晰的版本号和变更记录

---

## 二、字段定义

### 2.1 基础信息（必选）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `name` | string | SKILL英文标识，小写+连字符 | `invoice-master` |
| `version` | string | 语义化版本号（主.次.修订） | `3.0.0` |
| `display_name` | string | 中文显示名称 | `发票管理大师` |
| `description` | string | 一句话描述（不超过50字） | `自动识别、归类、管理邮箱中的发票附件` |
| `author` | string | 作者/负责人 | `马斯克` / `德米斯` / `三方共建` |
| `platform` | string[] | 支持的平台 | `["coze", "workbuddy"]` 或 `["coze"]` |
| `created_date` | string | 创建日期（YYYY-MM-DD） | `2026-05-15` |
| `updated_date` | string | 最后更新日期（YYYY-MM-DD） | `2026-06-10` |

### 2.2 分类与标签（必选）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `category` | string | 一级分类 | `效率工具` / `内容创作` / `质量保障` / `学习研究` |
| `tags` | string[] | 标签数组，用于搜索和分类 | `["发票", "财务", "邮箱", "OCR"]` |
| `maturity` | string | 成熟度等级 | `alpha` / `beta` / `stable` / `deprecated` |

成熟度定义：
- `alpha`：开发中，功能不完整，仅供内部测试
- `beta`：功能基本完整，可能有Bug，可小范围试用
- `stable`：稳定版，经过充分测试，可正式使用
- `deprecated`：已废弃，不建议使用，有替代方案

### 2.3 功能描述（必选）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `full_description` | string | 详细功能描述（100-300字） | 支持PDF/XML/图片等多种格式发票... |
| `key_features` | string[] | 核心功能点列表（3-8条） | `["自动识别发票信息", "增值税核算", "重复发票检测"]` |
| `use_cases` | string[] | 适用场景 | `["中小企业财务管理", "个人报销整理", "发票批量处理"]` |

### 2.4 依赖关系（可选）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `dependencies` | object[] | 依赖的其他SKILL | 见下方 |
| `plugins` | string[] | 依赖的平台插件/连接器 | `["email-imap", "ocr", "excel"]` |
| `external_tools` | string[] | 依赖的外部工具/API | `["腾讯云OCR", "金税系统"]` |

dependencies 子字段：
- `name`：依赖的SKILL名称
- `version`：版本要求（如 `>=1.2.0`）
- `is_required`：是否必需（true/false）

### 2.5 质量与状态（可选，用于health-check）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `test_coverage` | string | 测试覆盖率（大概值即可） | `80%` / `未测试` |
| `gotchas_count` | number | gotchas坑点数量 | `5` |
| `review_status` | string | 评审状态 | `未评审` / `技术评审通过` / `终审通过` |
| `last_review_date` | string | 最后评审日期 | `2026-06-08` |
| `known_issues` | string[] | 已知问题列表 | `["超大PDF处理较慢", "部分旧版发票识别不准"]` |

### 2.6 使用说明（可选）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `quick_start` | string | 快速开始说明 | `在插件中启用后，发送邮件到...` |
| `config_items` | object[] | 配置项说明 | 见下方 |
| `notes` | string[] | 注意事项 | `["首次使用需要配置邮箱授权码"]` |

config_items 子字段：
- `name`：配置项名称
- `description`：说明
- `is_required`：是否必填
- `default_value`：默认值

### 2.7 扩展字段（保留）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `coze_specific` | object | 扣子平台特有字段 |
| `workbuddy_specific` | object | WorkBuddy平台特有字段 |
| `custom` | object | 自定义扩展字段 |

---

## 三、完整示例

```yaml
name: invoice-master
version: 3.0.0
display_name: 发票管理大师
description: 自动识别、归类、管理邮箱中的发票附件，支持增值税核算
author: 三方共建
platform: ["coze", "workbuddy"]
created_date: 2026-05-15
updated_date: 2026-06-10

category: 效率工具
tags: ["发票", "财务", "邮箱", "OCR", "增值税"]
maturity: beta

full_description: |
  支持PDF/XML/图片等多种格式发票的自动识别和信息提取，
  可连接邮箱自动收取发票，智能去重和分类，支持进销项增值税核算。
  数据本地处理，保障财务数据安全。

key_features:
  - 多格式发票识别（PDF/XML/JPG/PNG）
  - 邮箱自动收取（支持IMAP协议）
  - 智能去重（基于发票号码+金额双重校验）
  - 增值税简易核算（销项-进项=应缴）
  - 批量导出Excel
  - 数据本地存储，安全可靠

use_cases:
  - 中小企业发票管理
  - 个人报销发票整理
  - 财务月度发票核对

dependencies:
  - name: email-helper
    version: ">=1.0.0"
    is_required: true
  - name: excel-exporter
    version: ">=2.1.0"
    is_required: false

plugins:
  - email-imap
  - ocr-tencent
  - excel

external_tools:
  - 腾讯云OCR API

test_coverage: 70%
gotchas_count: 5
review_status: 技术评审通过
last_review_date: 2026-06-08
known_issues:
  - 超大PDF（>20MB）处理较慢
  - 部分手写发票识别准确率较低

quick_start: |
  1. 启用SKILL
  2. 配置邮箱IMAP信息（地址、端口、授权码）
   3. 设置发票文件夹名称
  4. 运行"收取发票"命令开始使用

config_items:
  - name: imap_host
    description: IMAP服务器地址
    is_required: true
  - name: imap_port
    description: IMAP端口
    is_required: true
    default_value: 993
  - name: email_account
    description: 邮箱账号
    is_required: true

notes:
  - 首次使用需要配置邮箱授权码（不是登录密码）
  - 建议创建专门的发票收件邮箱，避免干扰正常邮件
  - 增值税核算仅供参考，正式报税请以财务系统为准
```

---

## 四、health-check 可检查的基础项

基于Schema，health-check脚本可以自动检查：

### 必选字段完整性
- [ ] name 是否存在且格式正确
- [ ] version 是否符合语义化版本规范
- [ ] display_name 是否为空
- [ ] description 是否在50字以内
- [ ] platform 是否有值
- [ ] category 和 tags 是否有值
- [ ] maturity 是否为合法值

### 质量与状态检查
- [ ] 版本号是否与实际文件一致
- [ ] updated_date 是否在合理范围内（比如3个月内有更新）
- [ ] 是否有已知问题未记录
- [ ] gotchas数量是否为0（可能意味着坑点没被记录）

### 依赖检查
- [ ] 依赖的SKILL是否存在
- [ ] 依赖版本是否兼容
- [ ] 插件是否在平台可用列表中

---

## 五、待讨论的问题

1. **存储格式**：用YAML还是Markdown frontmatter？
   - YAML：结构清晰，适合机器处理
   - Markdown frontmatter：人读友好，和SKILL文档在一起
   - 建议：SKILL文件用Markdown frontmatter，单独的元数据文件用YAML

2. **字段粒度**：现在的字段是偏粗还是偏细？
   - 太粗：信息不够，支撑不了后续应用
   - 太细：维护成本高，大家懒得填
   - 原则：先从最少够用开始，后续根据需要加

3. **哪些是必选哪些是可选？**
   - 现在的必选字段是不是太多了？
   - 有没有可以移到可选的？
   - 有没有漏掉的必选字段？

4. **分类体系**：一级分类用 `效率工具 / 内容创作 / 质量保障 / 学习研究` 这四个够吗？
   - 是不是需要二级分类？
   - 还是全靠tags来细分？

---

## 六、下一步计划

1. 评审通过后，确定V1.0版本
2. 双方同步更新现有SKILL的元数据
3. health-check脚本基于Schema开发
4. 能力矩阵自动生成工具开发
