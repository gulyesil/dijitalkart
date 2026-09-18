export default function AboutSection({ heading, text }) {
  return (
    <section className="about">
      <h2>{heading}</h2>
      <p>{text}</p>
    </section>
  );
}
