import assert from 'node:assert/strict';
import test from 'node:test';

import type { Bug } from '../types/bug';
import { buildBugLogEntries, buildBugTimelineEvents } from './bugEvidence';

const bug: Bug = {
  bugId: 'BUG-2026-007',
  title: '发送 Offer 邮件 Action 缺少模板参数',
  description: '模板变量缺失导致发送失败。',
  status: 'FIXED',
  priority: 'P1',
  platformId: 'action_editor',
  sourceEntityType: 'action_definition',
  sourceEntityId: 'act_send_offer_email',
  reporter: 'hr_ops_team',
  assignee: 'dev_john',
  createdAt: '2026-03-31T09:20:00.000Z',
  updatedAt: '2026-03-31T16:00:00.000Z',
  duplicateCount: 3,
  dedupeKey: 'hash_action_editor_offer',
  verificationMode: 'platform_auto_test',
  platformContext: {
    actionId: 'act_send_offer_email',
    validationErrors: ['Missing required variables [candidate_name, start_date]'],
    payloadDiff: '{ "template": "offer" }',
  },
};

test('buildBugLogEntries turns platform context into readable log lines', () => {
  const logs = buildBugLogEntries(bug);

  assert.ok(logs.some((entry) => entry.message.includes('Missing required variables')));
  assert.ok(logs.some((entry) => entry.service === 'action_editor'));
});

test('buildBugTimelineEvents includes created, dedupe, claim, and fixed milestones', () => {
  const events = buildBugTimelineEvents(bug);

  assert.deepEqual(
    events.map((event) => event.type),
    ['CREATED', 'DEDUPE', 'STATUS_CHANGE', 'STATUS_CHANGE', 'STATUS_CHANGE'],
  );
  assert.equal(events.at(-1)?.statusSnapshot, 'FIXED');
});
