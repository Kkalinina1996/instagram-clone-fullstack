const Explore = () => {
  const posts = [
    "http://localhost:3333/uploads/Link-2.png",
    "http://localhost:3333/uploads/Link-3.png",
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px"
    }}>
      {posts.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="post"
          style={{ width: "100%" }}
        />
      ))}
    </div>
  );
};

export default Explore;