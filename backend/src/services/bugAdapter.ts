import { Bug, ActionEditorContext } from '../types/bug';

// 1. 适配器接口定义 (Adapter Pattern)
export interface PlatformAdapter<RawEvent> {
  accepts(event: any): boolean;
  transform(event: RawEvent): Bug;
}

// 2. 模拟 Action Editor 发出的非标准原始事件
export interface ActionEditorRawEvent {
  type: 'ACTION_PUBLISH_FAILED';
  action_id: string;
  errors: string[];
  diff_snapshot?: string;
  triggered_by: string;
  timestamp: string;
}

// 3. Action Editor 专属适配器实现
export class ActionEditorAdapter implements PlatformAdapter<ActionEditorRawEvent> {
  accepts(event: any): boolean {
    return event?.type === 'ACTION_PUBLISH_FAILED';
  }

  transform(event: ActionEditorRawEvent): Bug {
    return {
      bugId: `BUG-AUTO-${Date.now()}`,
      title: `[Auto] Action Publish Failed: ${event.action_id}`,
      status: 'NEW',
      priority: 'P1', // 默认发布失败为 P1
      platformId: 'action_editor',
      sourceEntityType: 'action',
      sourceEntityId: event.action_id,
      sourceUrl: `/actions/${event.action_id}`,
      reporter: event.triggered_by,
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
      platformContext: {
        actionId: event.action_id,
        validationErrors: event.errors,
        payloadDiff: event.diff_snapshot,
      } as ActionEditorContext
    };
  }
}

// 4. 统一缺陷服务 (Bug Tracking Service 底座)
export class BugTrackingService {
  private adapters: PlatformAdapter<any>[] = [];

  // 注册各平台适配器
  registerAdapter(adapter: PlatformAdapter<any>) {
    this.adapters.push(adapter);
  }

  // 统一接收事件并转化为标准 Bug
  ingestEvent(rawEvent: any): Bug | null {
    const adapter = this.adapters.find(a => a.accepts(rawEvent));
    if (!adapter) {
      console.warn('No adapter found for event', rawEvent);
      return null;
    }

    const standardBug = adapter.transform(rawEvent);
    this.saveBug(standardBug);
    return standardBug;
  }

  private saveBug(bug: Bug) {
    // 实际业务中这里会存入 DB，此处仅作演示打印
    console.log(`[BugTrackingService] Successfully ingested and saved bug: ${bug.bugId}`);
  }
}
