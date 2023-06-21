import json
import summarizer
# Opening JSON file
# f = open('test2.json')

# returns JSON object as
# a dictionary
# data = json.load(f)

def miliseondsToTime(millis):
    seconds = (millis / 1000) % 60
    seconds = int(seconds)
    minutes = (millis / (1000 * 60)) % 60
    minutes = int(minutes)
    hours = (millis / (1000 * 60 * 60)) % 24
    return "%d:%d:%d" % (hours, minutes, seconds)

def visualize(transcription_json):
    data = json.loads(transcription_json)
    utterance_index = 0

    for chapter in data["chapters"]:
        start = chapter["start"]
        end = chapter['end']

        chapter_content = ""
        chapter_content += "Chapter: " + chapter["gist"] + '\n'
        chapter_content += "From: " + str(start) + " - " + str(end) + '\n\n'

        print("Chapter:", chapter["gist"])
        print("From:", miliseondsToTime(start), "-", miliseondsToTime(end))
        print()
        while utterance_index < len(data['utterances']) and data['utterances'][utterance_index]['end'] <= end:
            utterance = data['utterances'][utterance_index]
            chapter_content += utterance["speaker"] + " (" + str(utterance["start"]) + " - " + str(utterance["end"]) + "): "+ '\n'
            chapter_content += utterance["text"] + "\n\n"

            # print(utterance["speaker"], "(" + str(utterance["start"]), "-", str(utterance["end"]) + "): ")
            # print(utterance["text"])
            utterance_index += 1
        # print('\n\n')
        # print(chapter_content)
        summarizer.summarize(chapter_content)

# visualize(f)
# f.close()