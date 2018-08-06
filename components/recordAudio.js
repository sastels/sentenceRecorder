import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

import Recorder from "recorder-js";

const isBrowser = typeof window !== "undefined";

const audioContext = isBrowser
  ? new (window.AudioContext || window.webkitAudioContext)()
  : undefined;

const recorder = new Recorder(audioContext, {
  // An array of 255 Numbers
  // You can use this to visualize the audio stream
  // If you use react, check out react-wave-stream
  // onAnalysed: data => console.log(data),
});

const createRecordingStream = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => recorder.init(stream))
    .catch(err => console.log("Uh oh... unable to get stream...", err)); // eslint-disable-line no-console
};

if (isBrowser) {
  createRecordingStream();
}

const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px"
  },
  title: {
    marginBottom: 6 * theme.spacing.unit
  },
  sentence: {
    margin: 2 * theme.spacing.unit
  },
  navigationButtonContainer: {
    margin: theme.spacing.unit
  },
  button: {
    textTransform: "none",
    margin: theme.spacing.unit,
    marginBottom: 4 * theme.spacing.unit
  },
  recordingLine: {
    margin: theme.spacing.unit
  }
});

class RecordAudio extends Component {
  state = {
    // audioStreamCreated: true,
    sentences: ["Go attack the germs!!", "This is Khalai."],
    sentenceIndex: 0,
    blob: null,
    isRecording: false
  };

  startRecording = () => {
    recorder.start().then(() => {
      this.setState({ blob: null, isRecording: true });
    });
  };

  stopRecording = () => {
    if (this.state.isRecording) {
      recorder.stop().then(({ blob }) => {
        this.setState({ blob: blob, isRecording: false });
      });
    }
  };

  clearRecording = () => {
    this.setState({ blob: null });
  };

  upload = () => {
    this.props.uploadAudio(
      this.state.sentences[this.state.sentenceIndex],
      this.state.sentenceIndex,
      this.state.blob
    );
  };

  addToIndex = increment => {
    this.setState({
      sentenceIndex:
        (this.state.sentenceIndex + increment + this.state.sentences.length) %
        this.state.sentences.length
    });
    this.clearRecording();
  };

  buttonValue = () => {
    switch (true) {
      case this.state.blob != null:
        return "Record Again";
      case this.state.isRecording:
        return "Stop";
      default:
        return "Record";
    }
  };

  handleButtonPress = () => {
    switch (this.buttonValue()) {
      case "Stop":
        this.stopRecording();
        break;
      default:
        this.startRecording();
    }
  };

  recordingMessage = () => {
    switch (true) {
      case this.buttonValue() === "Record":
        return "Press Record to begin";
      case this.buttonValue() === "Stop":
        return "Recording... Press Stop to end";
      case this.state.sentenceIndex < this.state.sentences.length - 1:
        return "Done recording! Go to Next page or re-record this page.";
      default:
        return "Done recording! Re-record or press Next to finish";
    }
  };

  handlePreviousButton = () => {
    this.addToIndex(-1);
  };

  handleNextButton = () => {
    this.upload();
    if (this.state.sentenceIndex === this.state.sentences.length - 1) {
      this.props.nextSection();
    } else {
      this.addToIndex(1);
    }
  };

  render() {
    const { classes } = this.props;
    const sentence = this.state.sentences[this.state.sentenceIndex];

    return (
      <div className={classes.app}>
        <Typography variant="headline" className={classes.title}>
          Read a short story
        </Typography>

        <Typography variant="title" className={classes.sentence}>
          {sentence}
        </Typography>

        <div className={classes.navigationButtonContainer}>
          <Button
            className={classes.button}
            onClick={this.handlePreviousButton}
            disabled={this.state.sentenceIndex === 0}
          >
            <KeyboardArrowLeft />
          </Button>

          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={this.handleButtonPress}
          >
            {this.buttonValue()}
          </Button>

          <Button
            className={classes.button}
            onClick={this.handleNextButton}
            disabled={this.state.blob === null}
          >
            <KeyboardArrowRight />
          </Button>
        </div>

        <div className={classes.recordingLine}>{this.recordingMessage()}</div>

        {this.state.blob ? (
          <div>
            <audio controls={true} src={URL.createObjectURL(this.state.blob)} />
            <Button
              className={classes.button}
              onClick={this.upload}
              disabled={this.state.isRecording}
            >
              Upload
            </Button>
          </div>
        ) : (
          ""
        )}

        <div style={{ marginTop: "50px" }}>
          Page {this.state.sentenceIndex + 1} / {this.state.sentences.length}
        </div>
      </div>
    );
  }
}

RecordAudio.propTypes = {
  classes: PropTypes.object.isRequired,
  uploadAudio: PropTypes.func.isRequired,
  nextSection: PropTypes.func.isRequired
};

export default withStyles(styles)(RecordAudio);
