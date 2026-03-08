import "react-native-gesture-handler";
import "react-native-reanimated";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import App from "./App";
import "./patch-registerWebModule";
registerRootComponent(gestureHandlerRootHOC(App));
