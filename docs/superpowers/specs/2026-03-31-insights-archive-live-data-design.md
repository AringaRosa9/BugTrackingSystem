# Insights And Archive Live Data Design

## Goal

让 `Insights` 与 `Resolution Archive` 两个页面直接消费前端已有的实时 `bugs` 数据源，不再依赖各自的静态 mock 数据。

## Scope

- `InsightsPage` 的顶部指标、平台分布、7 天趋势、状态分布、风险提示全部由实时 `bugs` 聚合得到
- `ResolutionArchive` 仅展示当前状态为 `FIXED`、`VERIFIED`、`CLOSED` 的缺陷，并按自然周分组
- `Archive` 的“进入归档时间”先使用当前 bug 的 `updatedAt` 近似

## Architecture

- `App` 继续维护唯一的 `bugs` 状态，并把它传给 `InsightsPage` 与 `ResolutionArchive`
- 新增前端聚合工具，统一计算：
  - 总缺陷、P0/P1、MTTR 近似值、本周已解决
  - 平台分布
  - 7 天新增/解决趋势
  - 状态分布
  - 已解决缺陷的周归档分组
- 页面层只负责渲染，不在组件内部重复写统计逻辑

## Data Rules

- “已解决”状态定义为 `FIXED | VERIFIED | CLOSED`
- “活跃状态”保留现有 `NEW | TRIAGED | IN_PROGRESS | FIXED | REOPENED`
- MTTR 近似为已解决缺陷的 `updatedAt - createdAt` 平均值
- 风险提示改为基于真实平台高优缺陷数和平台占比生成
- 归档分组使用 ISO week 风格的 `YYYY Week NN`

## Testing

- 新增聚合函数测试，覆盖：
  - 平台分布统计
  - 7 天趋势统计
  - 已解决归档分组
  - MTTR 近似值与空数据退化行为

## Notes

- 当前工作区不是 git 仓库，所以这次无法按技能要求提交 spec/plan commit
