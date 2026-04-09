import { Bug, BugStatus, PlatformId } from '../types/bug';

const RESOLVED_STATUSES = new Set<BugStatus>(['FIXED', 'VERIFIED', 'CLOSED']);
const STATUS_COLORS: Record<string, string> = {
  NEW: '#8b5cf6',
  TRIAGED: '#6366f1',
  IN_PROGRESS: '#3b82f6',
  FIXED: '#10b981',
  VERIFIED: '#059669',
  CLOSED: '#6b7280',
  REOPENED: '#ef4444',
};

const PLATFORM_LABELS: Record<PlatformId, string> = {
  action_editor: 'Action Editor',
  dashboard: 'Dashboard',
  data_object_editor: 'Data Object Editor',
  event_editor: 'Event Editor',
  link_generator: 'Link Generator',
  ontology_test_system: 'Ontology Test System',
  rule_editor: 'Rule Editor',
};

function formatDayKey(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${month}-${day}`;
}

function utcDateOnly(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function calendarDayDiff(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = utcDateOnly(endDate) - utcDateOnly(startDate);
  return Math.max(0, diff / (24 * 60 * 60 * 1000));
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function getStartOfCurrentWeek(now: Date) {
  const normalized = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = normalized.getUTCDay();
  const mondayOffset = (day + 6) % 7;
  normalized.setUTCDate(normalized.getUTCDate() - mondayOffset);
  return normalized;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getIsoWeek(dateInput: string | Date) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : new Date(dateInput);
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { year: utcDate.getUTCFullYear(), week };
}

function formatWeekRange(year: number, week: number) {
  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const day = januaryFourth.getUTCDay() || 7;
  const monday = new Date(januaryFourth);
  monday.setUTCDate(januaryFourth.getUTCDate() - day + 1 + (week - 1) * 7);
  const sunday = addDays(monday, 6);
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });
  return `${formatter.format(monday)} - ${formatter.format(sunday)}, ${year}`;
}

export function buildInsightsMetrics(bugs: Bug[], now = new Date()) {
  const resolvedBugs = bugs.filter((bug) => RESOLVED_STATUSES.has(bug.status));
  const weekStart = getStartOfCurrentWeek(now).getTime();
  const resolvedThisWeek = resolvedBugs.filter((bug) => new Date(bug.updatedAt).getTime() >= weekStart).length;
  const totalResolutionDays = resolvedBugs.reduce((sum, bug) => sum + calendarDayDiff(bug.createdAt, bug.updatedAt), 0);

  return {
    totalBugs: bugs.length,
    highPriorityCount: bugs.filter((bug) => bug.priority === 'P0' || bug.priority === 'P1').length,
    averageResolutionDays: resolvedBugs.length ? roundToOneDecimal(totalResolutionDays / resolvedBugs.length) : 0,
    resolvedThisWeek,
  };
}

export function buildPlatformDistribution(bugs: Bug[]) {
  const counts = new Map<PlatformId, { bugs: number; p0: number; p1: number }>();
  bugs.forEach((bug) => {
    const current = counts.get(bug.platformId) || { bugs: 0, p0: 0, p1: 0 };
    current.bugs += 1;
    if (bug.priority === 'P0') current.p0 += 1;
    if (bug.priority === 'P1') current.p1 += 1;
    counts.set(bug.platformId, current);
  });

  return [...counts.entries()]
    .map(([platformId, values]) => ({
      name: PLATFORM_LABELS[platformId],
      platformId,
      ...values,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function buildTrendData(bugs: Bug[], now = new Date()) {
  const start = addDays(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())), -6);
  return Array.from({ length: 7 }, (_, index) => {
    const current = addDays(start, index);
    const dayKey = formatDayKey(current);
    return {
      date: dayKey,
      new: bugs.filter((bug) => formatDayKey(bug.createdAt) === dayKey).length,
      resolved: bugs.filter((bug) => RESOLVED_STATUSES.has(bug.status) && formatDayKey(bug.updatedAt) === dayKey).length,
    };
  });
}

export function buildStatusBreakdown(bugs: Bug[]) {
  const orderedStatuses: BugStatus[] = ['NEW', 'TRIAGED', 'IN_PROGRESS', 'FIXED', 'VERIFIED', 'CLOSED', 'REOPENED'];
  return orderedStatuses
    .map((status) => ({
      name: status,
      value: bugs.filter((bug) => bug.status === status).length,
      color: STATUS_COLORS[status],
    }))
    .filter((entry) => entry.value > 0);
}

export function buildPlatformRiskSummaries(bugs: Bug[]) {
  const total = bugs.length || 1;
  return buildPlatformDistribution(bugs)
    .map((platform) => ({
      ...platform,
      percentage: Math.round((platform.bugs / total) * 100),
      riskScore: platform.p0 * 2 + platform.p1,
    }))
    .sort((left, right) => {
      if (right.riskScore !== left.riskScore) {
        return right.riskScore - left.riskScore;
      }
      return right.bugs - left.bugs;
    })
    .slice(0, 3);
}

export function buildRiskNote(bugs: Bug[]) {
  const topRisk = buildPlatformRiskSummaries(bugs)[0];
  if (!topRisk) {
    return '当前还没有可用缺陷数据，暂时无法生成平台风险提示。';
  }

  if (topRisk.riskScore > 0) {
    return `${topRisk.name} 当前拥有最多的高优缺陷（P0 ${topRisk.p0} / P1 ${topRisk.p1}），建议优先安排排查与验证。`;
  }

  return `${topRisk.name} 当前缺陷数量最多，占总缺陷约 ${topRisk.percentage}%，建议优先关注该平台的稳定性趋势。`;
}

export interface ArchiveEntry {
  id: string;
  title: string;
  platform: string;
  assignee: string;
  status: 'FIXED' | 'VERIFIED' | 'CLOSED';
  summary: string;
}

export interface ArchiveGroup {
  version: string;
  date: string;
  bugs: ArchiveEntry[];
}

export function buildArchiveGroups(bugs: Bug[]): ArchiveGroup[] {
  const groups = new Map<string, ArchiveGroup>();

  bugs
    .filter((bug): bug is Bug & { status: 'FIXED' | 'VERIFIED' | 'CLOSED' } => RESOLVED_STATUSES.has(bug.status))
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .forEach((bug) => {
      const { year, week } = getIsoWeek(bug.updatedAt);
      const key = `${year}-${String(week).padStart(2, '0')}`;
      const group = groups.get(key) || {
        version: `${year} Week ${week}`,
        date: formatWeekRange(year, week),
        bugs: [],
      };

      group.bugs.push({
        id: bug.bugId,
        title: bug.title,
        platform: bug.platformId,
        assignee: bug.assignee || '未分配',
        status: bug.status,
        summary: bug.description?.trim() || '缺少详细修复摘要，当前以缺陷描述与状态信息作为归档摘要。',
      });

      groups.set(key, group);
    });

  return [...groups.entries()]
    .sort((left, right) => right[0].localeCompare(left[0]))
    .map(([, group]) => group);
}
