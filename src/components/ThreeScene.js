import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as THREE from 'three';
import {
  filterCircularEdges,
  groupCircularEdges,
  estimateCircleProperties,
  calculateCircleNormal,
  detectCoaxialCircles
} from '../utils/threeUtils';

extend({ OrbitControls });

const Controls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update());
  return <orbitControls ref={controlsRef} args={[camera, gl.domElement]} enableDamping dampingFactor={0.05} />;
};

const Scene = ({ font }) => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const loader = new ThreeMFLoader();
    loader.load('./model/03.3mf', (object) => {
      processLoadedModel(object);
    });

    const processLoadedModel = (object) => {
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffa500, 0x800080, 0xffc0cb];
      const meshes = [];
      object.traverse((child) => {
        if (child.isMesh) meshes.push(child);
      });

      const modelGroup = new THREE.Group();
      const circlePropertiesList = [];
      let circleCounter = 1;

      meshes.forEach((mesh) => {
        const edges = new THREE.EdgesGeometry(mesh.geometry, 45);
        const circularEdges = filterCircularEdges(edges);
        const edgeGroups = groupCircularEdges(circularEdges);

        edgeGroups.forEach((group, i) => {
          const color = colors[i % colors.length];
          const text = circleCounter.toString();

          const wideEdges = new LineSegmentsGeometry().fromEdgesGeometry(group);
          const edgeMaterial = new LineMaterial({ color: color, linewidth: 5 });
          const line = new LineSegments2(wideEdges, edgeMaterial);
          mesh.add(line);

          const properties = estimateCircleProperties(group, text);
          const normal = calculateCircleNormal(group);
          properties.normal = normal;
          circlePropertiesList.push(properties);

          const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
          const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.copy(properties.center);
          modelGroup.add(sphere);

          circleCounter++;
        });
      });

      object.add(modelGroup);
      sceneRef.current.add(object);

      detectCoaxialCircles(circlePropertiesList, sceneRef.current, createTextMesh);
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
        bevelSegments: 3
      });
      textGeometry.center();

      const textMaterial = new THREE.MeshBasicMaterial({ color: color });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.copy(position);

      return textMesh;
    };
  }, [font]);

  return <group ref={sceneRef} />;
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
      <Controls />
      {font && <Scene font={font} />}
    </Canvas>
  );
};

export default AutoScrew;
