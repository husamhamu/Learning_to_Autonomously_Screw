import { extend, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

extend({ LineSegments2, LineSegmentsGeometry, LineMaterial });

const InteractiveLine = ({ edges, color, circleProperties }) => {
  const [hovered, setHovered] = useState(false);
  const lineRef = useRef();

  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.material.color.set(hovered ? 0xffff00 : color); // Change color on hover
    }
  });

  const handleClick = () => {
    console.log('Line clicked! Circle Properties:', circleProperties); // Print the circle properties
  };

  return (
    <lineSegments2
      ref={lineRef}
      geometry={new LineSegmentsGeometry().fromEdgesGeometry(edges)}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <lineMaterial attach="material" color={color} linewidth={5} />
    </lineSegments2>
  );
};

export default InteractiveLine;
