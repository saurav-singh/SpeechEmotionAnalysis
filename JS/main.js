var RECORDER = null;

const main = async () => {

  let source = await retrieve_input_source();

  let config = {
    workerDir: "JS/lib/",
    encoding: "wav",
  }

  RECORDER = new WebAudioRecorder(source, config);

  initialize_event_handlers();
}

// Initalize Medida Device source for recording
const retrieve_input_source = async () => {

  const constraints = { audio: true, video: false };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);

  return source;
}

const start = () => {
  // Start recording
  if (!RECORDER.isRecording()) {
    RECORDER.startRecording();
  }

  // Update UI
  $("#start").toggle();
  $("#stop").toggle();
  $("#status").html("Recording Started, Please start speaking...")
}

const stop = (error = false) => {
  // Stop Recording
  if (RECORDER.isRecording()) {
    RECORDER.finishRecording();
  }

  // Update UI
  $("#stop").toggle();
  $(".record_button").toggle();

  if (!error)
    $("#status").html("Analyzing audio sample, please wait...");
  else
    $("#status").html("Error, Please try with a different device / browser...");

}

const render_player_download = (blob) => {
  const blob_url = URL.createObjectURL(blob);

  // Add audio source
  $("#audio_sample_player").attr("src", blob_url);

  // Add audio download link
  $("#audio_sample_dl").attr("href", blob_url);

  // Render player and download link
  $("#audio_sample_player").toggle();
  $("#audio_sample_dl").toggle();
  $("#audio_sample").css("visibility", "visible");
}

// API post request to server
const retrieve_emotion = async (BLOB) => {
  const API = "https://vokaturi-wrapper.herokuapp.com/audio";
  // const API = "http://localhost:5000/audio"

  var form_data = new FormData();

  form_data.append("file", BLOB);

  const response = await $.ajax({
    type: "POST",
    url: API,
    data: form_data,
    processData: false,
    contentType: false,
  });

  return response;
}

const generate_report = async (response) => {


  const result = await response;

  // Display Error Status
  if (result == "ERROR") {
    $("#status").html("Server Error, Please try again later.");
    return;
  }



  // Process result data
  let labels = [];
  let values = [];

  try {

    for (const label in result) {
      labels.push(label);

      let value = result[label];
      // Convert value from [0-1] range to [0-100]%
      // value = parseFloat((value * 100).toFixed(2));
      value = parseFloat((value * 100));
      values.push(value);
    }

  }
  catch (error) {
    alert("Error, Please try again later");
  }

  // Display Complete Status
  if (labels.length == 0) {
    $("#status").html("Insufficient audio data! Please try again.");
    return;
  }

  // Setup Chart
  setup_chart(labels, values);

  // Render Chart
  render_chart();

  // Display Complete Status
  $("#status").html("Analysis complete! View results below.");
  $("#status").css("color", "springgreen");
};


// Event Handlers
const initialize_event_handlers = () => {
  RECORDER.onComplete = onRecordComplete;
  RECORDER.onError = onRecordError;
}

const onRecordComplete = (recorder, blob) => {
  render_player_download(blob);
  const response = retrieve_emotion(blob);
  generate_report(response);
}

const onRecordError = (recorder, message) => {
  alert(message);
  stop(true);
}

// Initialize Script
main();