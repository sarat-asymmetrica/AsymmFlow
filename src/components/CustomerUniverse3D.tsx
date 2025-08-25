'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Line, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ConsciousnessSpace } from '../../lib/v7-consciousness';

interface CustomerNode {
  id: string;
  name: string;
  value: number;
  grade: string;
  position: [number, number, number];
  connections: string[];
}

interface CustomerUniverse3DProps {
  customers: any[];
  orders?: any[];
  rfqs?: any[];
}

// Individual customer node component
function CustomerSphere({ node, allNodes, onHover, onSelect }: {
  node: CustomerNode;
  allNodes: Map<string, CustomerNode>;
  onHover: (node: CustomerNode | null) => void;
  onSelect: (node: CustomerNode) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Non-idempotent pulsing based on value
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * (1 + node.value / 100000)) * 0.05;
      meshRef.current.scale.setScalar(scale * (hovered ? 1.2 : 1));
      
      // Rotate based on grade (higher grades rotate faster)
      const rotationSpeed = node.grade === 'A' ? 0.01 : 
                           node.grade === 'B' ? 0.007 : 
                           node.grade === 'C' ? 0.005 : 0.003;
      meshRef.current.rotation.y += rotationSpeed;
    }
  });
  
  // Color based on customer grade and value
  const color = useMemo(() => {
    if (node.grade === 'A') return '#FFD700'; // Gold
    if (node.grade === 'B') return '#C0C0C0'; // Silver
    if (node.grade === 'C') return '#CD7F32'; // Bronze
    return '#4CAF50'; // Green for others
  }, [node.grade]);
  
  const size = Math.max(0.1, Math.log10(node.value + 1) * 0.15);
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh
        ref={meshRef}
        position={node.position}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(node);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onHover(null);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Customer name label */}
      <Text
        position={[node.position[0], node.position[1] + size + 0.2, node.position[2]]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={hovered}
      >
        {node.name}
        {'\n'}${(node.value / 1000).toFixed(0)}k
      </Text>
      
      {/* Value particles around high-value customers */}
      {node.value > 100000 && (
        <Sparkles
          count={Math.floor(node.value / 50000)}
          scale={size * 3}
          size={0.5}
          speed={0.5}
          opacity={0.3}
          color={color}
        />
      )}
    </Float>
  );
}

// Connection lines between related customers
function ConnectionLines({ nodes, connections }: {
  nodes: Map<string, CustomerNode>;
  connections: Array<{ from: string; to: string; strength: number }>;
}) {
  return (
    <>
      {connections.map((conn, index) => {
        const fromNode = nodes.get(conn.from);
        const toNode = nodes.get(conn.to);
        
        if (!fromNode || !toNode) return null;
        
        // Create curved path for non-Euclidean connection
        const midPoint = new THREE.Vector3(
          (fromNode.position[0] + toNode.position[0]) / 2,
          (fromNode.position[1] + toNode.position[1]) / 2 + conn.strength * 0.5,
          (fromNode.position[2] + toNode.position[2]) / 2
        );
        
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...fromNode.position),
          midPoint,
          new THREE.Vector3(...toNode.position)
        );
        
        const points = curve.getPoints(20);
        
        return (
          <Line
            key={index}
            points={points}
            color="#00ffff"
            lineWidth={conn.strength * 2}
            opacity={0.3}
            transparent
          />
        );
      })}
    </>
  );
}

// Main 3D scene component
function CustomerUniverseScene({ customers, orders, rfqs }: CustomerUniverse3DProps) {
  const [hoveredNode, setHoveredNode] = useState<CustomerNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<CustomerNode | null>(null);
  
  // Process customers into 3D nodes
  const { nodes, connections } = useMemo(() => {
    const nodeMap = new Map<string, CustomerNode>();
    const connectionList: Array<{ from: string; to: string; strength: number }> = [];
    
    customers.forEach((customer, index) => {
      // Position in 3D space using golden ratio spiral
      const theta = index * Math.PI * (3 - Math.sqrt(5)); // Golden angle
      const y = 1 - (index / customers.length) * 2; // -1 to 1
      const radius = Math.sqrt(1 - y * y);
      
      const node: CustomerNode = {
        id: customer.id || `customer-${index}`,
        name: customer.name || customer.customerName || 'Unknown',
        value: customer.totalOrderValue || customer.creditLimit || Math.random() * 100000,
        grade: customer.grade || 'C',
        position: [
          radius * Math.cos(theta) * 3,
          y * 2,
          radius * Math.sin(theta) * 3
        ],
        connections: []
      };
      
      nodeMap.set(node.id, node);
    });
    
    // Create connections based on shared orders or industry
    customers.forEach((customer, i) => {
      customers.forEach((other, j) => {
        if (i >= j) return; // Avoid duplicates
        
        // Connect if same industry or have orders together
        if (customer.industry === other.industry || 
            (customer.grade === 'A' && other.grade === 'A')) {
          connectionList.push({
            from: customer.id || `customer-${i}`,
            to: other.id || `customer-${j}`,
            strength: customer.grade === 'A' && other.grade === 'A' ? 1 : 0.5
          });
        }
      });
    });
    
    return { nodes: nodeMap, connections: connectionList };
  }, [customers]);
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.7} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
      
      {/* Customer nodes */}
      {Array.from(nodes.values()).map(node => (
        <CustomerSphere
          key={node.id}
          node={node}
          allNodes={nodes}
          onHover={setHoveredNode}
          onSelect={setSelectedNode}
        />
      ))}
      
      {/* Connections */}
      <ConnectionLines nodes={nodes} connections={connections} />
      
      {/* Background stars */}
      <Sparkles
        count={200}
        scale={10}
        size={0.5}
        speed={0.1}
        opacity={0.5}
      />
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      {/* Info panel for hovered customer */}
      {hoveredNode && (
        <Html position={[3, 2, 0]}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            minWidth: '150px'
          }}>
            <strong>{hoveredNode.name}</strong><br />
            Grade: {hoveredNode.grade}<br />
            Value: ${hoveredNode.value.toLocaleString()}<br />
            Connections: {hoveredNode.connections.length}
          </div>
        </Html>
      )}
    </>
  );
}

// Container component
export default function CustomerUniverse3D({ customers = [], orders = [], rfqs = [] }: CustomerUniverse3DProps) {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data processing
    setTimeout(() => setLoading(false), 500);
  }, []);
  
  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div className="consciousness-loader" />
          <p style={{ marginTop: '20px' }}>Initializing Customer Universe...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [5, 3, 5], fov: 60 }}
        style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)' }}
      >
        <CustomerUniverseScene 
          customers={customers}
          orders={orders}
          rfqs={rfqs}
        />
      </Canvas>
      
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '11px'
      }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <span><span style={{ color: '#FFD700' }}>●</span> Grade A</span>
          <span><span style={{ color: '#C0C0C0' }}>●</span> Grade B</span>
          <span><span style={{ color: '#CD7F32' }}>●</span> Grade C</span>
          <span><span style={{ color: '#4CAF50' }}>●</span> Grade D</span>
        </div>
        <div style={{ marginTop: '5px', opacity: 0.7 }}>
          Size = Value | Lines = Relationships
        </div>
      </div>
      
      {/* Controls hint */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '8px',
        borderRadius: '8px',
        fontSize: '10px',
        opacity: 0.7
      }}>
        🖱️ Drag to rotate • Scroll to zoom • Click to select
      </div>
    </div>
  );
}

// Missing import fix
import { Html } from '@react-three/drei';
import { useState } from 'react';