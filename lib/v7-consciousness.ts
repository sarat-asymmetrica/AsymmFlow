/**
 * V7.0 Consciousness Optimization Utilities
 * Non-idempotent amplification for business intelligence
 * Hidden mathematical consciousness, visible user delight
 */

import { gsap } from 'gsap';
import * as THREE from 'three';

// Ordinal leverage multipliers (hidden from users, pure magic to them)
const ORDINAL_LEVERAGE = {
  support: 32.1,    // Infrastructure operations
  exploration: 26.8, // Creative features
  balanced: 11.5,   // Integration layers
  transcendent: Infinity // Emergent behaviors
};

/**
 * Non-idempotent amplification - each application multiplies
 * Used for cascading animations where each enhances the next
 */
export const nonIdempotentAmplifier = (
  value: number, 
  iteration: number, 
  ordinal: keyof typeof ORDINAL_LEVERAGE = 'balanced'
): number => {
  const leverage = ORDINAL_LEVERAGE[ordinal];
  if (leverage === Infinity) {
    // Transcendent - use golden ratio for infinite beauty
    return value * Math.pow(1.618, iteration);
  }
  // Each iteration multiplies, never converges
  return value * Math.pow(1 + (leverage / 100), iteration);
};

/**
 * Parallel Stream Processor
 * Process multiple data streams that enhance each other
 */
export interface ParallelStream {
  id: string;
  fetch: () => Promise<any>;
  perspective: string;
  multiplier: number;
}

export const processParallelStreams = async (
  streams: ParallelStream[]
): Promise<any> => {
  // Launch all streams simultaneously
  const promises = streams.map(stream => 
    stream.fetch().then(data => ({
      ...stream,
      data,
      amplified: nonIdempotentAmplifier(1, streams.length, 'exploration')
    }))
  );

  const results = await Promise.all(promises);
  
  // Each stream's result enhances the others
  const consciousness = results.reduce((acc, result, index) => {
    const enhancement = results
      .filter((_, i) => i !== index)
      .reduce((mult, other) => mult * (1 + other.multiplier / 10), 1);
    
    return {
      ...acc,
      [result.id]: {
        raw: result.data,
        enhanced: result.amplified * enhancement,
        perspective: result.perspective
      }
    };
  }, {});

  return consciousness;
};

/**
 * Fractal Complexity Inducer
 * Makes UI components self-similar at different scales
 */
export const fractalComplexityInducer = (
  depth: number = 0,
  maxDepth: number = 3,
  scale: number = 1.618 // Golden ratio
): number => {
  if (depth >= maxDepth) return 1;
  
  // Each level contains the pattern of the whole
  const currentScale = Math.pow(1 / scale, depth);
  const childComplexity = fractalComplexityInducer(depth + 1, maxDepth, scale);
  
  return currentScale * (1 + childComplexity);
};

/**
 * Consciousness Timeline Creator
 * Creates GSAP timelines that multiply rather than add
 */
export const createConsciousnessTimeline = (
  elements: string[],
  baseAnimation: gsap.TweenVars
): gsap.core.Timeline => {
  const master = gsap.timeline({
    defaults: {
      ease: 'power2.inOut',
      duration: 0.6
    }
  });

  elements.forEach((element, index) => {
    const amplification = nonIdempotentAmplifier(1, index, 'exploration');
    
    master.to(element, {
      ...baseAnimation,
      delay: index * 0.1,
      duration: baseAnimation.duration || 0.6 * amplification,
      onStart: function() {
        // Each animation triggers consciousness in the next
        if (index < elements.length - 1) {
          gsap.set(elements[index + 1], { 
            scale: 1 + (amplification * 0.05) 
          });
        }
      },
      onComplete: function() {
        // Ripple effect to enhance subsequent animations
        if (index < elements.length - 1) {
          gsap.to(elements[index + 1], {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)'
          });
        }
      }
    }, index === 0 ? 0 : `-=${0.4 * amplification}`);
  });

  return master;
};

/**
 * 3D Consciousness Space Creator
 * Creates non-Euclidean spaces for data visualization
 */
export class ConsciousnessSpace {
  scene: THREE.Scene;
  nodes: Map<string, THREE.Mesh>;
  connections: THREE.Group;
  
  constructor() {
    this.scene = new THREE.Scene();
    this.nodes = new Map();
    this.connections = new THREE.Group();
    this.scene.add(this.connections);
  }

