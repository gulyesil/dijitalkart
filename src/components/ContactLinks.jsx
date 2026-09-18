export default function ContactLinks({ links }) {
  return (
    <nav className="contact" aria-label="İletişim linkleri">
      {links.map(({ label, href, variant, Icon }) => (
        <a
          key={variant}
          className={`btn btn-${variant}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon />
          {label}
        </a>
      ))}
    </nav>
  );
}
