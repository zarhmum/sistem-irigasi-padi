import API from "./axiosInstance"; // ini file yang kamu tulis tadi

// Ambil data sensor dari ESP32
export const getSensorData = async () => {
  try {
    const response = await API.get("/esp/data");
    return response.data; // karena kamu pakai res.status(200).json(data)
  } catch (error) {
    console.error("❌ Gagal ambil data sensor dari ESP:", error);
    return [];
  }
};