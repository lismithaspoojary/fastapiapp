import { useState } from "react";

function Welcome() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div className="card" style={{ textAlign: 'center', maxWidth: '300px' }}>
      <h2 style={{ margin: '0 0 var(--space-md) 0', color: 'var(--primary-700)' }}>
        Counter: {count}
      </h2>
      <button onClick={increment} className="btn btn-primary">
        Increment
      </button>
    </div>
  );
}

export default Welcome;