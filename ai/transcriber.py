import requests
import json
import time

# replace with your API token
YOUR_API_TOKEN = "f8d9ca683c2841adba48eea359032da5"

def transcribe(file_url, speakers_expected, save, name):
    # URL of the file to transcribe
    FILE_URL = file_url


    # AssemblyAI transcript endpoint (where we submit the file)
    transcript_endpoint = "https://api.assemblyai.com/v2/transcript"

    # request parameters where Speaker Diarization has been enabled
    data = {
      "audio_url": FILE_URL,
      "speaker_labels": True,
      "auto_chapters": True,
      "speakers_expected": speakers_expected
    }

    # HTTP request headers
    headers={
      "Authorization": YOUR_API_TOKEN,
      "Content-Type": "application/json"
    }

    # submit for transcription via HTTP request
    response = requests.post(transcript_endpoint,
                             json=data,
                             headers=headers)

    # polling for transcription completion
    polling_endpoint = f"https://api.assemblyai.com/v2/transcript/{response.json()['id']}"

    while True:
        transcription_result = requests.get(polling_endpoint, headers=headers).json()

        if transcription_result['status'] == 'completed':
            # print the results
            transcription = json.dumps(transcription_result, indent=2)
            if save:
            # print(transcription)
                with open(name+".json", "w+") as outfile:
                    outfile.write(transcription)
            return transcription
        elif transcription_result['status'] == 'error':
            raise RuntimeError(f"Transcription failed: {transcription_result['error']}")
        else:
            time.sleep(3)