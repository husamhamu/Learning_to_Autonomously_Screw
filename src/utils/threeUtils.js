// src/utils/threeUtils.js

import * as THREE from 'three';

export function filterCircularEdges(edges) {
  // ... (implementation of filterCircularEdges)
  var filteredEdges = [];
  var edgePairs = [];

  for (let i = 0; i < edges.attributes.position.array.length; i += 6) {
    var v1 = new THREE.Vector3(
      edges.attributes.position.array[i],
      edges.attributes.position.array[i + 1],
      edges.attributes.position.array[i + 2]
    );
    var v2 = new THREE.Vector3(
      edges.attributes.position.array[i + 3],
      edges.attributes.position.array[i + 4],
      edges.attributes.position.array[i + 5]
    );

    var edgeVector = v2.clone().sub(v1);
    var edgeLength = edgeVector.length();
    var edgeDirection = edgeVector.normalize();

    if (isCircularEdge(v1, v2, edgeLength, edgeDirection)) {
      edgePairs.push({ start: v1, end: v2 });
    }
  }

  var closedLoops = findClosedLoops(edgePairs);
  console.log("Closed Loops:", closedLoops);

  for (let loop of closedLoops) {
    let properties = estimateCirclePropertiesLoop(loop);
    console.log("Estimated Circle Properties:", properties);
    if (isWithinTolerance(loop, properties.center, 1)) {
      for (let edge of loop) {
        filteredEdges.push(edge.start.x, edge.start.y, edge.start.z);
        filteredEdges.push(edge.end.x, edge.end.y, edge.end.z);
      }
    }
  }

  var filteredEdgesGeometry = new THREE.BufferGeometry();
  filteredEdgesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(filteredEdges, 3));

  return filteredEdgesGeometry;
}

export function groupCircularEdges(edges) {
  // ... (implementation of groupCircularEdges)
  var groupedEdges = [];
  var visited = new Set();
  
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

    let stack = [i];
    let group = [];
    visited.add(i);

    while (stack.length > 0) {
      let currentIndex = stack.pop();
      let [v1, v2] = getEdge(currentIndex);
      group.push(currentIndex);

      for (let j = 0; j < edges.attributes.position.array.length; j += 6) {
        if (visited.has(j)) continue;

        let [v3, v4] = getEdge(j);
        if (v1.equals(v3) || v1.equals(v4) || v2.equals(v3) || v2.equals(v4)) {
          stack.push(j);
          visited.add(j);
        }
      }
    }

    var filteredEdges = [];
    for (let index of group) {
      let [v1, v2] = getEdge(index);
      filteredEdges.push(v1.x, v1.y, v1.z);
      filteredEdges.push(v2.x, v2.y, v2.z);
    }

    var filteredEdgesGeometry = new THREE.BufferGeometry();
    filteredEdgesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(filteredEdges, 3));
    groupedEdges.push(filteredEdgesGeometry);
  }

  return groupedEdges;
}

export function estimateCircleProperties(edgesGeometry, number) {
  // ... (implementation of estimateCircleProperties)
  let positions = edgesGeometry.attributes.position.array;
  let points = [];

  for (let i = 0; i < positions.length; i += 3) {
    points.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
  }

  let center = new THREE.Vector3();
  let radius = 0;

  if (points.length >= 3) {
    let centroid = new THREE.Vector3();
    for (let p of points) {
      centroid.add(p);
    }
    centroid.divideScalar(points.length);

    let totalDistance = 0;
    for (let p of points) {
      totalDistance += centroid.distanceTo(p);
    }
    radius = totalDistance / points.length;
    center = centroid;
  }

  return { center, radius, number }; // Return the number as well
}

export function isCircularEdge(v1, v2, edgeLength, edgeDirection) {
  // ... (implementation of isCircularEdge)
  var minRadius = 0.3;
  var maxRadius = 10000;
  if (edgeLength >= minRadius && edgeLength <= maxRadius) {
    return true;
  }
  return false;
}

export function findClosedLoops(edgePairs) {
  // ... (implementation of findClosedLoops)
  var loops = [];
  var visited = new Set();

  function findLoop(startEdge, currentEdge, loop) {
    if (visited.has(currentEdge)) {
      return null;
    }
    visited.add(currentEdge);
    loop.push(currentEdge);

    if (currentEdge.end.equals(startEdge.start)) {
      return loop;
    }

    for (let edge of edgePairs) {
      if (!visited.has(edge) && edge.start.equals(currentEdge.end)) {
        let foundLoop = findLoop(startEdge, edge, loop);
        if (foundLoop) {
          return foundLoop;
        }
      }
    }

    loop.pop();
    visited.delete(currentEdge);
    return null;
  }

  for (let edge of edgePairs) {
    if (visited.has(edge)) continue;

    let loop = findLoop(edge, edge, []);
    if (loop && loop.length > 0) {
      loops.push(loop);
    }
  }

  return loops;
}

