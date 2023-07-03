import os
import openai
openai.api_key = "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"

def summarize(content):
  completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo-0613",
    messages=[
      {"role": "system", "content": "You are a podcast summariser. You will be given a chapter of the podcast. No need to mention the chapter name. Give a detailed summary of the chapter."},
      {"role": "user", "content": content}
    ]
  )
  print(completion.choices[0].message["content"])

