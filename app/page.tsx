import Navbar from './components/Navbar';
import IncidentPlayer from './components/IncidentPlayer';
import IncidentList from './components/IncidentList';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-1 p-4 gap-4">
        <section className="flex-1">
          <IncidentPlayer />
        </section>
        <aside className="w-[400px]">
          <IncidentList />
        </aside>
      </main>
    </div>
  );
} 