export function estimateCirclePropertiesLoop(loop) {
  // ... (implementation of estimateCirclePropertiesLoop)
  let points = [];

  for (let edge of loop) {
    points.push(edge.start);
    points.push(edge.end);
  }

  let center = new THREE.Vector3();
  let radius = 0;

  if (points.length >= 3) {
    let centroid = new THREE.Vector3();
    for (let p of points) {
      centroid.add(p);
    }
    centroid.divideScalar(points.length);

    let totalDistance = 0;
    for (let p of points) {
      totalDistance += centroid.distanceTo(p);
    }
    radius = totalDistance / points.length;
    center = centroid;
  }

  return { center, radius };
}

export function isWithinTolerance(loop, center, tolerance) {
  // ... (implementation of isWithinTolerance)
  let distances = [];

  for (let edge of loop) {
    distances.push(edge.start.distanceTo(center));
    distances.push(edge.end.distanceTo(center));
  }

  let maxDistance = Math.max(...distances);
  let minDistance = Math.min(...distances);
  let difference = maxDistance - minDistance;

  return difference <= tolerance;
}

export function calculateCircleNormal(edgesGeometry) {
  // ... (implementation of calculateCircleNormal)
  let positions = edgesGeometry.attributes.position.array;
  let points = [];

  for (let i = 0; i < positions.length; i += 3) {
    points.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
  }

  if (points.length >= 3) {
    let vector1 = points[1].clone().sub(points[0]);
    let vector2 = points[2].clone().sub(points[0]);

    let normal = new THREE.Vector3();
    normal.crossVectors(vector1, vector2).normalize();

    return normal;
  } else {
    console.error("Not enough points to compute circle normal.");
    return new THREE.Vector3(0, 0, 1);
  }
}

export function detectCoaxialCircles(circlePropertiesList, scene, createTextMesh) {
  // ... (implementation of detectCoaxialCircles)
  const tolerance = 0.01;
  const processedCircles = new Set();
  const groupedCircles = {};

  const colors = [
    0xff0000, // red
    0x00ff00, // green
    0x0000ff, // blue
    0xffff00, // yellow
    0xffa500, // orange
    0x800080, // purple
    0xffc0cb  // pink
  ];

  // Group circles by their radius approximate integer value
  for (let i = 0; i < circlePropertiesList.length; i++) {
    let propertiesA = circlePropertiesList[i];
    if (processedCircles.has(propertiesA.number)) continue;

    let closestCircle = null;
    let closestDistance = Infinity;

    for (let j = 0; j < circlePropertiesList.length; j++) {
      if (i === j) continue;

      let propertiesB = circlePropertiesList[j];
      if (processedCircles.has(propertiesB.number)) continue;

      let normal1 = propertiesA.normal;
      let normal2 = propertiesB.normal;
      let center1 = propertiesA.center;
      let center2 = propertiesB.center;

      if (isCoaxial(normal1, normal2, center1, center2, tolerance)) {
        let distance = center1.distanceTo(center2);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestCircle = propertiesB;
        }
      }
    }

    if (closestCircle) {
      processedCircles.add(propertiesA.number);
      processedCircles.add(closestCircle.number);

      let radiusKey = Math.round(propertiesA.radius); // Approximate integer value of radius
      if (!groupedCircles[radiusKey]) {
        groupedCircles[radiusKey] = [];
      }
      groupedCircles[radiusKey].push({ propertiesA, closestCircle });
    }
  }

  Object.keys(groupedCircles).forEach((radiusKey) => {
    console.log(`M"${radiusKey}":`);
    groupedCircles[radiusKey].forEach((pair, index) => {
      let { propertiesA, closestCircle } = pair;
      let textA = `${index}_01`;
      let textB = `${index}_02`;
      let color = colors[index % colors.length];
      let textMeshA = createTextMesh(textA, color, 2, propertiesA.center);
      let textMeshB = createTextMesh(textB, color, 2, closestCircle.center);
      
      // if (textMeshA) {
      //   scene.add(textMeshA);
      // }
      // if (textMeshB) {
      //   scene.add(textMeshB);
      // }
      
      const rotationMatrixA = addCoordinateSystem(propertiesA.center, propertiesA.normal, closestCircle.center, scene);
      const rotationMatrixB = addCoordinateSystem(closestCircle.center, closestCircle.normal, propertiesA.center, scene);

      console.log(
        `M"${radiusKey}_${index}_01", position: ${formatVector(propertiesA.center)}, rotationMatrix: ${formatMatrix3(rotationMatrixB)}`
      );
      console.log(
        `M"${radiusKey}_${index}_02", position: ${formatVector(closestCircle.center)}, rotationMatrix: ${formatMatrix3(rotationMatrixA)}`
      );
    });
  });
}

