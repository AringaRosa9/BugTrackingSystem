import assert from 'node:assert/strict';
import test from 'node:test';

import type { Bug } from '../types/bug';
import { createBugStore } from './bugStore';

const seedBugs: Bug[] = [
  {
    bugId: 'BUG-2',
    title: 'Older bug',
    status: 'NEW',
    priority: 'P2',
    platformId: 'rule_editor',
    sourceEntityType: 'rule',
    sourceEntityId: 'rule-2',
    reporter: 'system',
    createdAt: '2026-03-29T10:00:00.000Z',
    updatedAt: '2026-03-29T10:00:00.000Z',
    platformContext: {},
  },
  {
    bugId: 'BUG-1',
    title: 'Newest bug',
    status: 'IN_PROGRESS',
    priority: 'P1',
    platformId: 'action_editor',
    sourceEntityType: 'action',
    sourceEntityId: 'action-1',
    reporter: 'system',
    createdAt: '2026-03-30T10:00:00.000Z',
    updatedAt: '2026-03-30T11:00:00.000Z',
    platformContext: {},
  },
];

test('createBugStore lists bugs sorted by updatedAt descending', () => {
  const store = createBugStore(seedBugs, () => '2026-03-31T09:00:00.000Z', () => 9001);

  const listed = store.listBugs();

  assert.equal(listed[0]?.bugId, 'BUG-1');
  assert.equal(listed[1]?.bugId, 'BUG-2');
});

test('createBugStore ingests a bug with defaults and returns it at the top of the list', () => {
  const store = createBugStore(seedBugs, () => '2026-03-31T09:00:00.000Z', () => 9001);

  const created = store.ingestBug({
    platformId: 'action_editor',
    errorType: 'ACTION_PUBLISH_FAILED',
    title: 'Failed to publish action',
    contextData: {
      actionId: 'act-123',
      validationErrors: ['Missing recipient'],
    },
    reporter: 'system_bot',
  });

  const listed = store.listBugs();

  assert.equal(created.bugId, 'BUG-AUTO-9001');
  assert.equal(created.status, 'NEW');
  assert.equal(created.sourceEntityId, 'act-123');
  assert.equal(listed[0]?.bugId, created.bugId);
});

test('createBugStore updates status and assignee while refreshing updatedAt', () => {
  const store = createBugStore(seedBugs, () => '2026-03-31T12:00:00.000Z', () => 9001);

  const updated = store.updateBug('BUG-2', {
    status: 'IN_PROGRESS',
    assignee: 'dev_john',
  });

  assert.ok(updated);
  assert.equal(updated?.status, 'IN_PROGRESS');
  assert.equal(updated?.assignee, 'dev_john');
  assert.equal(updated?.updatedAt, '2026-03-31T12:00:00.000Z');
  assert.equal(store.listBugs()[0]?.bugId, 'BUG-2');
});
