"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function BrainNetwork() {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);

  const nodeCount = 400; // Số lượng nơ-ron

  // Khởi tạo hình dáng Bộ Não và Mạng lưới
  const { positions, colors, linePositions, lineColors, nodeData } = useMemo(() => {
    const pos = [];
    const col = [];
    const data: any[] = [];

    // 1. Dựng hình dáng bộ não (Brain Shaping)
    for (let i = 0; i < nodeCount; i++) {
      let x, y, z;
      // Lấy các điểm ngẫu nhiên trong một khối cầu
      do {
        x = (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 2;
        z = (Math.random() - 0.5) * 2;
      } while (x * x + y * y + z * z > 1);

      // Nặn khối cầu thành hình bầu dục của não
      x *= 4.0; // Chiều rộng
      y *= 3.0; // Chiều cao
      z *= 5.0; // Chiều sâu (từ trán ra gáy)

      // Tách 2 bán cầu não (Tạo khe rãnh ở giữa trục X)
      if (x > 0) x += 0.4;
      else x -= 0.4;

      // Uốn cong phần đáy và vuốt nhọn về phía trước
      y -= (z * z) * 0.05; 
      x *= (1 - z * 0.05); 

      pos.push(x, y, z);

      // Thông số để tính toán nhấp nháy
      data.push({
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 1,
        baseColor: new THREE.Color("#1e293b"), // Màu nền tối
        flashColor: new THREE.Color("#06b6d4"), // Màu Cyan nhấp nháy
      });

      col.push(0, 0, 0); // Sẽ được cập nhật trong useFrame
    }

    // 2. Nối các nơ-ron gần nhau (Tạo Synapses)
    const lPos = [];
    const lCol = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Nối các điểm cách nhau dưới khoảng cách 1.8
        if (dist < 1.8) {
          lPos.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
          // Thêm placeholder màu cho 2 đầu đoạn thẳng
          lCol.push(0, 0, 0, 0, 0, 0);
          
          // Ghi nhớ liên kết để nháy màu dây
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

  // Animation: Nhấp nháy nơ-ron và Tương tác chuột
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    const pointColors = pointsRef.current.geometry.attributes.color.array as Float32Array;
    const lineColorsAttr = linesRef.current.geometry.attributes.color.array as Float32Array;

    // Kích hoạt nhấp nháy (Firing Neurons)
    for (let i = 0; i < nodeCount; i++) {
      const node = nodeData[i];
      // Sóng sin mô phỏng xung điện thần kinh
      const intensity = Math.max(0, Math.sin(time * node.speed + node.phase));
      
      // Trộn màu: Nếu intensity > 0.8 thì sáng rực lên
      const color = node.baseColor.clone();
      if (intensity > 0.8) {
        color.lerp(node.flashColor, (intensity - 0.8) * 5); // Tỏa sáng
      }

      pointColors[i * 3] = color.r;
      pointColors[i * 3 + 1] = color.g;
      pointColors[i * 3 + 2] = color.b;

      // Cập nhật màu của các dây thần kinh nối với nơ-ron này
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

    // Xoay bộ não theo con trỏ chuột
    if (groupRef.current) {
      const targetX = state.pointer.x * 0.5;
      const targetY = state.pointer.y * 0.3;

      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
      
      // Bộ não tự nhịp nhàng xoay chậm chậm
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Các Nơ-ron (Points) */}
      <points ref={pointsRef}>
        {/* THÊM KEY VÀO DÒNG NÀY */}
        <bufferGeometry key={`points-${positions.length}`}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </points>

      {/* 2. Dây liên kết (Synapses) */}
      <lineSegments ref={linesRef}>
        {/* THÊM KEY VÀO DÒNG NÀY */}
        <bufferGeometry key={`lines-${linePositions.length}`}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

export default function Hero3D() {
  return (
    // Xóa pointer-events-none để bắt được chuột
    <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        {/* Sương mù tạo độ sâu (phía sau mờ dần) */}
        <fog attach="fog" args={["#030712", 8, 16]} />
        <BrainNetwork />
      </Canvas>
    </div>
  );
}