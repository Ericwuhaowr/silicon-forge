# Addy Osmani agent-skills项目深度分析

> 原文：《这个 58k Star 的项目，把 AI 编程从"会写代码"，推到了"像高级工程师一样交付"》
> 来源：https://mp.weixin.qq.com/s/ei6XIdl5E9UT6beSHfAe-A

---

## 项目概要

- 作者：Addy Osmani，Google总监
- Stars：58,000+
- 仓库：github.com/addyosmani/agent-skills
- 核心理念：Done ≠ Verified —— 代码写完不等于软件可交付

## 三层架构

| 层 | 职责 |
|------|------|
| Personas | 谁来判断（code-reviewer/security-auditor/test-engineer） |
| Skills | 怎么执行（24个技能模块） |
| Commands | 何时触发（/spec /plan /build /test /review /code-simplify /ship） |

## 7个Slash Command流水线

/spec → /plan → /build → /test → /review → /code-simplify → /ship

其中 `/ship` 命令触发三个Persona并行检查后综合出go/no-go判断。

## 每个Skill的标准五段结构

- When to use
- Process
- Verification
- Common rationalizations（AI可能找的借口）
- Red flags

## Common Rationalizations示例

| AI借口 | 工程回应 |
|---------|---------|
| "这个改动太小了，不需要测试" | 无论多小，测试不能跳过 |
| "先上线，后面再补文档" | 文档和代码同步交付 |
| "用户应该不会走到这个边界" | 边界情况必须明确处理 |

## 跨工具兼容

Skills本质是Markdown文件，兼容Claude Code/Cursor/Gemini CLI/Windsurf/OpenCode/GitHub Copilot/Kiro/Codex。

## 三类适用人群

1. 已在用AI编码的开发者——最大痛点不是AI不会写代码，而是写完不敢放心合并
2. 技术负责人和架构师——可改造为团队工程规范
3. AI服务者——代表"AI编程从生成代码进入工程治理"的趋势
