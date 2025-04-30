import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import React, { useEffect, useRef, useState } from 'react';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { filterCircularEdges, groupCircularEdges, estimateCircleProperties, detectCoaxialCircles, calculateCircleNormal } from '../utils/threeUtils';
import InteractiveLine from './InteractiveLine';
import InteractiveSphere from './InteractiveSphere';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const Scene = ({ font }) => {
  const sceneRef = useRef(null);
  const [circles, setCircles] = useState([]);
  const [meshes, setMeshes] = useState([]); // State to store the meshes

  useEffect(() => {
    // const loader = new ThreeMFLoader();
    const loader = new OBJLoader();
    loader.load('./model/04.obj', (object) => {
      processLoadedModel(object);
    });

    const processLoadedModel = (object) => {
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffa500, 0x800080, 0xffc0cb];
      const loadedMeshes = [];
      const circlesData = [];
      let circleCounter = 1;

      object.traverse((child) => {
        if (child.isMesh) loadedMeshes.push(child); // Collect all meshes
      });

      loadedMeshes.forEach((mesh) => {
        const edges = new THREE.EdgesGeometry(mesh.geometry, 45);
        const circularEdges = filterCircularEdges(edges);
        const edgeGroups = groupCircularEdges(circularEdges);

        edgeGroups.forEach((group, i) => {
          const color = colors[i % colors.length];
          const properties = estimateCircleProperties(group, circleCounter.toString());
          const normal = calculateCircleNormal(group);
          properties.normal = normal;

          circlesData.push({
            id: circleCounter,
            group,
            color,
            center: properties.center,
            properties, // Store the circle properties
          });

          circleCounter++;
        });
      });

      // Store the processed meshes and circles data
      setMeshes(loadedMeshes);
      setCircles(circlesData);

      detectCoaxialCircles(
        circlesData.map((circle) => ({
          ...circle,
          normal: circle.normal,
        })),
        sceneRef.current,
        createTextMesh
      );
    };

    const createTextMesh = (text, color, size, position) => {
      if (!font) return;

      const textGeometry = new TextGeometry(text, {
        font: font,
        size: size,
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 3,
      });
      textGeometry.center();

      const textMaterial = new THREE.MeshBasicMaterial({ color: color });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.copy(position);

      return textMesh;
    };
  }, [font]);

  return (
    <group ref={sceneRef}>
      Render the original meshes
      {meshes.map((mesh, index) => (
        <primitive key={index} object={mesh} />
      ))}

      {/* Render interactive components for each circle */}
      {circles.map(({ id, group, color, center, properties }) => (
        <React.Fragment key={id}>
          <InteractiveLine edges={group} color={color} circleProperties={properties} />
          <InteractiveSphere position={center} color={color} circleProperties={properties} />
        </React.Fragment>
      ))}
    </group>
  );
};


const AutoScrew = () => {
  const [font, setFont] = useState(null);

  useEffect(() => {
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
      setFont(loadedFont);
    });
  }, []);

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [2, 2, 5], fov: 45 }}>
      <ambientLight intensity={0.2} />
      <axesHelper args={[100]} />
      <OrbitControls />
      {font && <Scene font={font} />}
    </Canvas>
  );
};
// .gltf
export default AutoScrew;
