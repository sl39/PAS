import axios from "axios";

export async function SearchApi() {
  const response = await axios.get();
  return response.data;
}
