from flask import Flask, jsonify,request
from flask_cors import CORS 
import openai
app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route("/api/members")
def members():
    return jsonify({"members": "member123"})

@app.route("/api/code",methods=['POST'])
def code():
  openai.api_key = "<API KEY>"
  data = request.get_json()
  choice = data.get('choice','')
  program = data.get('program','')
  if not choice or not program:
        return jsonify({"error": "Invalid data sent from the frontend"}), 400

  
  prompt = f"Generate only code for{choice} program to {program}. There should no description strictly"

  response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo-16k-0613",
  messages=[
    {
      "role": "user",
      "content": prompt
    }
  ],
  temperature=0.83,
  max_tokens=256,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0
  )
  resp = response.choices[0].message.content
  list = resp.splitlines()
  for i in range(2):
    index_to_remove = next((i for i, elem in enumerate(list) if "```" in elem), None)

    if index_to_remove is not None:
        if i == 0:
            list = list[index_to_remove + 1 :]
        else:
            list = list[:index_to_remove]
  return jsonify({"code": list})

@app.route("/api/convert",methods=['POST'])
def recognize_speech():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded file
    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    # Convert audio to the required format using pydub
    audio = AudioSegment.from_file(file_path)
    audio.export(file_path, format="wav")

    recognizer = sr.Recognizer()
    audio_file = sr.AudioFile(file_path)
    with audio_file as source:
        audio_data = recognizer.record(source)

    try:
        # Recognize speech using Google Web Speech API
        text = recognizer.recognize_google(audio_data)
        return jsonify({"text": text})
    except sr.UnknownValueError:
        return jsonify({"error": "Speech was unintelligible"}), 400
    except sr.RequestError as e:
        return jsonify({"error": f"Could not request results from Google Web Speech API; {e}"}), 500
    finally:
        # Clean up the saved file
        os.remove(file_path)



if __name__ == "__main__":
   if not os.path.exists("uploads"):
        os.makedirs("uploads")
    app.run(debug=True)
