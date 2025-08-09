import React from 'react';
import { Link } from 'react-router-dom';

const storyProgress: Array<{ id: string; title: string; status: 'Done' | 'Ready for Review' | 'In Progress' | 'Approved' }> = [
  { id: '1.1', title: 'Story 1.1', status: 'Done' },
  { id: '1.2', title: 'Story 1.2', status: 'Done' },
  { id: '1.3', title: 'Story 1.3', status: 'Done' },
  { id: '1.4', title: 'Story 1.4', status: 'Done' },
  { id: '1.5', title: 'Story 1.5', status: 'Done' },
  { id: '2.1', title: 'Story 2.1', status: 'Done' },
  { id: '2.2', title: 'Story 2.2', status: 'Done' },
  { id: '2.3', title: 'Story 2.3', status: 'Done' },
  { id: '2.4', title: 'Story 2.4', status: 'Done' },
  { id: '2.5', title: 'Story 2.5', status: 'Ready for Review' },
];

const statusColor: Record<string, string> = {
  'Done': 'bg-green-600',
  'Ready for Review': 'bg-yellow-600',
  'In Progress': 'bg-blue-600',
  'Approved': 'bg-purple-600',
};

const ProgressPage: React.FC = () => {
  const completed = storyProgress.filter(s => s.status === 'Done').length;
  const total = storyProgress.length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Story Progress (1.1 → 2.5)</h1>
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">Back to Dashboard</Link>
      </div>

      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-1">Overall</div>
        <div className="w-full bg-muted rounded h-3 overflow-hidden">
          <div
            className="h-3 bg-green-600"
            style={{ width: `${Math.round((completed / total) * 100)}%` }}
          />
        </div>
        <div className="mt-1 text-sm">{completed} of {total} done</div>
      </div>

      <ul className="space-y-2">
        {storyProgress.map((story) => (
          <li key={story.id} className="flex items-center justify-between p-3 border border-border rounded">
            <div className="font-medium">{story.title}</div>
            <span className={`text-white text-xs px-2 py-1 rounded ${statusColor[story.status]}`}>{story.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressPage;


