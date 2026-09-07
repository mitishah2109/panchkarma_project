import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * App frame for authenticated pages: fixed Navbar on top, Sidebar on the left,
 * scrollable content area. Wrap route-level pages in this.
 */
export default function DashboardShell({ children }) {
  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
