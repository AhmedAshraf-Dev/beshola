// Pro3DViewerModal.tsx
import React, { useRef, useState } from "react";
import {
  View,
  PanResponder,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const { width } = Dimensions.get("window");

// 🌍 WORLD CONFIG
const WORLD = {
  chunks: [
    {
      id: "area1",
      position: { x: 0, y: 0, z: 0 },
      low: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
      high: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
      loadDistance: 20,
      highQualityDistance: 8,
      unloadDistance: 30,
      collider: { size: [10, 5, 10] },
    },
  ],
};

export default function Pro3DViewerModal() {
  const [visible, setVisible] = useState(false);

  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const velocity = useRef({ forward: 0, right: 0 });
  const rotation = useRef({ yaw: 0, pitch: 0 });
  const loaded = useRef<Record<string, THREE.Object3D>>({});

  // 🎮 LEFT = MOVE
  const moveResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.x0 < width / 2,
    onPanResponderMove: (_, g) => {
      velocity.current.forward = -g.dy * 0.01;
      velocity.current.right = g.dx * 0.01;
    },
    onPanResponderRelease: () => {
      velocity.current = { forward: 0, right: 0 };
    },
  });

  // 🎯 RIGHT = LOOK
  const lookResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.x0 > width / 2,
    onPanResponderMove: (_, g) => {
      rotation.current.yaw -= g.dx * 0.003;
      rotation.current.pitch -= g.dy * 0.003;
      rotation.current.pitch = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rotation.current.pitch),
      );
    },
  });

  const onContextCreate = async (gl: any) => {
    console.log(gl, "onContextCreate 3d");

    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000,
    );

    // Move camera back to see the mesh
    camera.position.set(0, 50, 150); // Y=50, Z=150
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // LIGHT
    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    scene.add(light);

    const loader = new GLTFLoader();

    loader.load(
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
      (gltf) => {
        console.log("✅ Model loaded");
        const model = gltf.scene;

        // Scale model up
        model.scale.set(100, 100, 100); // adjust to fit camera
        model.position.set(0, 0, 0);
        scene.add(model);
      },
      (xhr) =>
        console.log(
          `⏳ Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}%`,
        ),
      (error) => console.error("❌ Error loading model:", error),
    );

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate camera or model (optional)
      if (cameraRef.current) {
        cameraRef.current.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Open 3D Viewer pressed");
          setVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Open 3D Viewer</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide">
        <View
          style={{ flex: 1 }}
          {...moveResponder.panHandlers}
          {...lookResponder.panHandlers}
        >
          <GLView
            style={{ flex: 1, backgroundColor: "#222" }}
            onContextCreate={onContextCreate}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: "#f00",
    borderRadius: 5,
  },
});
