import React, { useRef, useState, useMemo } from "react";
import { View, Dimensions, Modal, StyleSheet, PanResponder, Text } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const MODEL_URL = "https://ihs-solutions.com:5055/ArchivingFiles/vr_home.glb";

export default function Gesture3DViewer() {
  const [visible, setVisible] = useState(false);
  
  // Refs for 3D state (Refs prevent re-renders for smooth 60fps)
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rotation = useRef({ yaw: 0, pitch: 0 });
  const zoom = useRef(6);
  const position = useRef(new THREE.Vector3(0, 1.7, 0));
  
  // Gesture tracking refs
  const lastTouch = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const touches = evt.nativeEvent.touches;
      if (touches.length === 1) {
        lastTouch.current = { x: touches[0].pageX, y: touches[0].pageY };
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      const touches = evt.nativeEvent.touches;

      // --- 1. ROTATION (Single Finger) ---
      if (touches.length === 1) {
        const dx = touches[0].pageX - lastTouch.current.x;
        const dy = touches[0].pageY - lastTouch.current.y;

        rotation.current.yaw -= dx * 0.005;
        rotation.current.pitch -= dy * 0.005;
        rotation.current.pitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, rotation.current.pitch));
        
        lastTouch.current = { x: touches[0].pageX, y: touches[0].pageY };
      }

      // --- 2. MOVEMENT & ZOOM (Two Fingers) ---
      if (touches.length === 2) {
        const dx = touches[0].pageX - touches[1].pageX;
        const dy = touches[0].pageY - touches[1].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Pinch to Zoom
        if (lastPinchDist.current !== null) {
          const diff = distance - lastPinchDist.current;
          zoom.current = Math.max(1, Math.min(20, zoom.current - diff * 0.02));
        }
        lastPinchDist.current = distance;

        // Two-finger Drag to Pan/Move
        const moveX = gestureState.vx * 0.1;
        const moveY = gestureState.vy * 0.1;
        
        if (cameraRef.current) {
          const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion);
          const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cameraRef.current.quaternion);
          position.current.add(forward.multiplyScalar(-moveY));
          position.current.add(right.multiplyScalar(moveX));
        }
      }
    },
    onPanResponderRelease: () => {
      lastPinchDist.current = null;
    }
  }), []);

  const onContextCreate = async (gl: any) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    cameraRef.current = camera;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
    scene.add(new THREE.AmbientLight(0x404040));

    const loader = new GLTFLoader();
    loader.load(MODEL_URL, (gltf) => scene.add(gltf.scene));

    const animate = () => {
      requestAnimationFrame(animate);
      if (!cameraRef.current) return;

      // Apply Orbit/FPS logic
      const r = zoom.current;
      camera.position.x = position.current.x + r * Math.sin(rotation.current.yaw) * Math.cos(rotation.current.pitch);
      camera.position.y = position.current.y + r * Math.sin(rotation.current.pitch);
      camera.position.z = position.current.z + r * Math.cos(rotation.current.yaw) * Math.cos(rotation.current.pitch);
      
      camera.lookAt(position.current);

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.openText} onPress={() => setVisible(true)}>🚀 Open 3D Scene</Text>

      <Modal visible={visible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#000' }} {...panResponder.panHandlers}>
          <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
          
          <View style={styles.overlay}>
             <Text style={styles.closeBtn} onPress={() => setVisible(false)}>Exit</Text>
             <Text style={styles.instructions}>1 Finger: Rotate • 2 Fingers: Move/Zoom</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  openText: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  overlay: { position: 'absolute', top: 50, width: '100%', alignItems: 'center' },
  closeBtn: { color: '#fff', backgroundColor: 'red', padding: 10, borderRadius: 10, marginBottom: 10 },
  instructions: { color: 'rgba(255,255,255,0.6)', fontSize: 12 }
});