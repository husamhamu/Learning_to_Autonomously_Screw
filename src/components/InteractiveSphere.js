import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

const InteractiveSphere = ({ position, color, circleProperties }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const sphereRef = useRef();

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.scale.set(clicked ? 1.2 : 1, clicked ? 1.2 : 1, clicked ? 1.2 : 1);
    }
  });

  const handleClick = () => {
    setClicked(!clicked);
    console.log('Sphere clicked! Circle Properties:', circleProperties); // Print the circle properties
  };

  return (
    <mesh
      ref={sphereRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={hovered ? 0xff0000 : color} />
    </mesh>
  );
};

export default InteractiveSphere;
