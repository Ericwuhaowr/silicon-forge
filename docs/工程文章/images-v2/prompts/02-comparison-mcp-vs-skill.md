---
type: comparison
style: blueprint
palette: neon
---

# 图2：MCP连接器 vs qq-email SKILL 架构对比 — §3.2位置

## ASPECT
16:9 横向比例，左右对称双栏

## ZONES
LEFT-PANEL 标签"MCP连接器 (旧方案)":
- 平台托管进程
- SendMessage(两阶段) → Phase1组装 → Phase2投递(token)
- 依赖平台进程生命周期 → 绿色状态但实际不可用
- 附件: ❌ 无下载API
- 结论: "静默失败约50%"

RIGHT-PANEL 标签"qq-email SKILL (新方案)":
- 独立Node.js进程
- SMTP直连(一次性)→ send.js → 即时投递
- 不受平台生命周期影响 → 进程独立自管理
- 附件: ✅ get-attachments.js 直接下载
- 结论: "零失败"

MIDDLE-DIVIDER: 双栏之间用对比箭头连接，标注"从异步到同步""从托管到独立"

## LABELS
- "MCP连接器" "qq-email SKILL"
- "两阶段异步" "一次性同步"
- "静默失败~50%" "零失败"
- "附件❌" "附件✅"

## COLORS
bg: #0d1117
left-bg: #1a1025 (微红底表示旧方案风险)
right-bg: #0a1a2e (微蓝底表示新方案)
line: #00d2ff
danger-marker: #f78166
success-marker: #3fb950

## STYLE
engineering-blueprint对比图。左右对称双栏，中间分隔线。每栏内容从上到下分层清晰：技术栈→执行方式→结论。对比元素的差异用颜色区分（旧=暖色，新=冷色）。精确、工程化、一目了然。

## DO
- 左右对称，视觉一目了然
- 关键差异用颜色标注
- 结论突出显示
- 中文技术术语准确

## DON'T
- 不要左右不对称
- 不要模糊的"好/坏"判断，用具体数据
- 不要过度动画效果
- 不要装饰性图标
