import ProfileCard from './components/ProfileCard.jsx';

const profile = {
  initials: 'GY',
  name: 'Gül Yeşil',
  title: 'Operation Specialist',
  tagline: 'Şirketlerdeki data lojistik alanında operasyon süreçlerini yönetiyor.',
};

export default function App() {
  return (
    <main className="card">
      <ProfileCard {...profile} />
    </main>
  );
}
