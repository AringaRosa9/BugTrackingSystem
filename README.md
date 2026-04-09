# Bug Tracking System

用于统一接收和跟踪 HRO 招聘自动化平台各子系统缺陷的 demo，目前已经拆分为独立的 `frontend/` 与 `backend/` 两个应用。

## Structure

- `frontend/`: React + Vite 的缺陷工作台、列表、详情、配置页
- `backend/`: Express API，负责 bug 数据初始化、ingest、查询与状态更新
- `docs/superpowers/plans/`: 本次重构与打通数据链路的实施计划

## Run Locally

前置条件：Node.js 20+

1. 在仓库根目录安装依赖  
   `npm install`
2. 启动后端 API  
   `npm run dev:backend`
3. 另开一个终端启动前端  
   `npm run dev:frontend`
4. 打开前端开发地址  
   [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Available Commands

- `npm run dev:backend`: 启动后端，默认监听 `http://127.0.0.1:3001`
- `npm run dev:frontend`: 启动前端，默认监听 `http://127.0.0.1:3000`
- `npm run lint`: 运行前后端 TypeScript 检查
- `npm run test`: 运行前后端核心行为测试
- `npm run build`: 构建前端产物

## API Notes

- `GET /api/health`: 健康检查
- `GET /api/bugs`: 返回当前 bug 列表
- `POST /api/bugs/ingest`: 接收外部平台 bug 上报
- `PATCH /api/bugs/:bugId`: 更新缺陷状态、责任人等字段

`POST /api/bugs/ingest` 目前仍是 demo 级鉴权，只要求 `Authorization: Bearer hro_*` 前缀。

## Demo Limitations

- 数据仍然是进程内内存存储，重启后端会恢复到 `backend/src/data/mockBugs.json`
- `Insights` 和 `Archive` 页面仍以演示数据为主，还没有完全接入实时 API
- 验证闭环弹窗仍是模拟执行，但现在会正确重置状态并更新主列表
