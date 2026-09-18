import ProfileCard from './components/ProfileCard.jsx';
import AboutSection from './components/AboutSection.jsx';

const profile = {
  initials: 'GY',
  name: 'Gül Yeşil',
  title: 'Operation Specialist',
  tagline: 'Şirketlerdeki data lojistik alanında operasyon süreçlerini yönetiyor.',
};

const about = {
  heading: 'Hakkımda',
  text: 'Gül Yeşil, şirketlerin data lojistik alanındaki operasyon süreçlerini uçtan uca yönetiyor. Veri akışının doğru ve zamanında ilerlemesini sağlamak, operasyonel süreçleri sistemli bir şekilde yürütmek işinin merkezinde yer alıyor. Detaylara verdiği önem ve sistematik yaklaşımıyla, karmaşık süreçleri sadeleştirip sürdürülebilir hale getirmeyi hedefliyor.',
};

export default function App() {
  return (
    <main className="card">
      <ProfileCard {...profile} />
      <hr className="divider" />
      <AboutSection {...about} />
    </main>
  );
}
