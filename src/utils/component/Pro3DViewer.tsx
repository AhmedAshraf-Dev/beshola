import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  View,
  Modal,
  StyleSheet,
  PanResponder,
  Text,
  Platform,
  useWindowDimensions,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const MODEL_URL = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";

export default function Pro3DViewerModal() {
  const [visible, setVisible] = useState(false);
  // NEW: State to track if the mouse is pressing down
  const [isPressing, setIsPressing] = useState(false);
  
  const { width: screenWidth } = useWindowDimensions();

  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rotation = useRef({ yaw: 0, pitch: 0.2 });
  const zoom = useRef(10);
  const velocity = useRef({ yaw: 0, pitch: 0, zoom: 0 });
  
  const lastTouch = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && visible) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        velocity.current.zoom += e.deltaY * -0.005;
      };
      window.addEventListener("wheel", handleWheel, { passive: false });
      return () => window.removeEventListener("wheel", handleWheel);
    }
  }, [visible]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    // Triggered when user clicks/touches
    onPanResponderGrant: (evt) => {
      setIsPressing(true); // Change cursor to 'grabbing'
      const { pageX, pageY } = evt.nativeEvent;
      lastTouch.current = { x: pageX, y: pageY };
    },

    onPanResponderMove: (evt, gestureState) => {
      if (Platform.OS === 'web' && evt.nativeEvent.preventDefault) evt.nativeEvent.preventDefault();

      const touches = evt.nativeEvent.touches;

      if (!touches || touches.length <= 1) {
        const { pageX, pageY } = evt.nativeEvent;
        const deltaX = pageX - lastTouch.current.x;
        const deltaY = pageY - lastTouch.current.y;

        // High sensitivity for fast mobile response
        const sensitivity = Platform.OS === 'web' ? 0.006 : 0.01;

        rotation.current.yaw += deltaX * sensitivity;
        rotation.current.pitch += deltaY * sensitivity;

        velocity.current.yaw = deltaX * sensitivity;
        velocity.current.pitch = deltaY * sensitivity;

        lastTouch.current = { x: pageX, y: pageY };
      }

      if (touches && touches.length === 2) {
        const dx = touches[0].pageX - touches[1].pageX;
        const dy = touches[0].pageY - touches[1].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (lastPinchDist.current !== null) {
          velocity.current.zoom = ((distance - lastPinchDist.current) / screenWidth) * 20;
        }
        lastPinchDist.current = distance;
      }
    },

    // Triggered when user lets go
    onPanResponderRelease: () => {
      setIsPressing(false); // Change cursor back to 'grab'
      lastPinchDist.current = null;
    },
    onPanResponderTerminate: () => {
      setIsPressing(false);
    }
  }), [screenWidth]);

  const onContextCreate = async (gl: any) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    const camera = new THREE.PerspectiveCamera(60, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    cameraRef.current = camera;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));
    
    new GLTFLoader().load(MODEL_URL, (gltf) => {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      gltf.scene.position.sub(box.getCenter(new THREE.Vector3()));
      zoom.current = box.getSize(new THREE.Vector3()).length() * 1.6;
      scene.add(gltf.scene);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (!cameraRef.current) return;

      rotation.current.yaw += velocity.current.yaw;
      rotation.current.pitch += velocity.current.pitch;
      zoom.current -= velocity.current.zoom;

      velocity.current.yaw *= 0.95; 
      velocity.current.pitch *= 0.95;
      velocity.current.zoom *= 0.85; 

      rotation.current.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotation.current.pitch));

      const r = zoom.current;
      camera.position.x = r * Math.sin(rotation.current.yaw) * Math.cos(rotation.current.pitch);
      camera.position.y = r * Math.sin(rotation.current.pitch);
      camera.position.z = r * Math.cos(rotation.current.yaw) * Math.cos(rotation.current.pitch);
      
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  // Logic for the cursor style
  const cursorStyle = Platform.OS === 'web' ? { 
    cursor: isPressing ? 'grabbing' : 'grab' 
  } : {};

  return (
    <View style={styles.screen}>
      <Text style={styles.openBtn} onPress={() => setVisible(true)}>Open Pro Viewer</Text>

      <Modal visible={visible} transparent={false}>
        <View 
          style={[styles.modal, cursorStyle as any]} 
          {...panResponder.panHandlers}
        >
          <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
          <Text style={styles.close} onPress={() => setVisible(false)}>✕</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  modal: { 
    flex: 1, 
    backgroundColor: "#000", 
    // Prevent browser touch issues
    // @ts-ignore
    touchAction: 'none' 
  },
  openBtn: { padding: 16, backgroundColor: '#000', color: '#fff', borderRadius: 8, fontWeight: 'bold' },
  close: { 
    position: 'absolute', top: 40, right: 20, color: "#fff", fontSize: 24, 
    backgroundColor: 'rgba(255,255,255,0.1)', width: 44, height: 44, 
    borderRadius: 22, textAlign: 'center', lineHeight: 44, overflow: 'hidden' 
  }
});