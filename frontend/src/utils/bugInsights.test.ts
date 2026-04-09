import assert from 'node:assert/strict';
import test from 'node:test';

import type { Bug } from '../types/bug';
import {
  buildArchiveGroups,
  buildInsightsMetrics,
  buildPlatformDistribution,
  buildStatusBreakdown,
  buildTrendData,
} from './bugInsights';

const bugs: Bug[] = [
  {
    bugId: 'BUG-1',
    title: 'Ontology failure',
    status: 'NEW',
    priority: 'P0',
    platformId: 'ontology_test_system',
    sourceEntityType: 'run',
    sourceEntityId: 'run-1',
    reporter: 'system',
    createdAt: '2026-03-31T01:00:00.000Z',
    updatedAt: '2026-03-31T02:00:00.000Z',
    platformContext: {},
  },
  {
    bugId: 'BUG-2',
    title: 'Rule save failed',
    status: 'IN_PROGRESS',
    priority: 'P1',
    platformId: 'rule_editor',
    sourceEntityType: 'rule',
    sourceEntityId: 'rule-2',
    reporter: 'ops',
    createdAt: '2026-03-30T03:00:00.000Z',
    updatedAt: '2026-03-31T04:00:00.000Z',
    assignee: 'dev_sarah',
    platformContext: {},
  },
  {
    bugId: 'BUG-3',
    title: 'Action fixed',
    description: 'Fixed the missing payload field.',
    status: 'FIXED',
    priority: 'P2',
    platformId: 'action_editor',
    sourceEntityType: 'action',
    sourceEntityId: 'act-3',
    reporter: 'ops',
    createdAt: '2026-03-27T03:00:00.000Z',
    updatedAt: '2026-03-31T05:00:00.000Z',
    assignee: 'dev_john',
    platformContext: {},
  },
  {
    bugId: 'BUG-4',
    title: 'Archive me',
    status: 'CLOSED',
    priority: 'P3',
    platformId: 'link_generator',
    sourceEntityType: 'link',
    sourceEntityId: 'link-4',
    reporter: 'marketing',
    createdAt: '2026-03-24T08:00:00.000Z',
    updatedAt: '2026-03-25T09:00:00.000Z',
    assignee: 'dev_alex',
    platformContext: {},
  },
];

test('buildInsightsMetrics derives total, high priority, mttr, and resolved-this-week', () => {
  const metrics = buildInsightsMetrics(bugs, new Date('2026-03-31T12:00:00.000Z'));

  assert.equal(metrics.totalBugs, 4);
  assert.equal(metrics.highPriorityCount, 2);
  assert.equal(metrics.resolvedThisWeek, 1);
  assert.equal(metrics.averageResolutionDays, 2.5);
});

test('buildPlatformDistribution groups counts and severity by platform', () => {
  const platformData = buildPlatformDistribution(bugs);

  assert.deepEqual(platformData, [
    { name: 'Action Editor', platformId: 'action_editor', bugs: 1, p0: 0, p1: 0 },
    { name: 'Link Generator', platformId: 'link_generator', bugs: 1, p0: 0, p1: 0 },
    { name: 'Ontology Test System', platformId: 'ontology_test_system', bugs: 1, p0: 1, p1: 0 },
    { name: 'Rule Editor', platformId: 'rule_editor', bugs: 1, p0: 0, p1: 1 },
  ]);
});

test('buildTrendData returns the last 7 days of created and resolved counts', () => {
  const trendData = buildTrendData(bugs, new Date('2026-03-31T12:00:00.000Z'));

  assert.deepEqual(trendData, [
    { date: '03-25', new: 0, resolved: 1 },
    { date: '03-26', new: 0, resolved: 0 },
    { date: '03-27', new: 1, resolved: 0 },
    { date: '03-28', new: 0, resolved: 0 },
    { date: '03-29', new: 0, resolved: 0 },
    { date: '03-30', new: 1, resolved: 0 },
    { date: '03-31', new: 1, resolved: 1 },
  ]);
});

test('buildStatusBreakdown returns counts for active statuses only', () => {
  const statusData = buildStatusBreakdown(bugs);

  assert.deepEqual(statusData, [
    { name: 'NEW', value: 1, color: '#8b5cf6' },
    { name: 'IN_PROGRESS', value: 1, color: '#3b82f6' },
    { name: 'FIXED', value: 1, color: '#10b981' },
    { name: 'CLOSED', value: 1, color: '#6b7280' },
  ]);
});

test('buildArchiveGroups keeps resolved bugs and groups them by calendar week', () => {
  const groups = buildArchiveGroups(bugs);

  assert.equal(groups.length, 2);
  assert.equal(groups[0]?.version, '2026 Week 14');
  assert.equal(groups[0]?.bugs[0]?.id, 'BUG-3');
  assert.equal(groups[1]?.version, '2026 Week 13');
  assert.equal(groups[1]?.bugs[0]?.id, 'BUG-4');
  assert.equal(groups[1]?.bugs[0]?.summary, '缺少详细修复摘要，当前以缺陷描述与状态信息作为归档摘要。');
});
