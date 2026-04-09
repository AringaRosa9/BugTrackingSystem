import seedBugs from '../data/mockBugs.json';
import { Bug } from '../types/bug';

export interface IngestBugPayload {
  platformId: Bug['platformId'];
  errorType?: string;
  contextData?: Record<string, unknown>;
  title: string;
  description?: string;
  priority?: Bug['priority'];
  reporter?: string;
}

export interface BugUpdatePayload {
  status?: Bug['status'];
  assignee?: string;
  priority?: Bug['priority'];
  title?: string;
  description?: string;
}

function sortBugs(bugs: Bug[]) {
  return [...bugs].sort((left, right) => {
    const updatedDelta = new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    if (updatedDelta !== 0) {
      return updatedDelta;
    }

    return right.bugId.localeCompare(left.bugId);
  });
}

function inferSourceEntityId(contextData?: Record<string, unknown>) {
  const candidateKeys = ['actionId', 'ruleId', 'schemaId', 'eventId', 'templateId', 'runId'];
  for (const key of candidateKeys) {
    if (typeof contextData?.[key] === 'string') {
      return String(contextData[key]);
    }
  }
  return 'auto-report';
}

function inferSourceEntityType(platformId: Bug['platformId']) {
  switch (platformId) {
    case 'action_editor':
      return 'action';
    case 'rule_editor':
      return 'rule';
    case 'data_object_editor':
      return 'schema';
    case 'event_editor':
      return 'event_trigger';
    case 'link_generator':
      return 'link_template';
    case 'ontology_test_system':
      return 'run';
    default:
      return 'system';
  }
}

function inferSourceUrl(platformId: Bug['platformId'], sourceEntityId: string) {
  switch (platformId) {
    case 'action_editor':
      return `/actions/${sourceEntityId}`;
    case 'rule_editor':
      return `/rules/${sourceEntityId}`;
    case 'data_object_editor':
      return `/data-objects/${sourceEntityId}`;
    case 'event_editor':
      return `/events/${sourceEntityId}`;
    case 'link_generator':
      return `/links/${sourceEntityId}`;
    case 'ontology_test_system':
      return `/ontology/runs/${sourceEntityId}`;
    default:
      return undefined;
  }
}

export function createBugStore(
  initialBugs: Bug[],
  getNow: () => string = () => new Date().toISOString(),
  getIdValue: () => number = () => Date.now(),
) {
  let bugs = sortBugs(initialBugs);

  return {
    listBugs() {
      return sortBugs(bugs);
    },
    ingestBug(payload: IngestBugPayload) {
      const timestamp = getNow();
      const sourceEntityId = inferSourceEntityId(payload.contextData);
      const bug: Bug = {
        bugId: `BUG-AUTO-${getIdValue()}`,
        title: payload.title || `[Auto] ${payload.errorType || 'Platform Error'} from ${payload.platformId}`,
        description: payload.description || `Automatically reported error of type ${payload.errorType || 'unknown'}.`,
        status: 'NEW',
        priority: payload.priority || 'P2',
        platformId: payload.platformId,
        sourceEntityType: inferSourceEntityType(payload.platformId),
        sourceEntityId,
        sourceUrl: inferSourceUrl(payload.platformId, sourceEntityId),
        reporter: payload.reporter || 'system',
        createdAt: timestamp,
        updatedAt: timestamp,
        dedupeKey: `hash_${payload.platformId}_${sourceEntityId}`,
        duplicateCount: 1,
        platformContext: payload.contextData || {},
      };

      bugs = sortBugs([bug, ...bugs]);
      return bug;
    },
    updateBug(bugId: string, patch: BugUpdatePayload) {
      const bug = bugs.find((entry) => entry.bugId === bugId);
      if (!bug) {
        return null;
      }

      const updatedBug: Bug = {
        ...bug,
        ...patch,
        updatedAt: getNow(),
      };

      bugs = sortBugs(bugs.map((entry) => (entry.bugId === bugId ? updatedBug : entry)));
      return updatedBug;
    },
  };
}

export const bugStore = createBugStore(seedBugs as Bug[]);
