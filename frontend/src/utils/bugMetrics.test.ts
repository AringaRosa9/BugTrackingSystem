import assert from 'node:assert/strict';
import test from 'node:test';

import type { Bug } from '../types/bug';
import { buildDashboardMetrics, getDashboardRecentBugs } from './bugMetrics';

const bugs: Bug[] = [
  {
    bugId: 'BUG-RECENT-P0',
    title: 'Critical recent issue',
    status: 'NEW',
    priority: 'P0',
    platformId: 'rule_editor',
    sourceEntityType: 'rule',
    sourceEntityId: 'rule-1',
    reporter: 'ops',
    assignee: 'dev_john',
    createdAt: '2026-03-31T01:00:00.000Z',
    updatedAt: '2026-03-31T03:00:00.000Z',
    platformContext: {},
  },
  {
    bugId: 'BUG-RECENT-P2',
    title: 'Recent medium issue',
    status: 'TRIAGED',
    priority: 'P2',
    platformId: 'action_editor',
    sourceEntityType: 'action',
    sourceEntityId: 'action-1',
    reporter: 'ops',
    assignee: 'dev_john',
    createdAt: '2026-03-31T02:00:00.000Z',
    updatedAt: '2026-03-31T02:30:00.000Z',
    platformContext: {},
  },
  {
    bugId: 'BUG-OLD-P1',
    title: 'Older high priority issue',
    status: 'IN_PROGRESS',
    priority: 'P1',
    platformId: 'ontology_test_system',
    sourceEntityType: 'run',
    sourceEntityId: 'run-1',
    reporter: 'system',
    createdAt: '2026-03-29T02:00:00.000Z',
    updatedAt: '2026-03-29T04:00:00.000Z',
    platformContext: {},
  },
  {
    bugId: 'BUG-CLOSED',
    title: 'Closed issue',
    status: 'CLOSED',
    priority: 'P3',
    platformId: 'link_generator',
    sourceEntityType: 'link',
    sourceEntityId: 'link-1',
    reporter: 'system',
    assignee: 'dev_john',
    createdAt: '2026-03-31T05:00:00.000Z',
    updatedAt: '2026-03-31T05:10:00.000Z',
    platformContext: {},
  },
];

test('buildDashboardMetrics derives counts from live bugs', () => {
  const metrics = buildDashboardMetrics(bugs, 'dev_john', new Date('2026-03-31T12:00:00.000Z'));

  assert.deepEqual(metrics, {
    myOpenCount: 2,
    highPriorityCount: 2,
    todayNewCount: 3,
  });
});

test('getDashboardRecentBugs prioritizes recent bugs before older ones', () => {
  const recent = getDashboardRecentBugs(bugs, new Date('2026-03-31T12:00:00.000Z'), 3);

  assert.deepEqual(
    recent.map((bug) => bug.bugId),
    ['BUG-RECENT-P0', 'BUG-RECENT-P2', 'BUG-CLOSED'],
  );
});
