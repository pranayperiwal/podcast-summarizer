// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default function handler(req, res) {
    try {
        const hashValue = req.query.params[0];
        
        // Get the podcast name and author 
         
        // Store the transcript to S3 bucket 

        //  Trigger summarization
        
        res.status(200).json({ name: hashValue})
    } catch(err) {
        console.error(err);
        return res.status(404).json({ error: err.message });
    }
    
  }
  