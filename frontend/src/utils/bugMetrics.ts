import { Bug, BugStatus } from '../types/bug';

const HIGH_PRIORITY = new Set(['P0', 'P1']);
const ACTIVE_ASSIGNMENT_STATUSES = new Set<BugStatus>(['NEW', 'TRIAGED', 'IN_PROGRESS', 'FIXED', 'REOPENED']);
const MILLIS_IN_DAY = 24 * 60 * 60 * 1000;

function priorityRank(priority: Bug['priority']) {
  switch (priority) {
    case 'P0':
      return 0;
    case 'P1':
      return 1;
    case 'P2':
      return 2;
    default:
      return 3;
  }
}

function parseTime(value: string) {
  return new Date(value).getTime();
}

function isWithinLastDay(timestamp: string, now: Date) {
  return now.getTime() - parseTime(timestamp) <= MILLIS_IN_DAY;
}

export function buildDashboardMetrics(bugs: Bug[], currentUser: string, now = new Date()) {
  return {
    myOpenCount: bugs.filter((bug) => bug.assignee === currentUser && ACTIVE_ASSIGNMENT_STATUSES.has(bug.status)).length,
    highPriorityCount: bugs.filter((bug) => HIGH_PRIORITY.has(bug.priority)).length,
    todayNewCount: bugs.filter((bug) => {
      const created = new Date(bug.createdAt);
      return created.getUTCFullYear() === now.getUTCFullYear()
        && created.getUTCMonth() === now.getUTCMonth()
        && created.getUTCDate() === now.getUTCDate();
    }).length,
  };
}

export function getDashboardRecentBugs(bugs: Bug[], now = new Date(), limit = 3) {
  return [...bugs]
    .sort((left, right) => {
      const leftRecent = isWithinLastDay(left.updatedAt, now) ? 0 : 1;
      const rightRecent = isWithinLastDay(right.updatedAt, now) ? 0 : 1;
      if (leftRecent !== rightRecent) {
        return leftRecent - rightRecent;
      }

      const priorityDelta = priorityRank(left.priority) - priorityRank(right.priority);
      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return parseTime(right.updatedAt) - parseTime(left.updatedAt);
    })
    .slice(0, limit);
}
