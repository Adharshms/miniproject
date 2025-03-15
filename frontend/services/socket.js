import { io } from "socket.io-client";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Set up the backend socket server URL
const SOCKET_SERVER_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000" // ✅ Android Emulator
    : "http://localhost:5000"; // ✅ Web

let socket = null; // ✅ Global socket instance

// ✅ Function to connect to the socket
export const connectSocket = async (userId) => {
  if (!userId) {
    console.error("❌ Error: userId is undefined, socket not connecting.");
    return;
  }

  if (!socket || !socket.connected) {
    console.log("🔄 Attempting to connect socket...");

    socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      query: { userId }, // ✅ Send userId in query params
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected with ID:", socket.id);
      console.log(`🟢 Emitting 'join' event for userId: ${userId}`);
      socket.emit("join", userId);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Connection Error:", err.message);
      alert("Failed to connect. Check your internet or server.");
    });

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Socket disconnected. Reason: ${reason}`);
    });
  }
};

// ✅ Function to get the socket instance
export const getSocket = () => {
  if (!socket || !socket.connected) {
    console.warn("⚠ Socket is not connected!");
    connectSocket();
  }
  return socket;
};

// ✅ Function to disconnect the socket
export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    console.log("🔌 Socket disconnected");
  }
};

// ✅ Export the socket
export default socket;
