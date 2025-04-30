import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
const colors = [
    0xff0000, 0x00ff00, 0x0000ff,
    0xffff00, 0xffa500, 0x800080, 0xffc0cb
  ];
const ModelLoader = () => {
  const { scene } = useThree();
  const [model, setModel] = useState(null);
        const colors = [
          0xff0000, 0x00ff00, 0x0000ff,
          0xffff00, 0xffa500, 0x800080, 0xffc0cb
        ];
  useEffect(() => {
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
      const loader = new ThreeMFLoader();
      loader.load('./model/01.3mf', (object) => {
        const colors = [
          0xff0000, 0x00ff00, 0x0000ff,
          0xffff00, 0xffa500, 0x800080, 0xffc0cb
        ];

        const meshes = [];
        object.traverse((child) => {
          if (child.isMesh) meshes.push(child);
        });

        const modelGroup = new THREE.Group();
        const circlePropertiesList = [];
        let circleCounter = 1;

        for (let mesh of meshes) {
          const edges = new THREE.EdgesGeometry(mesh.geometry, 45);
          const circularEdges = filterCircularEdges(edges);
          const edgeGroups = groupCircularEdges(circularEdges);

          for (let i = 0; i < edgeGroups.length; i++) {
            const group = edgeGroups[i];
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
          }
        }

        modelGroup.add(object);
        modelGroup.position.set(0, 0, 0);
        setModel(modelGroup);

        detectCoaxialCircles(circlePropertiesList, loadedFont, scene);
      });
    });
  }, [scene]);

  return model ? <primitive object={model} /> : null;
};

export default ModelLoader;

// Helper functions (place these inside the same file or import them from a separate module)
function filterCircularEdges(edges) {
  const filteredEdges = [];
  const edgePairs = [];

  for (let i = 0; i < edges.attributes.position.array.length; i += 6) {
    const v1 = new THREE.Vector3(
      edges.attributes.position.array[i],
      edges.attributes.position.array[i + 1],
      edges.attributes.position.array[i + 2]
    );
    const v2 = new THREE.Vector3(
      edges.attributes.position.array[i + 3],
      edges.attributes.position.array[i + 4],
      edges.attributes.position.array[i + 5]
    );

    const edgeVector = v2.clone().sub(v1);
    const edgeLength = edgeVector.length();
    const edgeDirection = edgeVector.normalize();

    if (isCircularEdge(v1, v2, edgeLength, edgeDirection)) {
      edgePairs.push({ start: v1, end: v2 });
    }
  }

  const closedLoops = findClosedLoops(edgePairs);
  for (let loop of closedLoops) {
    const properties = estimateCirclePropertiesLoop(loop);
    if (isWithinTolerance(loop, properties.center, properties.radius, 1)) {
      for (let edge of loop) {
        filteredEdges.push(edge.start.x, edge.start.y, edge.start.z);
        filteredEdges.push(edge.end.x, edge.end.y, edge.end.z);
      }
    }
  }

  const filteredEdgesGeometry = new THREE.BufferGeometry();
  filteredEdgesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(filteredEdges, 3));

  return filteredEdgesGeometry;
}

function groupCircularEdges(edges) {
  const groupedEdges = [];
  const visited = new Set();

  function getEdge(index) {
    return [
      new THREE.Vector3(
        edges.attributes.position.array[index],
        edges.attributes.position.array[index + 1],
        edges.attributes.position.array[index + 2]
      ),
      new THREE.Vector3(
        edges.attributes.position.array[index + 3],
        edges.attributes.position.array[index + 4],
        edges.attributes.position.array[index + 5]
      )
    ];
  }

  for (let i = 0; i < edges.attributes.position.array.length; i += 6) {
    if (visited.has(i)) continue;

    const stack = [i];
    const group = [];
    visited.add(i);

    while (stack.length > 0) {
      const currentIndex = stack.pop();
      const [v1, v2] = getEdge(currentIndex);
      group.push(currentIndex);

      for (let j = 0; j < edges.attributes.position.array.length; j += 6) {
        if (visited.has(j)) continue;

        const [v3, v4] = getEdge(j);
        if (v1.equals(v3) || v1.equals(v4) || v2.equals(v3) || v2.equals(v4)) {
          stack.push(j);
          visited.add(j);
        }
      }
    }

    const filteredEdges = [];
    for (const index of group) {
      const [v1, v2] = getEdge(index);
      filteredEdges.push(v1.x, v1.y, v1.z);
      filteredEdges.push(v2.x, v2.y, v2.z);
    }

    const filteredEdgesGeometry = new THREE.BufferGeometry();
    filteredEdgesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(filteredEdges, 3));
    groupedEdges.push(filteredEdgesGeometry);
  }

  return groupedEdges;
}

