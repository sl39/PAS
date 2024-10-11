import axios from "axios";

export async function ArtistProfileApi() {
  const response = await axios.get();
  return response.data;
}
