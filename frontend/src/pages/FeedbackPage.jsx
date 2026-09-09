import DashboardShell from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/common';
import PendingFeedbackList from '@/features/feedback/PendingFeedbackList';
import FeedbackHistory from '@/features/feedback/FeedbackHistory';

export default function FeedbackPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Feedback"
        subtitle="Share how you're feeling after each Panchakarma session."
      />
      <div className="space-y-4">
        <PendingFeedbackList />
        <FeedbackHistory />
      </div>
    </DashboardShell>
  );
}
