
export default async function handler(req, res) {
    console.log(req.query);
    const author = req.query.author; 
    const title = req.query.title;


    const url = `http://127.0.0.1:5000/audio?author=${encodeURIComponent(author)}&title=${encodeURIComponent(title)}`;
   
    console.log(url);
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 'error': error.message });
    }
}
  