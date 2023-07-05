
/**
 * POST /users
 * Create a new user
 *
 * @param {object} req - The request object
 * @param {object} req.body - The request body containing the podcast data
 * @param {string} req.body.hash - The hash of the podcast
 * @param {string} req.body.audioUrl - The audio URL of the podcast
 * @param {object} res - The response object
 * @returns {object} Success or not
 * @throws {Error} If hash, or audioUrl are missing
 */

 export default async function handler(req, res) {
    try {
        const { hash, audioUrl } = req.body;
        console.log(hash, audioUrl);
        // Validate input
        if (!hash || !audioUrl) {
          throw new Error('Hash and audioUrl are required');
        }
        
        const responseData = await transcribeAudio(hash, audioUrl, process.env.ASSEMBLY_API_KEY);

        // Return success response
        res.status(201).json({
            message: responseData
        });
      } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({ error: error.message });
      }
}

/**
This function sends a POST request to the AssemblyAI API to transcribe an audio file.
@param {string} audioHash - The hash of the audio
@param {string} audioUrl - The URL of the audio file to transcribe.
@param {string} apiKey - The API key for accessing the AssemblyAI API.
@returns {object} The parsed response data from the API.
*/
async function transcribeAudio(audioHash, audioUrl, apiKey) {
// Define the API endpoint URL and headers
    const apiUrl = "https://api.assemblyai.com/v2/transcript";
    const headers = {
        "Authorization": apiKey,
        "Content-Type": "application/json"
    };
    // Define the request body
    const requestBody = {
        audio_url: audioUrl,
        webhook_url: buildWebhookUrl(audioHash),
        auto_chapters: true,
        speaker_labels: true, 
        speakers_expected: 1
    };
    try {
        // Send a POST request to the API endpoint and handle the response
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody)   
        });
        
        // If the response is not in the 200-299 range, throw an error
        if (!response.ok) {
            console.error(await response.text());
            throw new Error(`Request failed with status ${response.status}`);
        }
        // Parse the response body as JSON
        const responseData = await response.json();
        // Return the parsed response data
        return responseData;
    } catch (error) {
    // Handle any errors that occur during the request
        console.error(`Error: ${error.message}`);
        throw new Error(`Error: ${error.message}`);
    }
}


/**
 * This function builds the webhook url for assembly AI 
 * @param {string} hash 
 */
function buildWebhookUrl(hash) {
    return `${process.env.BASE_URL}/api/hook/${hash}`
} 
  