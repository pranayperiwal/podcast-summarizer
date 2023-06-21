import transcriber
import visualizer
#transcribe the podcast
podcast_link_15mins = "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2023-5-8/176566aa-553d-5abd-c98a-18842cccd4d6.mp3"
podcast_link_30mins = "https://audio.hbr.org/ideacast/20230508112732-910_AMarketingProfessorandaMatchmakerTalkPersonalBranding.mp3"
podcast_link_90mins = "https://d3ctxlq1ktw2nl.cloudfront.net/staging/2023-5-11/334575993-44100-2-a858f4365d25e.mp3"


transcription_json = transcriber.transcribe(podcast_link_90mins, speakers_expected=2, save=True, name="podcast_90mins")


#get the chapters and summary
visualizer.visualize(transcription_json)

