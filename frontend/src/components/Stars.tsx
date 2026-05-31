const stars = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 10 + 10,
  delay: Math.random() * 10,
}));

export default function Stars() {
  return (
    <>
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  );
}