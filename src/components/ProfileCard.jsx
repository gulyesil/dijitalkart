export default function ProfileCard({ initials, name, title, tagline }) {
  return (
    <>
      <div className="avatar" aria-hidden="true">{initials}</div>
      <h1>{name}</h1>
      <p className="title" lang="en">{title}</p>
      <p className="tagline">{tagline}</p>
    </>
  );
}
