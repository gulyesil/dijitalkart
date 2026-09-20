export default function ContactLinks({ links }) {
  return (
    <nav className="social-icons" aria-label="İletişim linkleri">
      {links.map(({ label, href, variant, Icon }) => (
        <a
          key={variant}
          className={`icon-btn icon-btn-${variant}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
        >
          <Icon />
        </a>
      ))}
    </nav>
  );
}
