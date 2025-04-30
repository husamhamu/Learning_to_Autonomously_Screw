// src/components/ThreeScene.js

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import {
  filterCircularEdges,
  groupCircularEdges,
  estimateCircleProperties,
  calculateCircleNormal,
  detectCoaxialCircles
} from '../utils/threeUtils';

const ThreeScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const [font, setFont] = useState(null);

  useEffect(() => {
    const initScene = () => {
      sceneRef.current = new THREE.Scene();
      sceneRef.current.background = new THREE.Color(0xffffff);
      sceneRef.current.add(new THREE.AmbientLight(0xffffff, 0.2));
      const axesHelper = new THREE.AxesHelper(100);
      sceneRef.current.add(axesHelper);
    };

    const initCamera = () => {
      cameraRef.current = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cameraRef.current.position.set(2, 2, 5);
      cameraRef.current.lookAt(0, 0, 0);
    };

    const initRenderer = () => {
      rendererRef.current = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.setClearColor(0x000000, 0);
      mountRef.current.appendChild(rendererRef.current.domElement);
    };

    const initControls = () => {
      controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.05;
      controlsRef.current.target.set(100, 65, 20);
      controlsRef.current.update();
    };

    const loadFont = () => {
      const fontLoader = new FontLoader();
      fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
        setFont(loadedFont);
      });
    };

    const loadModel = () => {
      const loader = new ThreeMFLoader();
      loader.load('./model/03.3mf', (object) => {
        processLoadedModel(object);
      });
    };

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
      
        modelGroup.add(object);
        modelGroup.position.set(0, 0, 0);
        sceneRef.current.add(modelGroup);
      
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

    const onWindowResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    initScene();
    initCamera();
    initRenderer();
    initControls();
    loadFont();
    loadModel();

    window.addEventListener('resize', onWindowResize);
    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ThreeScene;