import { Bug, BugStatus } from '../types/bug';

export interface BugLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'CREATED' | 'STATUS_CHANGE' | 'VERIFICATION' | 'REOPENED' | 'DEDUPE';
  title: string;
  description: string;
  actor: string;
  statusSnapshot?: BugStatus;
}

const STATUS_SEQUENCE: BugStatus[] = ['NEW', 'TRIAGED', 'IN_PROGRESS', 'FIXED', 'VERIFIED', 'CLOSED'];

function padOffset(createdAt: string, updatedAt: string, position: number, total: number) {
  const start = new Date(createdAt).getTime();
  const end = new Date(updatedAt).getTime();
  if (end <= start || total <= 1) {
    return createdAt;
  }

  const offset = Math.round(((end - start) / total) * position);
  return new Date(start + offset).toISOString();
}

function statusDetails(status: BugStatus, bug: Bug) {
  switch (status) {
    case 'TRIAGED':
      return {
        title: '缺陷已完成分诊',
        description: `系统根据 ${bug.platformId} 和优先级完成初步分诊。`,
        actor: 'Auto-Triage Bot',
      };
    case 'IN_PROGRESS':
      return {
        title: '研发开始处理',
        description: `${bug.assignee || '研发同学'} 已认领并开始处理该缺陷。`,
        actor: bug.assignee || 'Engineering',
      };
    case 'FIXED':
      return {
        title: '研发标记已修复',
        description: `${bug.assignee || '研发同学'} 已提交修复，等待验证闭环。`,
        actor: bug.assignee || 'Engineering',
      };
    case 'VERIFIED':
      return {
        title: '验证通过',
        description: `按照 ${bug.verificationMode || '既定'} 策略完成验证。`,
        actor: 'Verification Bot',
      };
    case 'CLOSED':
      return {
        title: '缺陷关闭',
        description: '修复与验证闭环完成，缺陷进入关闭状态。',
        actor: 'Bug Tracking System',
      };
    default:
      return {
        title: '状态更新',
        description: `状态更新为 ${status}。`,
        actor: bug.assignee || 'Bug Tracking System',
      };
  }
}

function buildContextMessages(bug: Bug) {
  const context = bug.platformContext as Record<string, unknown>;
  const messages: Array<Omit<BugLogEntry, 'id' | 'timestamp'>> = [];

  if (Array.isArray(context.runTrace)) {
    context.runTrace.forEach((trace, index) => {
      const node = trace as Record<string, unknown>;
      messages.push({
        level: node.status === 'failed' ? 'ERROR' : node.status === 'pending' ? 'WARN' : 'INFO',
        service: bug.platformId,
        message: `${node.node || `Node ${index + 1}`}: ${node.error || `${node.status} in ${node.durationMs}ms`}`,
      });
    });
  }

  const validationErrors = context.validationErrors;
  if (Array.isArray(validationErrors)) {
    validationErrors.forEach((error) => {
      messages.push({
        level: 'ERROR',
        service: bug.platformId,
        message: String(error),
      });
    });
  }

  ['ontologyIssue', 'errorLog', 'errorDetails'].forEach((field) => {
    if (typeof context[field] === 'string') {
      messages.push({
        level: 'ERROR',
        service: bug.platformId,
        message: context[field] as string,
      });
    }
  });

  if (typeof context.generatedUrl === 'string' && typeof context.expectedUrl === 'string') {
    messages.push({
      level: 'WARN',
      service: bug.platformId,
      message: `Generated URL mismatch. actual=${context.generatedUrl} expected=${context.expectedUrl}`,
    });
  }

  if (typeof context.payloadDiff === 'string') {
    messages.push({
      level: 'DEBUG',
      service: bug.platformId,
      message: `Payload diff snapshot: ${context.payloadDiff}`,
    });
  }

  return messages;
}

export function buildBugLogEntries(bug: Bug): BugLogEntry[] {
  const baseEntries: BugLogEntry[] = [
    {
      id: `${bug.bugId}-created`,
      timestamp: bug.createdAt,
      level: 'INFO',
      service: 'bug_tracking_system',
      message: `Created bug ${bug.bugId} for ${bug.platformId}: ${bug.title}`,
    },
  ];

  if (bug.assignee) {
    baseEntries.push({
      id: `${bug.bugId}-assignee`,
      timestamp: bug.updatedAt,
      level: 'INFO',
      service: 'bug_tracking_system',
      message: `${bug.assignee} is currently assigned to the issue.`,
    });
  }

  baseEntries.push({
    id: `${bug.bugId}-status`,
    timestamp: bug.updatedAt,
    level: bug.status === 'REOPENED' ? 'WARN' : bug.status === 'FIXED' || bug.status === 'VERIFIED' ? 'INFO' : 'DEBUG',
    service: 'bug_tracking_system',
    message: `Current status is ${bug.status}.`,
  });

  return [
    ...baseEntries,
    ...buildContextMessages(bug).map((entry, index) => ({
      ...entry,
      id: `${bug.bugId}-context-${index}`,
      timestamp: padOffset(bug.createdAt, bug.updatedAt, index + 1, 6),
    })),
  ].sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime());
}

export function buildBugTimelineEvents(bug: Bug): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${bug.bugId}-created`,
      timestamp: bug.createdAt,
      type: 'CREATED',
      title: '系统创建缺陷',
      description: `${bug.platformId} 首次上报异常并生成统一缺陷记录。`,
      actor: bug.reporter,
      statusSnapshot: 'NEW',
    },
  ];

  if ((bug.duplicateCount || 0) > 1) {
    events.push({
      id: `${bug.bugId}-dedupe`,
      timestamp: padOffset(bug.createdAt, bug.updatedAt, 1, 6),
      type: 'DEDUPE',
      title: '重复事件合并',
      description: `检测到 ${bug.duplicateCount} 次重复触发，合并到当前主缺陷。`,
      actor: 'Deduplication Engine',
    });
  }

  if (bug.assignee) {
    events.push({
      id: `${bug.bugId}-claimed`,
      timestamp: padOffset(bug.createdAt, bug.updatedAt, 2, 6),
      type: 'STATUS_CHANGE',
      title: '缺陷已认领',
      description: `${bug.assignee} 接手处理该问题。`,
      actor: bug.assignee,
      statusSnapshot: bug.status === 'NEW' ? 'NEW' : 'IN_PROGRESS',
    });
  }

  if (bug.status === 'REOPENED') {
    events.push({
      id: `${bug.bugId}-reopened`,
      timestamp: bug.updatedAt,
      type: 'REOPENED',
      title: '验证失败并重新打开',
      description: '验证链路未通过，缺陷重新回到待处理状态。',
      actor: 'Verification Bot',
      statusSnapshot: 'REOPENED',
    });
    return events;
  }

  const targetStatusIndex = STATUS_SEQUENCE.indexOf(bug.status);
  const statusMilestones = STATUS_SEQUENCE
    .slice(1, targetStatusIndex + 1)
    .filter((status) => !(status === 'IN_PROGRESS' && bug.assignee));

  statusMilestones.forEach((status, index, list) => {
    const detail = statusDetails(status, bug);
    events.push({
      id: `${bug.bugId}-${status.toLowerCase()}`,
      timestamp: index === list.length - 1 ? bug.updatedAt : padOffset(bug.createdAt, bug.updatedAt, index + 3, list.length + 3),
      type: status === 'VERIFIED' ? 'VERIFICATION' : 'STATUS_CHANGE',
      title: detail.title,
      description: detail.description,
      actor: detail.actor,
      statusSnapshot: status,
    });
  });

  return events.sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime());
}
