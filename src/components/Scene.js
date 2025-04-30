import React, { useEffect, useRef, useState } from 'react';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { filterCircularEdges, groupCircularEdges, estimateCircleProperties, detectCoaxialCircles, calculateCircleNormal } from '../utils/threeUtils';
import InteractiveLine from './InteractiveLine';
import InteractiveSphere from './InteractiveSphere';

export const Scene = ({ font }) => {
  const sceneRef = useRef(null);
  const [circles, setCircles] = useState([]);
  const [meshes, setMeshes] = useState([]); // State to store the meshes

  useEffect(() => {
    const loader = new ThreeMFLoader();
    loader.load('./model/03.3mf', (object) => {
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
      {/* Render the original meshes
      {meshes.map((mesh, index) => (
        <primitive key={index} object={mesh} />
      ))} */}

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

