import ProfileCard from './components/ProfileCard.jsx';
import AboutSection from './components/AboutSection.jsx';
import ContactLinks from './components/ContactLinks.jsx';
import CardActions from './components/CardActions.jsx';
import { LinkedinIcon, GithubIcon } from './components/icons.jsx';

const profile = {
  initials: 'GY',
  name: 'Gül Yeşil',
  title: 'Operation Specialist',
  tagline: 'Şirketlerdeki data lojistik alanında operasyon süreçlerini yönetiyor.',
  phone: '+90 541 239 95 05',
  email: 'gulyesil.500@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/g%C3%BCl-ye%C5%9Fil/',
  githubUrl: 'https://github.com/gulyesil',
};

const about = {
  heading: 'Hakkımda',
  text: 'Gül Yeşil, şirketlerin data lojistik alanındaki operasyon süreçlerini uçtan uca yönetiyor. Veri akışının doğru ve zamanında ilerlemesini sağlamak, operasyonel süreçleri sistemli bir şekilde yürütmek işinin merkezinde yer alıyor. Detaylara verdiği önem ve sistematik yaklaşımıyla, karmaşık süreçleri sadeleştirip sürdürülebilir hale getirmeyi hedefliyor.',
};

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/g%C3%BCl-ye%C5%9Fil/', variant: 'linkedin', Icon: LinkedinIcon },
  { label: 'GitHub', href: 'https://github.com/gulyesil', variant: 'github', Icon: GithubIcon },
];

export default function App() {
  return (
    <main className="card">
      <ProfileCard {...profile} />
      <hr className="divider" />
      <AboutSection {...about} />
      <CardActions profile={profile} />
      <ContactLinks links={links} />
    </main>
  );
}