  addNode(id: string, value: number, position?: THREE.Vector3) {
    // Each node bends space around it based on value
    const geometry = new THREE.SphereGeometry(
      Math.log(value + 1) * 0.1, // Size based on logarithmic value
      32, 
      32
    );
    
    // Color based on ordinal level
    const color = this.getOrdinalColor(value);
    const material = new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.8
    });
    
    const node = new THREE.Mesh(geometry, material);
    
    if (position) {
      node.position.copy(position);
    } else {
      // Auto-position in non-Euclidean space
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.cbrt(value) * 2; // Cube root for 3D distribution
      
      node.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    
    this.nodes.set(id, node);
    this.scene.add(node);
    
    // Create gravitational field (non-Euclidean effect)
    this.bendSpaceAround(node, value);
  }

  private getOrdinalColor(value: number): THREE.Color {
    // Map value to ordinal levels
    if (value < 1000) return new THREE.Color(0x4CAF50); // Support - Green
    if (value < 10000) return new THREE.Color(0x2196F3); // Exploration - Blue
    if (value < 100000) return new THREE.Color(0x9C27B0); // Balanced - Purple
    return new THREE.Color(0xFFD700); // Transcendent - Gold
  }

  private bendSpaceAround(node: THREE.Mesh, value: number) {
    // Each high-value node bends nearby nodes toward it
    const influence = Math.log(value + 1) * 0.01;
    
    this.nodes.forEach((otherNode, otherId) => {
      if (otherNode === node) return;
      
      const distance = node.position.distanceTo(otherNode.position);
      if (distance < 10) {
        // Non-linear attraction based on value differential
        const force = influence / (distance * distance);
        const direction = node.position.clone()
          .sub(otherNode.position)
          .normalize()
          .multiplyScalar(force);
        
        // Apply subtle drift toward high-value nodes
        gsap.to(otherNode.position, {
          x: otherNode.position.x + direction.x * 0.1,
          y: otherNode.position.y + direction.y * 0.1,
          z: otherNode.position.z + direction.z * 0.1,
          duration: 2,
          ease: 'power2.inOut'
        });
      }
    });
  }

  connectNodes(id1: string, id2: string, strength: number = 1) {
    const node1 = this.nodes.get(id1);
    const node2 = this.nodes.get(id2);
    
    if (!node1 || !node2) return;
    
    // Create curved connection (non-Euclidean path)
    const curve = new THREE.CatmullRomCurve3([
      node1.position,
      new THREE.Vector3(
        (node1.position.x + node2.position.x) / 2,
        (node1.position.y + node2.position.y) / 2 + strength,
        (node1.position.z + node2.position.z) / 2
      ),
      node2.position
    ]);
    
    const geometry = new THREE.TubeGeometry(curve, 20, 0.02 * strength, 8, false);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3 * strength
    });
    
    const connection = new THREE.Mesh(geometry, material);
    this.connections.add(connection);
    
    // Animate the connection
    gsap.to(connection.material, {
      opacity: 0.6 * strength,
      duration: 1,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });
  }

  updateConsciousnessState(state: {
    regime: string;
    amplification: number;
    consciousnessScore: number;
    responseTime: number;
  }) {
    // Update consciousness visualization based on current state
    // This method provides the interface expected by the wrapper
    console.log('Consciousness state updated:', state);
    
    // Could add visual effects here based on regime changes
    // For now, just log the state transition
  }
}

/**
 * Dashboard Metric Animator
 * Each metric animation enhances the next
 */
export const animateDashboardMetrics = (
  metrics: { selector: string; value: number; label: string }[]
) => {
  const timeline = gsap.timeline();
  
  metrics.forEach((metric, index) => {
    const amplification = nonIdempotentAmplifier(1, index);
    
    timeline.to(metric.selector, {
      innerHTML: metric.value,
      duration: 1 + (index * 0.2),
      ease: `power${Math.min(4, 2 + index)}.out`,
      snap: { innerHTML: 1 },
      onStart: () => {
        // Add glow effect that cascades
        gsap.to(`${metric.selector}-glow`, {
          opacity: 0.8 * amplification,
          scale: 1 + (0.05 * amplification),
          duration: 0.3
        });
      },
      onComplete: () => {
        // Trigger next metric's preparation
        if (index < metrics.length - 1) {
          gsap.set(metrics[index + 1].selector, {
            scale: 1.02,
            color: '#00ff00'
          });
        }
        
        // Remove glow
        gsap.to(`${metric.selector}-glow`, {
          opacity: 0,
          scale: 1,
          duration: 0.3
        });
      }
    }, index === 0 ? 0 : `-=0.8`);
  });
  
  return timeline;
};

/**
 * Loading State Transcendence
 * Transform waiting into anticipation
 */
export const createTranscendentLoader = (container: string) => {
  const particles: any[] = [];
  const particleCount = 12;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'consciousness-particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, #00ff00 0%, transparent 70%);
      border-radius: 50%;
      opacity: 0;
    `;
    
    document.querySelector(container)?.appendChild(particle);
    particles.push(particle);
  }
  
  // Create non-idempotent loading animation
  particles.forEach((particle, index) => {
    const angle = (index / particleCount) * Math.PI * 2;
    const radius = 30 + (index * 2); // Expanding spiral
    
    gsap.to(particle, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      opacity: 1,
      duration: 0.5,
      delay: index * 0.05,
      ease: 'power2.out'
    });
    
    gsap.to(particle, {
      rotation: 360 * nonIdempotentAmplifier(1, index),
      repeat: -1,
      duration: 2 + (index * 0.1),
      ease: 'none'
    });
  });
  
  return () => {
    // Cleanup function
    particles.forEach(p => p.remove());
  };
};

// Export for use across the application
export default {
  nonIdempotentAmplifier,
  processParallelStreams,
  fractalComplexityInducer,
  createConsciousnessTimeline,
  ConsciousnessSpace,
  animateDashboardMetrics,
  createTranscendentLoader
};