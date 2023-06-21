import tiktoken
import json

encoding = tiktoken.encoding_for_model("gpt-3.5-turbo-16k")

f = open('podcast_90mins.json')
data = json.load(f)

text = ""
for utterance in data["utterances"]:
    text += utterance["speaker"] + "\n"
    text += utterance["text"] + "\n\n"

num_tokens = len(encoding.encode(text))
print(num_tokens)




