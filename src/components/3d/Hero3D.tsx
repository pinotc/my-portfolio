"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GlobalNetwork() {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  const nodeCount = 600; // Số lượng node dữ liệu

  // Khởi tạo hình dáng Quả địa cầu (Fibonacci Sphere)
  const { positions, colors, linePositions, lineColors, nodeData } = useMemo(() => {
    const pos = [];
    const col = [];
    const data: any[] = [];

    const radius = 3.5; // Bán kính quả cầu
    const phi = Math.PI * (3 - Math.sqrt(5)); // Góc vàng (Golden angle)

    // 1. Phân bố điểm đều trên mặt cầu bằng thuật toán Fibonacci
    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2; // y đi từ 1 đến -1
      const radiusAtY = Math.sqrt(1 - y * y); // Bán kính tại mặt cắt y
      const theta = phi * i; // Góc xoay

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      pos.push(x * radius, y * radius, z * radius);

      // Thông số nhấp nháy
      data.push({
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.5 + 0.5,
        baseColor: new THREE.Color("#1e293b"), // Màu nền tối
        flashColor: new THREE.Color("#10b981"), // Xanh ngọc lục bảo (Emerald)
      });

      col.push(0, 0, 0); 
    }

    // 2. Nối các điểm gần nhau tạo mạng lưới (Network)
    const lPos = [];
    const lCol = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Nối các điểm cách nhau dưới một khoảng nhất định
        if (dist < 1.1) {
          lPos.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
          lCol.push(0, 0, 0, 0, 0, 0);
          
          // Lưu index để nháy màu dây
          data[i].connections = data[i].connections || [];
          data[i].connections.push((lPos.length / 3) - 2);
          data[j].connections = data[j].connections || [];
          data[j].connections.push((lPos.length / 3) - 1);
        }
      }
    }

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
      linePositions: new Float32Array(lPos),
      lineColors: new Float32Array(lCol),
      nodeData: data,
    };
  }, []);

  // Animation: Nhấp nháy và Xoay
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    const pointColors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const lineColorsAttr = linesRef.current.geometry.attributes.color.array as Float32Array;

    for (let i = 0; i < nodeCount; i++) {
      const node = nodeData[i];
      const intensity = Math.max(0, Math.sin(time * node.speed + node.phase));
      
      const color = node.baseColor.clone();
      if (intensity > 0.8) {
        color.lerp(node.flashColor, (intensity - 0.8) * 5); 
      }

      pointColors[i * 3] = color.r;
      pointColors[i * 3 + 1] = color.g;
      pointColors[i * 3 + 2] = color.b;

      if (node.connections) {
        node.connections.forEach((lineIndex: number) => {
          lineColorsAttr[lineIndex * 3] = color.r;
          lineColorsAttr[lineIndex * 3 + 1] = color.g;
          lineColorsAttr[lineIndex * 3 + 2] = color.b;
        });
      }
    }

    pointsRef.current.geometry.attributes.color.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;

    // Hiệu ứng tương tác chuột và tự xoay mượt mà
    if (groupRef.current) {
      const targetX = state.pointer.x * 0.3;
      const targetY = state.pointer.y * 0.2;

      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
      
      // Quả cầu tự xoay tròn đều đặn
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry key={`points-${positions.length}`}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry key={`lines-${linePositions.length}`}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <fog attach="fog" args={["#030712", 4, 15]} />
        <GlobalNetwork />
      </Canvas>
    </div>
  );
}