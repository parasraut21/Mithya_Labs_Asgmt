import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const StarsBackground = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    // Set up stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Set up camera position
    camera.position.z = 5;

    // Set up renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      stars.rotation.x += 0.001;
      stars.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }} />
  );
};

export default StarsBackground;