function estimateCircleProperties(edgesGeometry, number) {
  const positions = edgesGeometry.attributes.position.array;
  const points = [];

  for (let i = 0; i < positions.length; i += 3) {
    points.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
  }

  let center = new THREE.Vector3();
  let radius = 0;

  if (points.length >= 3) {
    const centroid = new THREE.Vector3();
    for (const p of points) {
      centroid.add(p);
    }
    centroid.divideScalar(points.length);

    let totalDistance = 0;
    for (const p of points) {
      totalDistance += centroid.distanceTo(p);
    }
    radius = totalDistance / points.length;
    center = centroid;
  }

  return { center, radius, number };
}

function calculateCircleNormal(edgesGeometry) {
  const positions = edgesGeometry.attributes.position.array;
  const points = [];

  for (let i = 0; i < positions.length; i += 3) {
    points.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
  }

  if (points.length >= 3) {
    const vector1 = points[1].clone().sub(points[0]);
    const vector2 = points[2].clone().sub(points[0]);

    const normal = new THREE.Vector3();
    normal.crossVectors(vector1, vector2).normalize();

    return normal;
  } else {
    console.error('Not enough points to compute circle normal.');
    return new THREE.Vector3(0, 0, 1);
  }
}

function detectCoaxialCircles(circlePropertiesList, font, scene) {
  const tolerance = 0.01;
  const processedCircles = new Set();
  const groupedCircles = {};

  for (let i = 0; i < circlePropertiesList.length; i++) {
    const circle1 = circlePropertiesList[i];
    if (processedCircles.has(circle1.number)) continue;

    const group = [circle1];
    processedCircles.add(circle1.number);

    for (let j = i + 1; j < circlePropertiesList.length; j++) {
      const circle2 = circlePropertiesList[j];
      if (processedCircles.has(circle2.number)) continue;

      const distance = circle1.center.distanceTo(circle2.center);
      const angle = circle1.normal.angleTo(circle2.normal);

      if (distance <= tolerance && Math.abs(angle) <= tolerance) {
        group.push(circle2);
        processedCircles.add(circle2.number);
      }
    }

    groupedCircles[i] = group;
  }

  for (const [index, group] of Object.entries(groupedCircles)) {
    const color = colors[index % colors.length];
    const material = new THREE.LineBasicMaterial({ color: color });

    for (const circle of group) {
      const geometry = new THREE.SphereGeometry(circle.radius, 32, 32);
      const circleMesh = new THREE.Mesh(geometry, material);
      circleMesh.position.copy(circle.center);

      const textGeometry = new TextGeometry(circle.number.toString(), { font: font, size: 0.1, height: 0.01 });
      const textMaterial = new THREE.MeshBasicMaterial({ color: color });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.copy(circle.center.clone().add(new THREE.Vector3(0, 0, 0.1)));

      scene.add(circleMesh);
      scene.add(textMesh);
    }
  }
}

function isCircularEdge(v1, v2, edgeLength, edgeDirection) {
  const tolerance = 0.01;
  const idealAngle = Math.PI;

  const angle = Math.abs(edgeDirection.angleTo(new THREE.Vector3(1, 0, 0)) - idealAngle);

  return Math.abs(angle) <= tolerance;
}

function findClosedLoops(edgePairs) {
  const loops = [];
  const visited = new Set();

  function dfs(node, path) {
    visited.add(node);

    const neighbors = edgePairs.filter(pair => pair.start.equals(node) || pair.end.equals(node));
    for (let neighbor of neighbors) {
      const nextNode = neighbor.start.equals(node) ? neighbor.end : neighbor.start;

      if (visited.has(nextNode)) {
        if (nextNode.equals(path[0])) {
          loops.push([...path, nextNode]);
        }
      } else {
        dfs(nextNode, [...path, nextNode]);
      }
    }
  }

  for (let edge of edgePairs) {
    if (!visited.has(edge.start)) {
      dfs(edge.start, [edge.start]);
    }
    if (!visited.has(edge.end)) {
      dfs(edge.end, [edge.end]);
    }
  }

  return loops;
}

function estimateCirclePropertiesLoop(loop) {
  const center = new THREE.Vector3();
  const points = loop.map(edge => edge.start);

  for (let point of points) {
    center.add(point);
  }

  center.divideScalar(points.length);

  let radius = 0;
  for (let point of points) {
    radius += center.distanceTo(point);
  }

  radius /= points.length;

  return { center, radius };
}

function isWithinTolerance(loop, center, radius, tolerance) {
  for (let edge of loop) {
    const distance = edge.start.distanceTo(center);
    if (Math.abs(distance - radius) > tolerance) {
      return false;
    }
  }
  return true;
}
