/**
 * API endpoint to fetch the audio URL for a given episode.
 *
 * Query Parameters:
 * i) Author - Author of the podcast
 * ii) Title - Title of the episode
 */
export default async function handler(req, res) {
  const showName = req.query.showName;
  const episodeName = req.query.episodeName;

  const url = `http://127.0.0.1:5000/audio?author=${encodeURIComponent(
    showName
  )}&title=${encodeURIComponent(episodeName)}`;
  console.log(url);

  console.log(url);
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