export function isCoaxial(normal1, normal2, center1, center2, tolerance) {
  // ... (implementation of isCoaxial)
  let angle = normal1.angleTo(normal2);
  if (Math.abs(angle) < tolerance || Math.abs(Math.PI - angle) < tolerance) {
    let d = new THREE.Vector3().subVectors(center2, center1);
    return isParallel(d, normal1, tolerance);
  }
  return false;
}

export function isParallel(vector1, vector2, tolerance) {
  // ... (implementation of isParallel)
  let angle = vector1.angleTo(vector2);
  return Math.abs(angle) < tolerance || Math.abs(Math.PI - angle) < tolerance;
}

export function formatVector(vector) {
  // ... (implementation of formatVector)
  return `(${vector.x.toFixed(2)}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)})`;

}

export function formatMatrix3(matrix) {
  // ... (implementation of formatMatrix3)
  // Extract rotation matrix elements
  const elements = matrix.elements;

  // Get the vector of each column
  const Rx = `(${elements[0].toFixed(2)}, ${elements[3].toFixed(2)}, ${elements[6].toFixed(2)})`;
  const Ry = `(${elements[1].toFixed(2)}, ${elements[4].toFixed(2)}, ${elements[7].toFixed(2)})`;
  const Rz = `(${elements[2].toFixed(2)}, ${elements[5].toFixed(2)}, ${elements[8].toFixed(2)})`;

  // Returns a formatted string
  return `Rx${Rx}, Ry${Ry}, Rz${Rz}`;
}

export function addCoordinateSystem(position, normal, oppositeCenter, scene) {
  // ... (implementation of addCoordinateSystem)
  const length = 10; // Coordinate axis length

  // Calculate the z-axis direction
  const zAxisDirection = normal.clone().normalize(); // Normal direction as z-axis
  const directionToOppositeCenter = new THREE.Vector3().subVectors(oppositeCenter, position).normalize();
  const zAxisDirectionReversed = directionToOppositeCenter.negate(); // The z-axis is in the opposite direction from the center of the circle to the center of the other circle.

  // Calculate the x-axis direction
  const xAxisDirection = new THREE.Vector3(1, 0, 0); // Initial x-axis direction
  const xAxis = new THREE.Vector3().crossVectors(zAxisDirectionReversed, xAxisDirection).normalize(); // Calculate the x-axis direction
  const yAxisDirection = new THREE.Vector3().crossVectors(zAxisDirectionReversed, xAxis).normalize(); // Calculate the y-axis direction

  // Creating Axis Geometry
  const axisMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  // X-axis (red)
  const xGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(length, 0, 0)
  ]);
  const xAxisLine = new THREE.Line(xGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));

  // Y-axis (green)
  const yGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, length, 0)
  ]);
  const yAxisLine = new THREE.Line(yGeometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));

  // Z axis (blue) - parallel to the normal
  const zGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, length)
  ]);
  const zAxisLine = new THREE.Line(zGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));

  // Calculate the rotation angle
  const zDirection = new THREE.Vector3(0, 0, 1); // Default z-axis direction
  const rotationAxis = new THREE.Vector3().crossVectors(zDirection, zAxisDirectionReversed).normalize(); // Rotation axis
  const angle = zDirection.angleTo(zAxisDirectionReversed); // Rotation angle
  const quaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle); // Rotation Quaternion

  // Apply rotation to the axes
  xAxisLine.applyQuaternion(quaternion);
  yAxisLine.applyQuaternion(quaternion);
  zAxisLine.applyQuaternion(quaternion);

  // console.log(
  //   `${rotationAxis} `
  // );

  // Positioning coordinate system
  xAxisLine.position.copy(position);
  yAxisLine.position.copy(position);
  zAxisLine.position.copy(position);

  // Adding a coordinate system to the scene
  const coordinateSystem = new THREE.Group();
  coordinateSystem.add(xAxisLine);
  coordinateSystem.add(yAxisLine);
  coordinateSystem.add(zAxisLine);
  scene.add(coordinateSystem);

  // Returns the rotation matrix
  const rotationMatrix = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(quaternion));
  return rotationMatrix;
}