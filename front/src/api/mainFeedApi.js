import axios from "axios";

export async function MainFeedApi() {
  const response = await axios.get();
  return response.data;
}
