---
type: flowchar
style: blueprint
palette: neon
---

# 图1：MCP连接器执行链路图 — §2.1位置

## ASPECT
16:9 横向比例

## ZONES
LEFT-ZONE: 标签"Phase 1" | 蓝色(#00d2ff) | SendMessage API调用 → confirmation_token返回
MIDDLE-ZONE: 标签"用户确认" | 橙色(#f78166) | 用户点击确认按钮 → 间隔数秒到数分钟
RIGHT-ZONE: 标签"Phase 2 ⚠️" | 红色(#ff4444) | 再次调用SendMessage(token) → 连接器进程已被回收 → 静默失败
BOTTOM-ZONE: 警报横幅"失败率约50% — 无报错/无超时/无日志"

## LABELS
- "Phase 1: 返回token" 
- "用户确认发送"
- "连接器unavailable"
- "静默失败"
- "50% 失败率 | 零报错"

## COLORS
bg: #0a0e1a (深色底)
line: #00d2ff (蓝图线)
danger: #f78166/#ff4444 (警告色)
text: #ffffff (白色标签)

## STYLE
engineering-blueprint style: 深色网格背景、蓝色细线、霓虹高光节点。从左到右的三阶段流程，断裂点用红色叉号标注。科技工程感，精确清晰。不做模糊抽象。

## DO
- 三个阶段清晰分离
- 断裂点显眼
- 中文文字可读
- 每个节点有编号

## DON'T
- 不要模糊抽象的插画风
- 不要渐变背景
- 不要过度装饰元素
- 不要英文为主
