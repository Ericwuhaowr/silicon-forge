# SKILL Schema 规范 V1.3

# SKILL Schema 规范 V1.3

版本： V1.3（正式版）发布日期： 2026-06-14状态： ✅ 已封版

---

## 1. 概述

SKILL Schema 是定义一个 SKILL 元数据的标准格式，用于 SKILL 的注册、发现、评估和迁移。

---

## 2. 核心字段（14个）

| 字段名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| name | string | ✅ | SKILL 英文标识符 |
| display_name | string | ✅ | 显示名称（中文） |
| description | string | ✅ | 功能描述 |
| version | string | ✅ | 语义化版本号 |
| author | string | ✅ | 作者 |
| category | string | ✅ | 分类 |
| tags | array | ✅ | 标签 |
| motto | string | ✅ | 认知口诀（10字以内） |
| required_capabilities | array | ✅ | 依赖的能力接口 |
| platform_specific | object | ✅ | 平台特定配置 |
| inputs | object | ✅ | 输入参数定义 |
| outputs | object | ✅ | 输出定义 |
| anti_patterns | array | ✅ | 反模式 |
| red_flags | array | ✅ | 危险信号 |

---

## 3. 设计原则

### 3.1 透明降级原则

降级可以，但必须透明。禁止隐形降级 —— SKILL的能力边界必须清晰告知用户。

### 3.2 能力抽象原则

调用能力接口而非具体平台工具，实现跨平台可移植。

### 3.3 质量三环

- 内环：Schema 规范性
- 中环：健康评分（结构59分 + 效果35分 + 反例黑名单6分）
- 外环：实际运行验证

---

## 4. 附录A：模块化系统提示词模板

### 5个核心模块（必填）

1. **身份定义** — SKILL的角色定位与核心能力
2. **能力边界** — 能做什么、不能做什么、适用场景
3. **核心原则** — 执行任务时必须遵守的规则
4. **工作流程** — 标准执行步骤与关键决策点
5. **输出规范** — 输出格式、质量标准、Artifact判定

### 设计原则

- 模块化组合，可按需扩展
- 每个模块职责单一，边界清晰
- 支持不同Effort档位的动态调整

---

## 5. 迁移指南

从 V1.2 升级到 V1.3 需要补充：

- motto 字段
- required_capabilities 字段
- platform_specific 字段
- anti_patterns 从推荐必填升级为强制必填
- red_flags 从推荐必填升级为强制必填

完整迁移步骤见《SKILL迁移指南 V1.0》

---

最后更新：2026-06-14 | 版本V1.3正式版

